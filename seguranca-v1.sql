-- ============================================================
-- BLINDAGEM DE SEGURANÇA v1 — Portal Britto Laticínios
--
-- COMO USAR: Supabase → SQL Editor → cole este arquivo inteiro → Run.
-- IMPORTANTE: rode este arquivo SOMENTE DEPOIS que a versão nova do
-- portal estiver no ar (o site atualiza sozinho pelo Vercel).
-- Pode rodar mais de uma vez sem problema.
--
-- O que este script faz:
--  1. Criptografa as senhas dos vendedores (e apaga as senhas legíveis)
--  2. Move o login do admin para o banco, também criptografado
--  3. Cria o sistema de sessões (o "crachá" que o app apresenta)
--  4. Liga o RLS (Row Level Security): sem crachá válido, o banco
--     não deixa ler nem escrever NADA; vendedor só vê a própria
--     carteira; só o admin gerencia produtos/clientes/vendedores.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- 1) Senhas criptografadas ----------
alter table vendedores add column if not exists senha_hash text;
alter table vendedores alter column senha drop not null;
update vendedores set senha_hash = crypt(senha, gen_salt('bf'))
  where senha is not null and senha <> '' and senha_hash is null;
update vendedores set senha = null;  -- apaga as senhas legíveis

alter table clientes add column if not exists senha_hash text;
alter table clientes alter column senha drop not null;
update clientes set senha_hash = crypt(senha, gen_salt('bf'))
  where senha is not null and senha <> '' and senha_hash is null;
update clientes set senha = null;

-- Quando o admin cadastrar/alterar um vendedor ou cliente pelo app, a senha
-- chega em texto e é criptografada na hora, nunca ficando salva legível.
create or replace function trg_hash_senha() returns trigger
language plpgsql as $$
begin
  if new.senha is not null and new.senha <> '' then
    new.senha_hash := crypt(new.senha, gen_salt('bf'));
    new.senha := null;
  else
    -- upsert sem senha nova: preserva o hash já existente
    if tg_op = 'UPDATE' and (new.senha_hash is null or new.senha_hash = '') then
      new.senha_hash := old.senha_hash;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists vendedores_hash_senha on vendedores;
create trigger vendedores_hash_senha before insert or update on vendedores
  for each row execute function trg_hash_senha();
drop trigger if exists clientes_hash_senha on clientes;
create trigger clientes_hash_senha before insert or update on clientes
  for each row execute function trg_hash_senha();

-- ---------- 2) Login do administrador ----------
create table if not exists admins (
  usuario text primary key,
  senha_hash text not null
);
insert into admins (usuario, senha_hash)
  values ('britto', crypt('britto2026', gen_salt('bf')))
  on conflict (usuario) do nothing;

-- ---------- 3) Sessões (o "crachá") ----------
create table if not exists sessoes (
  token uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('admin', 'vendedor')),
  vendedor_id text,
  criado_em timestamptz not null default now(),
  expira_em timestamptz not null default now() + interval '60 days'
);

-- Login: confere usuário e senha DENTRO do banco e devolve o crachá.
create or replace function portal_login(p_usuario text, p_senha text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v record;
  a record;
  t uuid;
begin
  -- limpeza de sessões vencidas (aproveitando a passagem)
  delete from sessoes where expira_em < now();

  select * into a from admins where lower(usuario) = lower(trim(p_usuario));
  if found and a.senha_hash = crypt(p_senha, a.senha_hash) then
    insert into sessoes (tipo) values ('admin') returning token into t;
    return json_build_object('tipo', 'admin', 'token', t);
  end if;

  select * into v from vendedores where lower(usuario) = lower(trim(p_usuario));
  if found and v.senha_hash is not null and v.senha_hash = crypt(p_senha, v.senha_hash) then
    insert into sessoes (tipo, vendedor_id) values ('vendedor', v.id) returning token into t;
    return json_build_object('tipo', 'vendedor', 'token', t, 'vendedor_id', v.id, 'vendedor_nome', v.nome);
  end if;

  return null;  -- usuário ou senha errados
end;
$$;

-- O crachá vem no cabeçalho x-portal-token de cada chamada do app.
create or replace function portal_token() returns text
language sql stable as
$$ select coalesce(current_setting('request.headers', true)::json->>'x-portal-token', '') $$;

create or replace function portal_tipo() returns text
language sql security definer stable set search_path = public as
$$ select tipo from sessoes where token::text = portal_token() and expira_em > now() limit 1 $$;

create or replace function portal_vendedor_id() returns text
language sql security definer stable set search_path = public as
$$ select vendedor_id from sessoes where token::text = portal_token() and expira_em > now() limit 1 $$;

create or replace function portal_logout() returns void
language sql security definer set search_path = public as
$$ delete from sessoes where token::text = portal_token() $$;

grant execute on function portal_login(text, text) to anon, authenticated;
grant execute on function portal_tipo() to anon, authenticated;
grant execute on function portal_logout() to anon, authenticated;

-- ---------- 4) RLS: as regras de quem pode ver e mexer no quê ----------
alter table industrias enable row level security;
alter table produtos enable row level security;
alter table vendedores enable row level security;
alter table clientes enable row level security;
alter table precos_cliente enable row level security;
alter table pedidos enable row level security;
alter table itens_pedido enable row level security;
alter table sessoes enable row level security;  -- sem política = ninguém acessa direto
alter table admins enable row level security;   -- idem

-- Catálogo (indústrias e produtos): quem está logado lê; só admin altera.
drop policy if exists sel_industrias on industrias;
create policy sel_industrias on industrias for select using (portal_tipo() is not null);
drop policy if exists adm_industrias on industrias;
create policy adm_industrias on industrias for all
  using (portal_tipo() = 'admin') with check (portal_tipo() = 'admin');

drop policy if exists sel_produtos on produtos;
create policy sel_produtos on produtos for select using (portal_tipo() is not null);
drop policy if exists adm_produtos on produtos;
create policy adm_produtos on produtos for all
  using (portal_tipo() = 'admin') with check (portal_tipo() = 'admin');

-- Vendedores: cada um vê só o próprio cadastro; admin vê e gerencia todos.
drop policy if exists sel_vendedores on vendedores;
create policy sel_vendedores on vendedores for select
  using (portal_tipo() = 'admin' or (portal_tipo() = 'vendedor' and id = portal_vendedor_id()));
drop policy if exists adm_vendedores on vendedores;
create policy adm_vendedores on vendedores for all
  using (portal_tipo() = 'admin') with check (portal_tipo() = 'admin');

-- Clientes: vendedor vê só a própria carteira; admin vê e gerencia todos.
drop policy if exists sel_clientes on clientes;
create policy sel_clientes on clientes for select
  using (portal_tipo() = 'admin' or (portal_tipo() = 'vendedor' and vendedor_id = portal_vendedor_id()));
drop policy if exists adm_clientes on clientes;
create policy adm_clientes on clientes for all
  using (portal_tipo() = 'admin') with check (portal_tipo() = 'admin');

-- Preços por cliente: quem está logado lê; só admin altera.
drop policy if exists sel_precos on precos_cliente;
create policy sel_precos on precos_cliente for select using (portal_tipo() is not null);
drop policy if exists adm_precos on precos_cliente;
create policy adm_precos on precos_cliente for all
  using (portal_tipo() = 'admin') with check (portal_tipo() = 'admin');

-- Pedidos: vendedor vê e cria os próprios; admin vê tudo e confirma.
drop policy if exists sel_pedidos on pedidos;
create policy sel_pedidos on pedidos for select
  using (portal_tipo() = 'admin' or (portal_tipo() = 'vendedor' and vendedor_id = portal_vendedor_id()));
drop policy if exists ins_pedidos on pedidos;
create policy ins_pedidos on pedidos for insert
  with check (portal_tipo() = 'admin' or (portal_tipo() = 'vendedor' and vendedor_id = portal_vendedor_id()));
drop policy if exists adm_pedidos on pedidos;
create policy adm_pedidos on pedidos for update
  using (portal_tipo() = 'admin') with check (portal_tipo() = 'admin');
drop policy if exists del_pedidos on pedidos;
create policy del_pedidos on pedidos for delete using (portal_tipo() = 'admin');

-- Itens de pedido: seguem a regra do pedido a que pertencem.
drop policy if exists sel_itens on itens_pedido;
create policy sel_itens on itens_pedido for select
  using (portal_tipo() = 'admin' or exists (
    select 1 from pedidos p where p.id = pedido_id and p.vendedor_id = portal_vendedor_id()
  ));
drop policy if exists ins_itens on itens_pedido;
create policy ins_itens on itens_pedido for insert
  with check (portal_tipo() = 'admin' or exists (
    select 1 from pedidos p where p.id = pedido_id and p.vendedor_id = portal_vendedor_id()
  ));
drop policy if exists adm_itens on itens_pedido;
create policy adm_itens on itens_pedido for update
  using (portal_tipo() = 'admin') with check (portal_tipo() = 'admin');
drop policy if exists del_itens on itens_pedido;
create policy del_itens on itens_pedido for delete using (portal_tipo() = 'admin');

-- ============================================================
-- PLANO B (só em emergência): se algo der errado e o portal parar,
-- cole e rode APENAS as linhas abaixo para desligar a proteção
-- (o portal volta a funcionar como antes, sem a blindagem):
--
-- alter table industrias disable row level security;
-- alter table produtos disable row level security;
-- alter table vendedores disable row level security;
-- alter table clientes disable row level security;
-- alter table precos_cliente disable row level security;
-- alter table pedidos disable row level security;
-- alter table itens_pedido disable row level security;
-- ============================================================
