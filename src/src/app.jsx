import React, { useState, useEffect } from 'react';

// ---------- DADOS INICIAIS (mock) ----------
// Cada indústria/fornecedor tem sua própria regra de embalagem e pedido mínimo.
const INDUSTRIAS_INICIAIS = [
  {
    id: 'ind1',
    nome: 'Santa Clara',
    unidadesPorCaixa: 12,
    caixasPorPallet: 85,
    pallettesMinimoPorPedido: 12,
    corSelo: { bg: '#0a3a8c', texto: '#ffd166' }, // azul-marinho com dourado
    regraCarga: 'Carreta: 24 pallets · pode ser tudo Integral na carga',
  },
  {
    id: 'ind2',
    nome: 'Amanhecer',
    unidadesPorCaixa: 12,
    caixasPorPallet: 90,
    pallettesMinimoPorPedido: 14,
    corSelo: { bg: '#2e7d4f', texto: '#ffe066' }, // verde com amarelo
    regraCarga: 'Carreta: 28 pallets · mínimo 2 pallets de Desnatado ou Semidesnatado na carga',
  },
  {
    id: 'ind3',
    nome: 'Terra Viva',
    unidadesPorCaixa: 12,
    caixasPorPallet: 90,
    pallettesMinimoPorPedido: 14,
    corSelo: { bg: '#b3201c', texto: '#ffe066' }, // vermelho com amarelo
    regraCarga: 'Carreta: 28 pallets · mínimo 2 pallets de Desnatado ou Semidesnatado na carga',
  },
  {
    id: 'ind4',
    nome: 'Dália Alimentos',
    unidadesPorCaixa: 12,
    caixasPorPallet: 85,
    pallettesMinimoPorPedido: 12,
    corSelo: { bg: '#6b4ca8', texto: '#ffe066' }, // roxo com amarelo
    regraCarga: 'Carreta: 24 pallets · pode ser tudo Integral na carga',
  },
  {
    id: 'ind5',
    nome: 'Lac',
    tipoVenda: 'peso', // diferente das demais: vendido por kg, peso variável (não por unidade/pallet fechado)
    pecasPorCaixa: 6,
    kgPorPecaAprox: 4,
    caixasPorPallet: 40,
    kgPorPalletAprox: 1000,
    pesoMinimoKgPorPedido: 500,
    corSelo: { bg: '#1c4f9c', texto: '#ffe066' }, // azul com amarelo, como a marca Lac
    regraCarga: 'Mínimo de 1.000 kg por CNPJ · Peça: ~4 kg (aprox.) · Caixa: 6 peças',
  },
  {
    id: 'ind6',
    nome: 'Las Tres Ninas',
    tipoVenda: 'peso', // vendido por kg, peso variável — igual ao Lac
    pecasPorCaixa: 6,
    kgPorPecaAprox: 2.6,
    caixasPorPallet: 64, // aproximação: ~1000kg / (6 peças x 2,6kg)
    kgPorPalletAprox: 1000,
    pesoMinimoKgPorPedido: 12000,
    corSelo: { bg: '#a8326b', texto: '#ffe066' }, // rosa/magenta com amarelo
    regraCarga: 'Mínimo de 12.000 kg por CNPJ · Peça: ~2,6 kg (aprox.) · Caixa: 6 peças',
  },
  {
    id: 'ind7',
    nome: 'Gran Filata',
    tipoVenda: 'peso', // vendido por kg, peso variável
    pecasPorCaixa: 6,
    kgPorPecaAprox: 4,
    caixasPorPallet: 42, // aproximação: ~1000kg / (6 peças x 4kg)
    kgPorPalletAprox: 1000,
    pesoMinimoKgPorPedido: 500,
    corSelo: { bg: '#0f6e6a', texto: '#ffe066' }, // verde-azulado com amarelo
    regraCarga: 'Peça: ~4 kg (aprox.) · Caixa: 6 peças',
  },
  {
    id: 'ind8',
    nome: 'Amanhecer - Creme de Leite',
    unidadesPorCaixa: 27,
    caixasPorPallet: 165,
    pallettesMinimoPorPedido: 14,
    corSelo: { bg: '#4a9d6b', texto: '#ffe066' }, // verde mais claro, ligado ao Amanhecer
    regraCarga: 'Venda paletizada · Caixa: 27 unidades · Pallet: 165 caixas',
  },
  {
    id: 'ind9',
    nome: 'Natville',
    unidadesPorCaixa: 12,
    caixasPorPallet: 85,
    pallettesMinimoPorPedido: 14,
    corSelo: { bg: '#c2410c', texto: '#ffffff' }, // laranja queimado
    regraCarga: 'Carreta: 28 pallets · venda paletizada',
  },
  {
    id: 'ind10',
    nome: 'Natville - Creme de Leite',
    unidadesPorCaixa: 27,
    caixasPorPallet: 165,
    pallettesMinimoPorPedido: 14,
    corSelo: { bg: '#d97706', texto: '#ffffff' }, // âmbar, ligado à Natville
    regraCarga: 'Venda paletizada · Caixa: 27 unidades · Pallet: 165 caixas',
  },
  {
    id: 'ind11',
    nome: 'Natville - Leite Condensado',
    unidadesPorCaixa: 27,
    caixasPorPallet: 105,
    pallettesMinimoPorPedido: 14,
    corSelo: { bg: '#92400e', texto: '#ffffff' }, // âmbar escuro, ligado à Natville
    regraCarga: 'Venda paletizada · Caixa: 27 unidades · Pallet: 105 caixas',
  },
  {
    id: 'ind12',
    nome: 'Dália Alimentos - Frios',
    tipoVenda: 'peso', // vendido por kg, caixas fechadas de ~20kg
    pecasPorCaixa: 1,
    kgPorPecaAprox: 20,
    caixasPorPallet: 50, // aproximação: 1000kg / 20kg por caixa
    kgPorPalletAprox: 1000,
    pesoMinimoKgPorPedido: 1000, // venda paletizada: mínimo 1 pallet fechado
    corSelo: { bg: '#8a6bc0', texto: '#ffe066' }, // roxo mais claro, ligado ao Dália
    regraCarga: 'Venda paletizada · Caixa: ~20 kg (aprox.) · Pallet: ~1.000 kg',
  },
  {
    id: 'ind13',
    nome: 'Parlak',
    tipoVenda: 'peso', // vendido por kg, peso variável — igual ao Lac/Gran Filata
    pecasPorCaixa: 6,
    kgPorPecaAprox: 4,
    caixasPorPallet: 42, // aproximação: ~1000kg / (6 peças x 4kg) — confirmar com o fornecedor
    kgPorPalletAprox: 1000,
    pesoMinimoKgPorPedido: 500,
    corSelo: { bg: '#b8860b', texto: '#ffffff' }, // dourado escuro
    regraCarga: 'Peça: ~4 kg (aprox.) · Caixa: 6 peças',
  },
];

// PARA INSERIR A FOTO REAL DE UM PRODUTO:
// Troque "foto: null" por "foto: 'URL_DA_SUA_IMAGEM_AQUI'" (ex: link do seu Google Drive,
// ou depois, link do Supabase Storage quando migrarmos pra lá).
// Enquanto "foto" estiver null, o app mostra um ícone de placeholder colorido no lugar.
const PRODUTOS_BASE = [
  { id: 'p1', nome: 'Leite UHT Integral 1L com Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind1', tampa: true, precoPadrao: 5.35 },
  { id: 'p2', nome: 'Leite UHT Desnatado 1L com Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind1', tampa: true, precoPadrao: 5.35 },
  { id: 'p3', nome: 'Leite UHT Semidesnatado 1L com Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind1', tampa: true, precoPadrao: 5.35 },
  { id: 'p8', nome: 'Leite UHT Semidesnatado Zero Lactose 1L com Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind1', tampa: true, precoPadrao: 5.85 },
  { id: 'p9', nome: 'Leite UHT Integral 1L sem Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind2', tampa: false, precoPadrao: 5.09 },
  { id: 'p10', nome: 'Leite UHT Desnatado 1L com Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind2', tampa: true, precoPadrao: 5.09 },
  { id: 'p11', nome: 'Leite UHT Semidesnatado 1L com Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind2', tampa: true, precoPadrao: 5.09 },
  { id: 'p12', nome: 'Leite UHT Semidesnatado Zero Lactose 1L com Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind2', tampa: true, precoPadrao: 5.59 },
  { id: 'p13', nome: 'Leite UHT Integral 1L sem Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind3', tampa: false, precoPadrao: 4.99 },
  { id: 'p14', nome: 'Leite UHT Desnatado 1L sem Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind3', tampa: false, precoPadrao: 4.99 },
  { id: 'p15', nome: 'Leite UHT Semidesnatado 1L sem Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind3', tampa: false, precoPadrao: 4.99 },
  { id: 'p16', nome: 'Leite UHT Semidesnatado Zero Lactose 1L com Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind3', tampa: true, precoPadrao: 5.49 },
  { id: 'p17', nome: 'Leite UHT Integral 1L com Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind4', tampa: true, precoPadrao: 5.45 },
  { id: 'p18', nome: 'Leite UHT Desnatado 1L com Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind4', tampa: true, precoPadrao: 5.45 },
  { id: 'p19', nome: 'Leite UHT Semidesnatado 1L com Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind4', tampa: true, precoPadrao: 5.45 },
  { id: 'p20', nome: 'Leite UHT Semidesnatado Zero Lactose 1L com Tampa', categoria: 'Leite UHT', validadeDias: 120, foto: null, industriaId: 'ind4', tampa: true, precoPadrao: 5.95 },
  { id: 'p21', nome: 'Queijo Mussarela LAC (peso variável)', categoria: 'Queijo Mussarela', validadeDias: 90, validadeObs: 'a partir da data de fabricação', foto: null, industriaId: 'ind5', precoPadrao: 34.99 },
  { id: 'p22', nome: 'Queijo Prato Las Tres Ninas (peso variável)', categoria: 'Queijo Prato', validadeDias: 180, foto: null, industriaId: 'ind6', precoPadrao: 31.99 },
  { id: 'p23', nome: 'Mussarela Gran Filata (peso variável)', categoria: 'Queijo Mussarela', foto: null, industriaId: 'ind7', unidadeVenda: 'kg', precoPadrao: 34.99 },
  { id: 'p24', nome: 'Creme de Leite 10% Gordura', categoria: 'Creme de Leite', foto: null, industriaId: 'ind8', precoPadrao: 2.09 },
  { id: 'p25', nome: 'Creme de Leite 17% Gordura', categoria: 'Creme de Leite', foto: null, industriaId: 'ind8', precoPadrao: 2.39 },
  { id: 'p26', nome: 'Leite UHT Integral 1L', categoria: 'Leite UHT', foto: null, industriaId: 'ind9', precoPadrao: 5.79 },
  { id: 'p27', nome: 'Leite UHT Desnatado 1L', categoria: 'Leite UHT', foto: null, industriaId: 'ind9', precoPadrao: 5.79 },
  { id: 'p28', nome: 'Leite UHT Semidesnatado 1L', categoria: 'Leite UHT', foto: null, industriaId: 'ind9', precoPadrao: 5.79 },
  { id: 'p29', nome: 'Leite UHT Semidesnatado Zero Lactose 1L', categoria: 'Leite UHT', foto: null, industriaId: 'ind9', precoPadrao: 6.29 },
  { id: 'p30', nome: 'Creme de Leite 15% Gordura', categoria: 'Creme de Leite', foto: null, industriaId: 'ind10', precoPadrao: 2.49 },
  { id: 'p31', nome: 'Leite Condensado Semidesnatado', categoria: 'Leite Condensado', foto: null, industriaId: 'ind11', precoPadrao: 5.09 },
  { id: 'p32', nome: 'Calabresa Reta', categoria: 'Embutidos', foto: null, industriaId: 'ind12', precoPadrao: 18.90 },
  { id: 'p33', nome: 'Bacon Manta Especial', categoria: 'Embutidos', foto: null, industriaId: 'ind12', precoPadrao: 21.90 },
  { id: 'p34', nome: 'Bacon Paleta Extra', categoria: 'Embutidos', foto: null, industriaId: 'ind12', precoPadrao: 18.90 },
  { id: 'p35', nome: 'Mussarela Parlak (peso variável)', categoria: 'Queijo Mussarela', foto: null, industriaId: 'ind13', precoPadrao: 36.99 },
  { id: 'p36', nome: 'Queijo Prato Parlak (peso variável)', categoria: 'Queijo Prato', foto: null, industriaId: 'ind13', precoPadrao: 38.99 },
];

// Vendedores/representantes da Britto Laticínios. Cada um tem login próprio e
// vê apenas a carteira de clientes atribuída a ele (campo vendedorId em CLIENTES_INICIAIS).
const VENDEDORES_INICIAIS = [
  { id: 'v1', usuario: 'joao', senha: '1234', nome: 'João Silva' },
  { id: 'v2', usuario: 'maria', senha: '1234', nome: 'Maria Souza' },
  { id: 'v3', usuario: 'diego', senha: '1234', nome: 'Diego' },
  { id: 'v4', usuario: 'josi', senha: '1234', nome: 'Josi' },
  { id: 'v5', usuario: 'elaine', senha: '1234', nome: 'Elaine' },
  { id: 'v6', usuario: 'leandro', senha: '1234', nome: 'Leandro' },
  { id: 'v7', usuario: 'junior', senha: '1234', nome: 'Júnior' },
  { id: 'v8', usuario: 'marcelo', senha: '1234', nome: 'Marcelo' },
];

const CLIENTES_INICIAIS = [
  {
    id: 'c1',
    usuario: 'mercadocentral',
    senha: '1234',
    nomeFantasia: 'Mercado Central Distribuidora',
    cnpj: '12.345.678/0001-90',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v1',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c2',
    usuario: 'atacarejosul',
    senha: '1234',
    nomeFantasia: 'Atacarejo Sul Supermercados',
    cnpj: '98.765.432/0001-11',
    prazoPagamento: 'À vista',
    vendedorId: 'v1',
    precos: { p1: 4.05, p2: 4.05, p3: 4.05, p8: 4.55, p9: 3.95, p10: 3.95, p11: 3.95, p12: 4.45, p13: 4.00, p14: 4.00, p15: 4.00, p16: 4.50, p17: 4.10, p18: 4.10, p19: 4.10, p20: 4.60, p21: 25.90, p4: 27.80, p5: 26.40, p6: 19.20, p7: 9.10 },
  },
  {
    id: 'c3',
    usuario: 'boaesperanca',
    senha: '1234',
    nomeFantasia: 'Laticínios Boa Esperança de Araruama LTDA',
    cnpj: '29.840.154/0002-54',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v3',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c4',
    usuario: 'superdelli',
    senha: '1234',
    nomeFantasia: 'Superdelli Atacado e Superm. SA',
    cnpj: '35.881.333/0001-51',
    prazoPagamento: '28 dias',
    vendedorId: 'v4',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c5',
    usuario: 'superkibarato',
    senha: '1234',
    nomeFantasia: 'Comercial Superkibarato Santa Rita Ltda',
    cnpj: '12.846.452/0005-00',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v4',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c6',
    usuario: 'ramar',
    senha: '1234',
    nomeFantasia: 'Ramar Comércio de Produtos Alimentícios Ltda',
    cnpj: '13.487.380/0001-82',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v4',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c7',
    usuario: 'rezende',
    senha: '1234',
    nomeFantasia: 'Rezende Alimentos JPA Ltda',
    cnpj: '50.250.937/0003-55',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v4',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c8',
    usuario: 'lumiar',
    senha: '1234',
    nomeFantasia: 'Lumiar de Campos Comercial de Alimentos Ltda',
    cnpj: '08.343.578/0001-23',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v5',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c9',
    usuario: 'camposPavani',
    senha: '1234',
    nomeFantasia: 'Campos Pavani de Macaé Comércio de Alimentos Ltda',
    cnpj: '08.472.686/0001-25',
    prazoPagamento: '28 dias',
    vendedorId: 'v5',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c10',
    usuario: 'jcferreira',
    senha: '1234',
    nomeFantasia: 'J. C. Ferreira Atacado Distribuidor Ltda',
    cnpj: '42.735.157/0001-05',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v5',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c11',
    usuario: 'norteflu',
    senha: '1234',
    nomeFantasia: 'Supermercado Norte Flu Ltda',
    cnpj: '29.679.669/0002-14',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v5',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c12',
    usuario: 'fsmercearia',
    senha: '1234',
    nomeFantasia: 'FS Mercearia e Bazar Ltda (FS Atacado)',
    cnpj: '41.664.575/0001-96',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v5',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c13',
    usuario: 'mercadomacae',
    senha: '1234',
    nomeFantasia: 'Mercado Macaé Atacadista e Varejista Ltda',
    cnpj: '44.124.392/0001-76',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v5',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c14',
    usuario: 'reluzgrussai',
    senha: '1234',
    nomeFantasia: 'Supermercado Reluz Nova Grussaí Ltda (Filial 2)',
    cnpj: '39.792.828/0003-27',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v5',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c15',
    usuario: 'bomfrios',
    senha: '1234',
    nomeFantasia: 'Bomfrios Comércio de Alimentos Ltda',
    cnpj: '11.037.284/0001-07',
    prazoPagamento: '7 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c16',
    usuario: 'classicos',
    senha: '1234',
    nomeFantasia: 'Classicos Comércio de Alimentos Ltda',
    cnpj: '14.568.548/0002-28',
    prazoPagamento: '7 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c17',
    usuario: 'controle',
    senha: '1234',
    nomeFantasia: 'Controle Comércio de Alimentos Ltda',
    cnpj: '25.311.480/0001-32',
    prazoPagamento: '7 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c18',
    usuario: 'amigaozao',
    senha: '1234',
    nomeFantasia: 'Amigaozao Mercado Ltda',
    cnpj: '16.505.912/0001-55',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c19',
    usuario: 'santoaleixo',
    senha: '1234',
    nomeFantasia: 'Mercado Santo Aleixo RJ Ltda',
    cnpj: '48.878.208/0001-34',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c20',
    usuario: 'riosulpilar',
    senha: '1234',
    nomeFantasia: 'Supermercado Rio Sul do Pilar Ltda',
    cnpj: '33.255.424/0001-56',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c21',
    usuario: 'riosulgramacho',
    senha: '1234',
    nomeFantasia: 'Supermercado Rio Sul do Gramacho Ltda',
    cnpj: '35.458.607/0001-02',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c22',
    usuario: 'riosullaureano',
    senha: '1234',
    nomeFantasia: 'Supermercado Rio Sul do Laureano',
    cnpj: '41.475.101/0001-04',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c23',
    usuario: 'riosulxerem',
    senha: '1234',
    nomeFantasia: 'Mercado Rio Sul de Xerém Ltda',
    cnpj: '49.365.479/0001-59',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c24',
    usuario: 'jardimatlantico',
    senha: '1234',
    nomeFantasia: 'Supermercado Jardim Atlântico Ltda',
    cnpj: '57.489.708/0001-75',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c25',
    usuario: 'riosulcentenario',
    senha: '1234',
    nomeFantasia: 'Supermercado Rio Sul do Centenário Ltda',
    cnpj: '33.749.495/0001-05',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c26',
    usuario: 'riocomprido',
    senha: '1234',
    nomeFantasia: 'Supermercado Rio Comprido Ltda',
    cnpj: '52.722.054/0001-64',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c27',
    usuario: 'riosulpantanal',
    senha: '1234',
    nomeFantasia: 'Supermercado Rio Sul do Pantanal Ltda',
    cnpj: '28.048.381/0001-06',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c28',
    usuario: 'patriota',
    senha: '1234',
    nomeFantasia: 'Distribuidora Patriota Ltda',
    cnpj: '47.882.695/0001-46',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c29',
    usuario: 'riosulseropedica',
    senha: '1234',
    nomeFantasia: 'Supermercado Rio Sul de Seropédica Ltda',
    cnpj: '50.366.423/0001-06',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c30',
    usuario: 'riosulprimavera',
    senha: '1234',
    nomeFantasia: 'Supermercado Rio Sul de Primavera Ltda',
    cnpj: '33.765.158/0001-01',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c31',
    usuario: 'mercadorcitaguai',
    senha: '1234',
    nomeFantasia: 'Mercado RC de Itaguaí Ltda',
    cnpj: '58.113.396/0001-63',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c32',
    usuario: 'fluminenseitaperuna',
    senha: '1234',
    nomeFantasia: 'Supermercado Fluminense de Itaperuna',
    cnpj: '32.336.794/0003-17',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c33',
    usuario: 'cereaisbramil',
    senha: '1234',
    nomeFantasia: 'Cereais Bramil Ltda',
    cnpj: '32.296.378/0002-70',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c34',
    usuario: 'jpinto',
    senha: '1234',
    nomeFantasia: 'J Pinto Comércio de Alimentos',
    cnpj: '11.820.069/0002-69',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c35',
    usuario: 'costazulcampos',
    senha: '1234',
    nomeFantasia: 'Costazul Alimentos Ltda (Campos dos Goytacazes)',
    cnpj: '17.493.338/0003-06',
    prazoPagamento: '21 dias',
    vendedorId: 'v7',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c36',
    usuario: 'costazulvistaalegre',
    senha: '1234',
    nomeFantasia: 'Costazul Alimentos Ltda (São Gonçalo - Vista Alegre)',
    cnpj: '17.493.338/0005-59',
    prazoPagamento: '21 dias',
    vendedorId: 'v7',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c37',
    usuario: 'supermercadosmundial',
    senha: '1234',
    nomeFantasia: 'Supermercados Mundial Ltda',
    cnpj: '33.304.981/0001-10',
    prazoPagamento: '14 dias',
    vendedorId: 'v8',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p22: 31.99, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c38',
    usuario: 'alvorada',
    senha: '1234',
    nomeFantasia: 'Supermercados Alvorada Ltda',
    cnpj: '17.833.301/0001-07',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c39',
    usuario: 'torreecia',
    senha: '1234',
    nomeFantasia: 'Torre e Cia Supermercados S/A',
    cnpj: '07.760.885/0001-76',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c40',
    usuario: 'padraofonseca',
    senha: '1234',
    nomeFantasia: 'Supermercado Padrão do Fonseca Ltda',
    cnpj: '08.628.825/0020-20',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c41',
    usuario: 'realdeeden',
    senha: '1234',
    nomeFantasia: 'Super Mercado Real de Éden Ltda',
    cnpj: '28.800.001/0001-30',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c42',
    usuario: 'gmap',
    senha: '1234',
    nomeFantasia: 'G.M.A.P. Supermercados S.A.',
    cnpj: '05.546.194/0011-10',
    prazoPagamento: '28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c43',
    usuario: 'boibomprime',
    senha: '1234',
    nomeFantasia: 'Boibom Prime Distribuidora de Gêneros Alimentícios Ltda',
    cnpj: '50.143.831/0001-90',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c44',
    usuario: 'milanobrasil',
    senha: '1234',
    nomeFantasia: 'Comercial Milano Brasil Ltda',
    cnpj: '01.920.177/0008-45',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c45',
    usuario: 'ribeirocoimbra',
    senha: '1234',
    nomeFantasia: 'A. Ribeiro Coimbra',
    cnpj: '10.482.618/0001-99',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c46',
    usuario: 'economaispapucaia',
    senha: '1234',
    nomeFantasia: 'Mercearia Economais Ltda (Papucaia)',
    cnpj: '07.676.699/0002-34',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  {
    id: 'c47',
    usuario: 'economaissantaluzia',
    senha: '1234',
    nomeFantasia: 'Mercearia Economais Ltda (Parque Santa Luzia)',
    cnpj: '07.676.699/0001-53',
    prazoPagamento: '14/21/28 dias',
    vendedorId: 'v6',
    precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 },
  },
  { id: 'c48', usuario: 'reluzjockey', senha: '1234', nomeFantasia: 'Supermercado Reluz Jockey Ltda', cnpj: '50.790.829/0001-03', prazoPagamento: '14/21/28 dias', vendedorId: 'v5', precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 } },
  { id: 'c49', usuario: 'pavaniajuda', senha: '1234', nomeFantasia: 'Pavani do bairro Ajuda', cnpj: '08.472.686/0002-06', prazoPagamento: '28 dias', vendedorId: 'v5', precos: { p1: 4.20, p2: 4.20, p3: 4.20, p8: 4.70, p9: 4.10, p10: 4.10, p11: 4.10, p12: 4.60, p13: 4.15, p14: 4.15, p15: 4.15, p16: 4.65, p17: 4.25, p18: 4.25, p19: 4.25, p20: 4.75, p21: 26.50, p4: 28.50, p5: 27.00, p6: 19.90, p7: 9.50 } },
];

// O login do administrador agora é conferido dentro do banco (tabela admins,
// com senha criptografada) — nenhuma senha fica escrita aqui no código.
const WHATSAPP_VENDAS = '5522998145979';
const WHATSAPP_FINANCEIRO = '5522999748356';
const NOTA_TABELA_PRECO = 'Preço sujeito à alteração conforme disponibilidade. Favor sempre consultar o vendedor antes de passar o pedido.';

// ---------- CONEXÃO COM O BANCO DE DADOS (SUPABASE) ----------
const SUPABASE_URL = 'https://cqwnilcejpqqkekeuozn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SXinizCUezL5VyDEfZZ95w_GJ6W0Tu7';

// Crachá (token) da sessão logada. É enviado em toda chamada ao banco no
// cabeçalho x-portal-token — sem ele, o banco não deixa ler nem gravar nada
// (regras de RLS criadas pelo script seguranca-v1.sql).
let portalToken = null;
function setPortalToken(token) {
  portalToken = token;
}

function supabaseHeaders() {
  const h = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };
  if (portalToken) h['x-portal-token'] = portalToken;
  return h;
}

// Faz o login DENTRO do banco (a senha é conferida lá, criptografada) e
// recebe de volta o crachá da sessão. Retorna null se usuário/senha errados.
async function loginNoBanco(usuario, senha) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/portal_login`, {
    method: 'POST',
    headers: supabaseHeaders(),
    body: JSON.stringify({ p_usuario: usuario, p_senha: senha }),
  });
  if (!resp.ok) throw new Error(`Erro ao entrar: ${resp.status}`);
  return resp.json();
}

// Pergunta ao banco se o crachá atual ainda vale. Retorna 'admin', 'vendedor'
// ou null (sessão vencida/inválida).
async function validarSessaoNoBanco() {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/portal_tipo`, {
    method: 'POST',
    headers: supabaseHeaders(),
    body: '{}',
  });
  if (!resp.ok) throw new Error(`Erro ao validar sessão: ${resp.status}`);
  return resp.json();
}

// Encerra a sessão no banco (o crachá deixa de valer na hora).
async function logoutNoBanco() {
  await fetch(`${SUPABASE_URL}/rest/v1/rpc/portal_logout`, {
    method: 'POST',
    headers: supabaseHeaders(),
    body: '{}',
  });
}

// Busca todos os registros de uma tabela do Supabase.
async function supabaseGet(tabela, query = '') {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?select=*${query}`, {
      headers: supabaseHeaders(),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!resp.ok) throw new Error(`Erro ao buscar ${tabela}: ${resp.status}`);
    return resp.json();
  } catch (e) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') {
      throw new Error(`Tempo esgotado ao buscar ${tabela}. Verifique sua conexão ou se o app tem acesso à internet.`);
    }
    throw e;
  }
}

// Insere um ou mais registros numa tabela. 'upsert' permite atualizar se já existir
// (baseado na chave primária), o que é útil pra não duplicar dados.
async function supabaseUpsert(tabela, registros) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}`, {
    method: 'POST',
    headers: { ...supabaseHeaders(), Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(registros),
  });
  if (!resp.ok) {
    const texto = await resp.text();
    throw new Error(`Erro ao salvar em ${tabela}: ${resp.status} ${texto}`);
  }
  return resp.json();
}

// Remove um registro de uma tabela pelo id.
async function supabaseDelete(tabela, id) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: supabaseHeaders(),
  });
  if (!resp.ok) throw new Error(`Erro ao remover de ${tabela}: ${resp.status}`);
}

// Carrega todos os dados do app a partir do Supabase, reconstruindo o formato
// que o app já usa internamente (industrias, produtos, vendedores, clientes
// com preços embutidos, pedidos com itens embutidos).
async function loadData() {
  const [industriasRaw, produtosRaw, vendedoresRaw, clientesRaw, precosRaw, pedidosRaw, itensRaw] = await Promise.all([
    supabaseGet('industrias'),
    supabaseGet('produtos'),
    supabaseGet('vendedores'),
    supabaseGet('clientes'),
    supabaseGet('precos_cliente'),
    supabaseGet('pedidos', '&order=data.asc'),
    supabaseGet('itens_pedido'),
  ]);

  const industrias = industriasRaw.map((i) => ({
    id: i.id,
    nome: i.nome,
    tipoVenda: i.tipo_venda,
    unidadesPorCaixa: i.unidades_por_caixa,
    caixasPorPallet: i.caixas_por_pallet,
    pallettesMinimoPorPedido: i.pallets_minimo_pedido,
    pecasPorCaixa: i.pecas_por_caixa,
    kgPorPecaAprox: i.kg_por_peca_aprox,
    kgPorPalletAprox: i.kg_por_pallet_aprox,
    pesoMinimoKgPorPedido: i.peso_minimo_kg_pedido,
    corSelo: { bg: i.cor_selo_bg, texto: i.cor_selo_texto },
    regraCarga: i.regra_carga,
  }));

  const produtos = produtosRaw.map((p) => ({
    id: p.id,
    nome: p.nome,
    categoria: p.categoria,
    validadeDias: p.validade_dias,
    validadeObs: p.validade_obs,
    foto: p.foto,
    industriaId: p.industria_id,
    tampa: p.tampa,
    unidadeVenda: p.unidade_venda,
    precoPadrao: p.preco_padrao,
  }));

  const vendedores = vendedoresRaw.map((v) => ({
    id: v.id,
    usuario: v.usuario,
    senha: v.senha,
    nome: v.nome,
  }));

  const clientes = clientesRaw.map((c) => {
    const precos = {};
    precosRaw.filter((p) => p.cliente_id === c.id).forEach((p) => {
      precos[p.produto_id] = p.preco;
    });
    return {
      id: c.id,
      usuario: c.usuario,
      senha: c.senha,
      nomeFantasia: c.nome_fantasia,
      cnpj: c.cnpj,
      prazoPagamento: c.prazo_pagamento,
      vendedorId: c.vendedor_id,
      precos,
    };
  });

  const pedidos = pedidosRaw.map((p) => ({
    id: p.id,
    numero: p.numero,
    clienteId: p.cliente_id,
    vendedorId: p.vendedor_id,
    vendedorNome: p.vendedor_nome,
    data: p.data,
    total: p.total,
    observacao: p.observacao,
    status: p.status,
    itens: itensRaw
      .filter((i) => i.pedido_id === p.id)
      .map((i) => ({ produtoId: i.produto_id, nome: i.nome, qtd: i.qtd, preco: i.preco })),
  }));

  return { industrias, produtos, vendedores, clientes, pedidos };
}

// Salva (cria ou atualiza) um cliente no banco, incluindo seus preços por produto.
async function salvarClienteNoBanco(cliente) {
  await supabaseUpsert('clientes', [{
    id: cliente.id,
    usuario: cliente.usuario,
    senha: cliente.senha,
    nome_fantasia: cliente.nomeFantasia,
    cnpj: cliente.cnpj,
    prazo_pagamento: cliente.prazoPagamento,
    vendedor_id: cliente.vendedorId || null,
  }]);
  const precosArray = Object.entries(cliente.precos || {}).map(([produtoId, preco]) => ({
    cliente_id: cliente.id,
    produto_id: produtoId,
    preco,
  }));
  if (precosArray.length > 0) {
    await supabaseUpsert('precos_cliente', precosArray);
  }
}

// Salva (cria ou atualiza) uma indústria/fornecedor no banco.
async function salvarIndustriaNoBanco(industria) {
  await supabaseUpsert('industrias', [{
    id: industria.id,
    nome: industria.nome,
    tipo_venda: industria.tipoVenda || 'pallet',
    unidades_por_caixa: industria.unidadesPorCaixa ?? null,
    caixas_por_pallet: industria.caixasPorPallet ?? null,
    pallets_minimo_pedido: industria.pallettesMinimoPorPedido ?? null,
    pecas_por_caixa: industria.pecasPorCaixa ?? null,
    kg_por_peca_aprox: industria.kgPorPecaAprox ?? null,
    kg_por_pallet_aprox: industria.kgPorPalletAprox ?? null,
    peso_minimo_kg_pedido: industria.pesoMinimoKgPorPedido ?? null,
    cor_selo_bg: industria.corSelo?.bg ?? null,
    cor_selo_texto: industria.corSelo?.texto ?? null,
    regra_carga: industria.regraCarga ?? null,
  }]);
}

// Salva (cria ou atualiza) um vendedor no banco.
async function salvarVendedorNoBanco(vendedor) {
  await supabaseUpsert('vendedores', [{
    id: vendedor.id,
    usuario: vendedor.usuario,
    senha: vendedor.senha,
    nome: vendedor.nome,
  }]);
}

// Salva um pedido novo no banco, incluindo seus itens.
async function salvarPedidoNoBanco(pedido) {
  await supabaseUpsert('pedidos', [{
    id: pedido.id,
    numero: pedido.numero,
    cliente_id: pedido.clienteId,
    vendedor_id: pedido.vendedorId || null,
    vendedor_nome: pedido.vendedorNome || null,
    data: pedido.data,
    total: pedido.total,
    observacao: pedido.observacao,
    status: pedido.status,
  }]);
  const itensArray = (pedido.itens || []).map((i) => ({
    pedido_id: pedido.id,
    produto_id: i.produtoId,
    nome: i.nome,
    qtd: i.qtd,
    preco: i.preco,
  }));
  if (itensArray.length > 0) {
    await supabaseUpsert('itens_pedido', itensArray);
  }
}

// Atualiza o status de um pedido (ex: 'novo' -> 'confirmado').
async function atualizarStatusPedidoNoBanco(pedidoId, status) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/pedidos?id=eq.${encodeURIComponent(pedidoId)}`, {
    method: 'PATCH',
    headers: supabaseHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!resp.ok) throw new Error(`Erro ao atualizar status do pedido: ${resp.status}`);
}

// Remove um cliente do banco.
async function removerClienteDoBanco(clienteId) {
  await supabaseDelete('clientes', clienteId);
}

// Remove um vendedor do banco.
async function removerVendedorDoBanco(vendedorId) {
  await supabaseDelete('vendedores', vendedorId);
}

// Remove um produto do banco.
async function removerProdutoDoBanco(produtoId) {
  await supabaseDelete('produtos', produtoId);
}

// Retorna a indústria de um produto, ou null se não tiver (produto sem regra de pallet)
function getIndustriaDoProduto(produto, industrias) {
  if (!produto.industriaId) return null;
  return industrias.find((i) => i.id === produto.industriaId) || null;
}

// Quantas unidades formam 1 pallet, para uma dada indústria
function unidadesPorPallet(industria) {
  if (!industria) return null;
  return industria.unidadesPorCaixa * industria.caixasPorPallet;
}

// Produtos de indústrias com tipoVenda 'peso' são vendidos por kg (peso variável),
// não por unidade/pallet fechado — ex: queijo Lac.
function ehVendidoPorPeso(industria) {
  return industria && industria.tipoVenda === 'peso';
}

// Verifica se um produto especifico e vendido por peso (kg): tanto pela industria
// dele (ex: Lac, Las Tres Ninas) quanto por uma marcacao direto no produto
// (produto.unidadeVenda === 'kg'), usada em produtos sem industria vinculada.
function produtoEhPorPeso(produto, industria) {
  return ehVendidoPorPeso(industria) || (produto && produto.unidadeVenda === 'kg');
}

// Define a ordem de exibicao por categoria de produto: leite longa vida primeiro,
// depois creme de leite, depois leite condensado, e por ultimo queijos/mussarela.
// Usado para que a tabela de precos siga sempre essa mesma sequencia, tanto nos
// grupos com venda ativa quanto nos com venda suspensa.
function categoriaGrupoRank(produtos) {
  const cat = (produtos && produtos[0]) ? (produtos[0].categoria || '') : '';
  if (cat.includes('Leite UHT')) return 0;
  if (cat.includes('Creme de Leite')) return 1;
  if (cat.includes('Leite Condensado')) return 2;
  if (cat.includes('Queijo')) return 3;
  return 4;
}

// Descreve a quantidade de um item de pedido já salvo: em kg para produtos vendidos
// por peso, em pallets se o produto tiver indústria de pallet fechado, ou em unidades
// soltas caso contrário.
function descreverQtdItem(item, produtos, industrias) {
  const produto = produtos.find((p) => p.id === item.produtoId);
  const industria = produto ? getIndustriaDoProduto(produto, industrias) : null;
  if (produtoEhPorPeso(produto, industria)) {
    return `${item.qtd} kg`;
  }
  if (industria) {
    const upp = unidadesPorPallet(industria);
    const pallets = item.qtd / upp;
    return `${pallets} pallet(s) — ${item.qtd} un`;
  }
  return `${item.qtd}x`;
}

// Retorna "[Nome da Indústria] " para exibir junto ao nome do produto, ou string
// vazia se o produto não tiver indústria vinculada (ex: queijos).
function prefixoIndustriaItem(item, produtos, industrias) {
  const produto = produtos.find((p) => p.id === item.produtoId);
  const industria = produto ? getIndustriaDoProduto(produto, industrias) : null;
  return industria ? `[${industria.nome}] ` : '';
}

// ---------- ÍCONES SIMPLES (inline SVG, sem dependência) ----------
const Icon = {
  Drop: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M12 2.5c3.5 4.8 7 9.2 7 13a7 7 0 1 1-14 0c0-3.8 3.5-8.2 7-13z" />
    </svg>
  ),
  Cart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  ),
  WhatsApp: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.94.56 3.74 1.53 5.27L2 22l4.97-1.6a9.8 9.8 0 0 0 5.07 1.39h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.04c-.25.7-1.45 1.34-2 1.42-.5.08-1.14.11-1.84-.12-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.18-4.93-4.37-.14-.19-1.18-1.57-1.18-2.99 0-1.42.74-2.12 1-2.41.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.25.59.84 2.05.92 2.2.08.15.13.33.03.52-.1.19-.15.31-.3.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.77 1.27 1.65 2.06 1.14 1.01 2.1 1.33 2.4 1.48.3.15.48.13.66-.05.19-.18.79-.91 1-1.23.21-.31.42-.26.7-.16.29.1 1.83.87 2.14 1.02.32.16.53.24.6.37.08.13.08.74-.17 1.44z" />
    </svg>
  ),
  Box: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M21 8.5 12 3 3 8.5l9 5.5 9-5.5z" strokeLinejoin="round" />
      <path d="M3 8.5V17l9 5 9-5V8.5" strokeLinejoin="round" />
      <path d="M12 14v8" />
    </svg>
  ),
  Logout: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Trash: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Plus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...p}>
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Camera: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M4 8h2.5l1.2-2h8.6l1.2 2H20a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" strokeLinejoin="round" />
      <circle cx="12" cy="13.5" r="3.3" />
    </svg>
  ),
  Repeat: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M17 2.1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12.6v-2a4 4 0 0 1 4-4h14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 21.9l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 11.4v2a4 4 0 0 1-4 4H3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Download: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M12 3v12m0 0-4-4m4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ---------- ILUSTRAÇÃO PLACEHOLDER DE PRODUTO ----------
// Usado até as fotos reais dos produtos serem cadastradas.
// Paleta visual por produto, só usada enquanto não há foto real cadastrada.
// Quando 'produto.foto' tiver uma URL, a foto real é exibida e essa paleta é ignorada.
const PALETA_PLACEHOLDER = {
  p1: { bg: '#0a3a8c', fg: '#ffffff', faixa: '#e2a430' }, // Integral - azul escuro
  p2: { bg: '#fdfdfd', fg: '#1c3a52', faixa: '#e2a430' }, // Desnatado - branco
  p3: { bg: '#b9cbe0', fg: '#0a3a66', faixa: '#e2a430' }, // Semidesnatado - azul claro
  p8: { bg: '#a85a2e', fg: '#ffffff', faixa: '#e2a430' }, // Zero Lactose Santa Clara - marrom/laranja
  p9: { bg: '#c0272d', fg: '#ffffff', faixa: null }, // Amanhecer Integral - vermelho (sem tampa, sem faixa)
  p10: { bg: '#1c4f9c', fg: '#ffffff', faixa: '#0a3a8c' }, // Amanhecer Desnatado - azul
  p11: { bg: '#6aa84f', fg: '#ffffff', faixa: '#4d8536' }, // Amanhecer Semidesnatado - verde
  p12: { bg: '#c8702e', fg: '#ffffff', faixa: '#a85a2e' }, // Amanhecer Zero Lactose - laranja/marrom
  p13: { bg: '#3f7a3a', fg: '#ffffff', faixa: null }, // Terra Viva Integral - verde (sem tampa)
  p14: { bg: '#e8c530', fg: '#5a4a0a', faixa: null }, // Terra Viva Desnatado - amarelo (sem tampa)
  p15: { bg: '#3a7ab8', fg: '#ffffff', faixa: null }, // Terra Viva Semidesnatado - azul (sem tampa)
  p16: { bg: '#a85a2e', fg: '#ffffff', faixa: '#8a4a24' }, // Terra Viva Zero Lactose - laranja/marrom (com tampa)
  p17: { bg: '#b5394a', fg: '#ffffff', faixa: '#e2a430' }, // Dália Integral - vermelho (com tampa)
  p18: { bg: '#2f6fa8', fg: '#ffffff', faixa: '#e2a430' }, // Dália Desnatado - azul (com tampa)
  p19: { bg: '#3e8f6e', fg: '#ffffff', faixa: '#e2a430' }, // Dália Semidesnatado - verde (com tampa)
  p20: { bg: '#c8702e', fg: '#ffffff', faixa: '#e2a430' }, // Dália Zero Lactose - laranja/marrom (com tampa)
  p21: { bg: '#fdf3c9', fg: '#e0a818', faixa: null, icone: 'mussarela' }, // Mussarela LAC - fundo amarelo claro, ícone de peça de queijo
};

function FotoProduto({ produto, size = 56 }) {
  if (produto.foto) {
    return (
      <img
        src={produto.foto}
        alt={produto.nome}
        style={{ width: size, height: size, borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '1px solid #e3ecf4' }}
      />
    );
  }

  const isLeite = produto.categoria === 'Leite UHT';
  const paleta = PALETA_PLACEHOLDER[produto.id];
  const bg = paleta ? paleta.bg : isLeite ? '#eaf1f7' : '#fdf3e0';
  const fg = paleta ? paleta.fg : isLeite ? '#0a4d8c' : '#b07a1f';
  const faixa = paleta ? paleta.faixa : null;
  const icone = paleta ? paleta.icone : null;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        border: '1px solid #e3ecf4',
        position: 'relative',
        overflow: 'hidden',
      }}
      title="Foto ainda não cadastrada"
    >
      {faixa && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: size * 0.22, background: faixa }} />
          {/* Tampinha rosqueável, como nas embalagens reais da Santa Clara */}
          <div
            style={{
              position: 'absolute',
              top: -size * 0.07,
              left: '50%',
              transform: 'translateX(-50%)',
              width: size * 0.26,
              height: size * 0.2,
              background: '#f4f6f8',
              borderRadius: '4px 4px 2px 2px',
              border: '1px solid #cfd8e0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
            }}
          />
        </>
      )}
      {isLeite ? (
        <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5} fill="none" stroke={fg} strokeWidth="1.5" style={{ position: 'relative' }}>
          {/* Corpo retangular da caixinha (tetra pak) */}
          <rect x="6" y="8.5" width="12" height="13" rx="0.6" />
          {/* Topo em "telhado" diagonal, característico da embalagem longa vida */}
          <path d="M6 8.5 7.5 4h9L18 8.5" strokeLinejoin="round" />
          {/* Linha de costura/dobra central do topo */}
          <path d="M12 4v4.5" />
          {/* Linha horizontal sutil no corpo, como o rótulo */}
          <path d="M6 14.5h12" strokeLinecap="round" opacity="0.55" />
        </svg>
      ) : icone === 'mussarela' ? (
        <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56} fill={fg} stroke={fg} strokeWidth="0.4">
          {/* Peça retangular (bloco) de queijo mussarela, como é vendida de fato */}
          <rect x="3.5" y="6.5" width="17" height="11" rx="1" strokeLinejoin="round" />
          <circle cx="8" cy="10.5" r="0.85" fill="#fff" stroke="none" />
          <circle cx="13" cy="13" r="0.7" fill="#fff" stroke="none" />
          <circle cx="17" cy="9.5" r="0.8" fill="#fff" stroke="none" />
          <circle cx="10.5" cy="14.5" r="0.6" fill="#fff" stroke="none" />
          <circle cx="15.5" cy="14.5" r="0.6" fill="#fff" stroke="none" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5} fill="none" stroke={fg} strokeWidth="1.6">
          <path d="M3 9 12 4l9 5-2 9H5L3 9z" strokeLinejoin="round" />
          <circle cx="9.5" cy="10.5" r="0.9" fill={fg} stroke="none" />
          <circle cx="14" cy="13" r="0.9" fill={fg} stroke="none" />
        </svg>
      )}
      <div
        style={{
          position: 'absolute',
          bottom: -5,
          right: -5,
          width: size * 0.32,
          height: size * 0.32,
          borderRadius: '50%',
          background: '#fff',
          border: '1.5px solid #e3ecf4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#90a6ba',
        }}
      >
        <Icon.Camera width={size * 0.16} height={size * 0.16} />
      </div>
    </div>
  );
}

function fmtMoeda(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtData(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ---------- LOGO ----------
function Logo({ size = 40 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'linear-gradient(155deg, #0a4d8c 0%, #093a6b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'Fraunces, Georgia, serif',
          fontWeight: 600,
          fontSize: size * 0.40,
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(10,77,140,0.35)',
          letterSpacing: '-0.02em',
        }}
      >
        BL
      </div>
      <div style={{ lineHeight: 1.05 }}>
        <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, fontSize: size * 0.40, color: '#0a3a66', letterSpacing: '-0.01em' }}>
          Britto Laticínios
        </div>
        <div style={{ fontSize: size * 0.20, color: '#5b7691', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Portal do Vendedor
        </div>
      </div>
    </div>
  );
}

// ---------- TELA DE LOGIN ----------
const LOGIN_SALVO_KEY = 'britto-laticinios-login-salvo';

function carregarLoginSalvo() {
  try {
    const raw = localStorage.getItem(LOGIN_SALVO_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function salvarLogin(usuario, senha, modoAdmin) {
  try {
    localStorage.setItem(LOGIN_SALVO_KEY, JSON.stringify({ usuario, senha, modoAdmin }));
  } catch (e) {}
}

function limparLoginSalvo() {
  try {
    localStorage.removeItem(LOGIN_SALVO_KEY);
  } catch (e) {}
}

// Sessão ativa (o crachá + quem é o usuário). Fica salva no aparelho para o
// vendedor não precisar entrar de novo a cada abertura do app.
const SESSAO_KEY = 'britto-laticinios-sessao';

function carregarSessaoSalva() {
  try {
    const raw = localStorage.getItem(SESSAO_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function salvarSessao(sessao) {
  try {
    localStorage.setItem(SESSAO_KEY, JSON.stringify(sessao));
  } catch (e) {}
}

function limparSessao() {
  try {
    localStorage.removeItem(SESSAO_KEY);
  } catch (e) {}
}

function TelaLogin({ onLogin }) {
  const loginSalvo = carregarLoginSalvo();
  const [usuario, setUsuario] = useState(loginSalvo?.usuario || '');
  const [senha, setSenha] = useState(loginSalvo?.senha || '');
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);
  const [modoAdmin, setModoAdmin] = useState(loginSalvo?.modoAdmin || false);
  const [lembrar, setLembrar] = useState(!!loginSalvo);

  // A conferência de usuário e senha acontece DENTRO do banco (função
  // portal_login) — nenhuma senha fica no código do site nem trafega em lista.
  async function tentarLogin(e) {
    e.preventDefault();
    if (entrando) return;
    setErro('');
    setEntrando(true);
    try {
      const resultado = await loginNoBanco(usuario, senha);
      if (resultado && resultado.token) {
        if (lembrar) salvarLogin(usuario, senha, resultado.tipo === 'admin');
        else limparLoginSalvo();
        const sessao = {
          tipo: resultado.tipo,
          token: resultado.token,
          vendedorId: resultado.vendedor_id || null,
          vendedorNome: resultado.vendedor_nome || null,
        };
        salvarSessao(sessao);
        onLogin(sessao);
        return;
      }
      setErro(
        modoAdmin
          ? 'Usuário ou senha de administrador incorretos.'
          : 'Usuário ou senha incorretos. Confira com a Britto Laticínios.'
      );
    } catch (err) {
      setErro('Não foi possível conectar. Verifique sua internet e tente de novo.');
    }
    setEntrando(false);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f5f8fb 0%, #eaf1f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 20px 60px -10px rgba(10,58,102,0.18)',
          padding: '40px 36px',
          border: '1px solid #e3ecf4',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <Logo size={48} />
        </div>

        <form onSubmit={tentarLogin}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#3a5872', display: 'block', marginBottom: 6 }}>
            {modoAdmin ? 'Usuário administrador' : 'Usuário (representante)'}
          </label>
          <input
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder={modoAdmin ? 'usuário administrador' : 'seu usuário'}
            style={inputStyle}
            autoFocus
          />

          <label style={{ fontSize: 13, fontWeight: 600, color: '#3a5872', display: 'block', margin: '16px 0 6px' }}>
            Senha
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••"
            style={inputStyle}
          />

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 16,
              fontSize: 13.5,
              color: '#3a5872',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
              style={{ width: 17, height: 17, accentColor: '#0a4d8c', cursor: 'pointer' }}
            />
            Lembrar usuário e senha neste dispositivo
          </label>

          {erro && (
            <div style={{ marginTop: 14, fontSize: 13.5, color: '#b3261e', background: '#fdecea', padding: '10px 12px', borderRadius: 8 }}>
              {erro}
            </div>
          )}

          <button type="submit" disabled={entrando} style={{ ...btnPrimary, background: entrando ? '#c2d1de' : '#0a4d8c', cursor: entrando ? 'wait' : 'pointer' }}>
            {entrando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 22 }}>
          <button
            onClick={() => { setModoAdmin(!modoAdmin); setErro(''); setUsuario(''); setSenha(''); }}
            style={{ background: 'none', border: 'none', color: '#5b7691', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {modoAdmin ? 'Entrar como representante' : 'Sou da Britto Laticínios (admin)'}
          </button>
        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1.5px solid #d7e3ed',
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  color: '#1c3a52',
  transition: 'border-color .15s',
};

const btnPrimary = {
  width: '100%',
  marginTop: 24,
  padding: '13px 0',
  borderRadius: 10,
  border: 'none',
  background: '#0a4d8c',
  color: '#fff',
  fontSize: 15.5,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

// ---------- PAINEL CLIENTE ----------
// Painel do representante/vendedor: primeiro ele escolhe um cliente da própria
// carteira, depois vê a tela de pedidos (PainelCliente) já no contexto daquele cliente.
// Tabela de preços geral (preço padrão, não vinculado a um cliente específico),
// organizada por indústria. O vendedor pode copiar como texto (pra colar no
// WhatsApp) ou imprimir/salvar como PDF direto do navegador.
// Remove acentos para compatibilidade com a fonte padrão (Helvetica) usada no
// PDF gerado sem dependências externas — evita caracteres quebrados no arquivo.
function removerAcentos(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/gi, (m) => (m === 'ç' ? 'c' : 'C'));
}

// Escapa parênteses e barras invertidas, obrigatórios dentro de strings de
// conteúdo no formato PDF (sintaxe de string literal do PDF).
function escaparTextoPDF(texto) {
  return texto.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

// Converte uma cor hex (#rrggbb) para o formato de cor do PDF ("r g b" com
// valores de 0 a 1). Usado pra pintar o nome de cada indústria no PDF com a
// mesma cor do selo dela no app. Se a cor for inválida/ausente, usa o azul padrão.
function hexParaCorPDF(hex, fallback = '0.04 0.30 0.55') {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return fallback;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}

// Monta um arquivo PDF válido do zero, escrevendo a estrutura binária mínima
// necessária (cabeçalho, objetos, fonte Helvetica padrão, páginas com texto).
// Não depende de nenhuma biblioteca externa nem da caixa de diálogo de
// impressão do navegador — funciona em qualquer ambiente, incluindo iframes
// restritos onde window.print() costuma falhar.
function construirPDFSimples(linhas) {
  const larguraPagina = 595; // A4 em pontos
  const alturaPagina = 842;
  const margemEsquerda = 50;
  const margemDireita = 50;
  const colunaPrecoX = larguraPagina - margemDireita - 110;
  let yAtual = alturaPagina - 60;
  const alturaLinhaBase = 16;

  // Quebra o conteúdo em páginas conforme o espaço vertical disponível.
  const paginas = [[]];
  linhas.forEach((linha) => {
    const alturaNecessaria = (linha.tamanho || 10) * 0.6 + 6;
    if (yAtual - alturaNecessaria < 50) {
      paginas.push([]);
      yAtual = alturaPagina - 60;
    }
    paginas[paginas.length - 1].push(linha);
    yAtual -= alturaNecessaria;
  });

  const objetos = [];
  // Objeto 1: catálogo
  objetos.push('<< /Type /Catalog /Pages 2 0 R >>');
  // Objeto 2: árvore de páginas (preenchido depois com a lista de páginas)
  const idsPaginas = paginas.map((_, i) => 4 + i * 2);
  objetos.push(`<< /Type /Pages /Kids [${idsPaginas.map((id) => `${id} 0 R`).join(' ')}] /Count ${paginas.length} >>`);
  // Objeto 3: fonte Helvetica padrão (built-in, não precisa embutir)
  objetos.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  // Objeto 3b: fonte Helvetica-Bold
  const idFonteBold = 3 + paginas.length * 2 + 1;
  objetos.push(null); // placeholder, ajustado depois

  let proximoId = 4;
  const idsConteudo = [];
  paginas.forEach((paginaLinhas) => {
    const idPagina = proximoId++;
    const idConteudo = proximoId++;
    idsConteudo.push(idConteudo);

    let y = alturaPagina - 60;
    let conteudoStream = 'BT\n';
    paginaLinhas.forEach((linha) => {
      const tamanho = linha.tamanho || 10;
      const fonteRef = linha.negrito ? '/F2' : '/F1';
      const cor = linha.cor ? linha.cor.split(' ').map(Number) : [0.1, 0.1, 0.1];
      conteudoStream += `${fonteRef} ${tamanho} Tf\n`;
      conteudoStream += `${cor[0]} ${cor[1]} ${cor[2]} rg\n`;
      conteudoStream += `1 0 0 1 ${margemEsquerda} ${y} Tm\n`;
      conteudoStream += `(${escaparTextoPDF(removerAcentos(linha.texto || ''))}) Tj\n`;
      if (linha.precoTexto) {
        const corPreco = linha.corPreco ? linha.corPreco.split(' ').map(Number) : cor;
        conteudoStream += `${corPreco[0]} ${corPreco[1]} ${corPreco[2]} rg\n`;
        conteudoStream += `1 0 0 1 ${colunaPrecoX} ${y} Tm\n`;
        conteudoStream += `(${escaparTextoPDF(linha.precoTexto)}) Tj\n`;
      }
      y -= tamanho * 0.6 + 6;
    });
    conteudoStream += 'ET';

    objetos[idPagina - 1] = `<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 3 0 R /F2 ${idFonteBold} 0 R >> >> /MediaBox [0 0 ${larguraPagina} ${alturaPagina}] /Contents ${idConteudo} 0 R >>`;
    objetos[idConteudo - 1] = `<< /Length ${conteudoStream.length} >>\nstream\n${conteudoStream}\nendstream`;
  });

  objetos[idFonteBold - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';

  // Monta o arquivo PDF final com cabeçalho, objetos numerados, tabela xref e trailer.
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objetos.forEach((obj, idx) => {
    offsets.push(pdf.length);
    pdf += `${idx + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const offsetXref = pdf.length;
  pdf += `xref\n0 ${objetos.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objetos.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${offsetXref}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

function TabelaPrecosGeral({ dados, onFechar }) {
  const [copiado, setCopiado] = useState(false);
  const [textoCopiadoParaEnvio, setTextoCopiadoParaEnvio] = useState(false);

  const produtosPorIndustria = {};
  dados.produtos.forEach((p) => {
    const chave = p.industriaId || 'sem-industria';
    if (!produtosPorIndustria[chave]) produtosPorIndustria[chave] = [];
    produtosPorIndustria[chave].push(p);
  });

  // Grupos com venda suspensa (todos os itens zerados) vao pro final da lista,
  // deixando os grupos com venda ativa sempre visiveis primeiro.
  const gruposOrdenados = [
    ...dados.industrias.map((ind) => ({ industria: ind, produtos: produtosPorIndustria[ind.id] || [] })),
    { industria: null, produtos: produtosPorIndustria['sem-industria'] || [] },
  ]
    .filter((g) => g.produtos.length > 0)
    .sort((a, b) => {
      const suspA = a.industria && a.produtos.every((p) => (p.precoPadrao ?? 0) === 0) ? 1 : 0;
      const suspB = b.industria && b.produtos.every((p) => (p.precoPadrao ?? 0) === 0) ? 1 : 0;
      if (suspA !== suspB) return suspA - suspB;
      return categoriaGrupoRank(a.produtos) - categoriaGrupoRank(b.produtos);
    });

  function montarTextoTabela() {
    const hoje = new Date().toLocaleDateString('pt-BR');
    let texto = `*TABELA DE PREÇOS — BRITTO LATICÍNIOS*\nAtualizada em ${hoje}\n`;
    gruposOrdenados.forEach(({ industria, produtos }) => {
      texto += `\n*${industria ? industria.nome.toUpperCase() : 'OUTROS'}*\n`;
      if (industria?.regraCarga) {
        texto += `_${industria.regraCarga}_\n`;
      }
      produtos.forEach((p) => {
        const unidade = produtoEhPorPeso(p, industria) ? '/kg' : '/un';
        texto += `• ${p.nome}: ${fmtMoeda(p.precoPadrao ?? 0)} ${unidade}\n`;
      });
    });
    texto += `\n\n*${NOTA_TABELA_PRECO}*`;
    return texto;
  }

  function copiarTexto() {
    const texto = montarTextoTabela();
    try {
      navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (e) {}
  }

  // Copia o texto da tabela para a área de transferência E abre o WhatsApp em
  // seguida. Em alguns navegadores o link "wa.me/?text=" abre o WhatsApp sem
  // trazer o texto preenchido — copiar antes garante que o vendedor sempre
  // consiga colar a tabela manualmente, mesmo se isso acontecer.
  function enviarTabelaPeloWhatsApp() {
    const texto = montarTextoTabela();
    try {
      navigator.clipboard.writeText(texto);
      setTextoCopiadoParaEnvio(true);
      setTimeout(() => setTextoCopiadoParaEnvio(false), 4000);
    } catch (e) {}
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    try {
      window.open(url, '_blank');
    } catch (e) {}
  }

  // Gera um arquivo PDF de verdade, escrevendo a estrutura do formato PDF
  // diretamente em JavaScript — não depende da caixa de diálogo de impressão
  // do navegador, que pode ficar bloqueada em ambientes restritos.
  function gerarEBaixarPDF() {
    const linhas = [];
    const hoje = new Date().toLocaleDateString('pt-BR');
    linhas.push({ texto: 'TABELA DE PRECOS - BRITTO LATICINIOS', tamanho: 16, negrito: true });
    linhas.push({ texto: `Atualizada em ${hoje}`, tamanho: 9, cor: '0.55 0.55 0.55' });
    linhas.push({ texto: '', tamanho: 3 });
    linhas.push({ texto: 'Nota Rio: 22% de ICMS', tamanho: 11, negrito: true });
    linhas.push({ texto: '', tamanho: 6 });

    gruposOrdenados.forEach(({ industria, produtos }) => {
      linhas.push({ texto: industria ? industria.nome.toUpperCase() : 'OUTROS', tamanho: 12, negrito: true, cor: hexParaCorPDF(industria?.corSelo?.bg) });
      if (industria?.regraCarga) {
        linhas.push({ texto: removerAcentos(industria.regraCarga), tamanho: 9, cor: '0.4 0.4 0.4' });
      }
      produtos.forEach((p) => {
        const unidade = produtoEhPorPeso(p, industria) ? '/kg' : '/un';
        const nomeLimpo = removerAcentos(p.nome);
        const precoTxt = removerAcentos(`${fmtMoeda(p.precoPadrao ?? 0)} ${unidade}`);
        linhas.push({ texto: `${nomeLimpo}`, precoTexto: precoTxt, tamanho: 10 });
      });
      linhas.push({ texto: '', tamanho: 6 });
    });

    linhas.push({ texto: '', tamanho: 4 });
    linhas.push({ texto: removerAcentos('Preço sujeito à alteração conforme disponibilidade.'), tamanho: 9, negrito: true, cor: '0.57 0.25 0.05' });
    linhas.push({ texto: removerAcentos('Favor sempre consultar o vendedor antes de passar o pedido.'), tamanho: 9, negrito: true, cor: '0.57 0.25 0.05' });

    const pdfBytes = construirPDFSimples(linhas);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tabela-precos-britto-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f8fb', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e3ecf4' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo size={36} />
          <button onClick={onFechar} style={{ background: '#f5f8fb', border: '1px solid #e3ecf4', borderRadius: 9, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#5b7691' }}>
            ✕
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px 60px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(montarTextoTabela())}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { try { navigator.clipboard.writeText(montarTextoTabela()); } catch (e) {} }}
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#1c8a4b', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none' }}
          >
            <Icon.WhatsApp width={15} height={15} /> Enviar tabela
          </a>
          <button
            onClick={copiarTexto}
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#eaf1f7', color: '#0a4d8c', border: 'none', borderRadius: 9, padding: '10px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {copiado ? '✓ Copiado!' : 'Copiar tabela (texto)'}
          </button>
          <button
            onClick={gerarEBaixarPDF}
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#0a4d8c', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Baixar PDF
          </button>
        </div>

        <div>
          <div style={{ marginBottom: 22 }}>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, color: '#0a3a66', margin: '0 0 4px', fontWeight: 600 }}>
              Tabela de Preços
            </h2>
            <p style={{ fontSize: 13, color: '#90a6ba', margin: 0 }}>
              Atualizada em {new Date().toLocaleDateString('pt-BR')} · Britto Laticínios
            </p>
          </div>

          {gruposOrdenados.map(({ industria, produtos }) => (
            <div key={industria ? industria.id : 'outros'} style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'inline-block',
                  fontSize: 12,
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: 6,
                  background: industria?.corSelo?.bg || '#5b7691',
                  color: industria?.corSelo?.texto || '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 8,
                }}
              >
                {industria ? industria.nome : 'Outros'}
              </div>
              {industria?.regraCarga && (
                <div style={{ fontSize: 12, color: '#5b7691', marginBottom: 10, fontStyle: 'italic' }}>
                  {industria.regraCarga}
                </div>
              )}
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e3ecf4', overflow: 'hidden' }}>
                {produtos.map((p, idx) => {
                  const unidade = produtoEhPorPeso(p, industria) ? '/ kg' : '/ un';
                  return (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '11px 16px',
                        borderTop: idx === 0 ? 'none' : '1px solid #eef3f8',
                      }}
                    >
                      <span style={{ fontSize: 13.5, color: '#1c3a52' }}>{p.nome}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0a3a66', flexShrink: 0, marginLeft: 12 }}>
                        {fmtMoeda(p.precoPadrao ?? 0)} <span style={{ fontWeight: 400, color: '#90a6ba', fontSize: 12 }}>{unidade}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 24, padding: '14px 16px', background: '#fff4e0', borderRadius: 10, border: '1px solid #f0d090' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e', lineHeight: 1.5 }}>
              {NOTA_TABELA_PRECO}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Painel do representante/vendedor: primeiro ele escolhe um cliente da própria
// carteira, depois vê a tela de pedidos (PainelCliente) já no contexto daquele cliente.
function PainelVendedor({ vendedor, dados, onSair, onNovoPedido }) {
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState(null);
  const [tabelaPrecosAberta, setTabelaPrecosAberta] = useState(false);

  const carteiraDoVendedor = dados.clientes.filter((c) => c.vendedorId === vendedor.id);

  if (tabelaPrecosAberta) {
    return <TabelaPrecosGeral dados={dados} onFechar={() => setTabelaPrecosAberta(false)} />;
  }

  if (!clienteSelecionadoId) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f8fb', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Header isVendedor vendedor={vendedor} onSair={onSair} />
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '28px 20px 60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, marginBottom: 4, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 20, color: '#0a3a66', margin: '0 0 4px', fontWeight: 600 }}>
                Sua carteira de clientes
              </h2>
              <p style={{ fontSize: 13.5, color: '#5b7691', margin: 0 }}>
                Escolha o cliente para o qual você vai montar o pedido.
              </p>
            </div>
            <button
              onClick={() => setTabelaPrecosAberta(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                background: '#eaf1f7',
                color: '#0a4d8c',
                border: 'none',
                borderRadius: 9,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Tabela de preços
            </button>
          </div>

          <div style={{ marginTop: 20 }}>
            {carteiraDoVendedor.length === 0 ? (
              <EmptyState texto="Nenhum cliente atribuído a você ainda. Fale com a Britto Laticínios." />
          ) : (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e3ecf4', overflow: 'hidden' }}>
              {carteiraDoVendedor.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setClienteSelecionadoId(c.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '16px 18px',
                    border: 'none',
                    borderTop: idx === 0 ? 'none' : '1px solid #eef3f8',
                    background: '#fff',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: '#1c3a52' }}>{c.nomeFantasia}</div>
                    <div style={{ fontSize: 12.5, color: '#90a6ba', marginTop: 2 }}>{c.cnpj}</div>
                  </div>
                  <span style={{ color: '#0a4d8c', fontSize: 18 }}>›</span>
                </button>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    );
  }

  const cliente = dados.clientes.find((c) => c.id === clienteSelecionadoId);

  // Proteção: se por algum motivo o cliente não for encontrado (ex: foi removido
  // pelo admin enquanto o vendedor estava com ele selecionado), volta pra lista
  // em vez de quebrar a tela inteira.
  if (!cliente) {
    setClienteSelecionadoId(null);
    return null;
  }

  const pedidosDoCliente = dados.pedidos.filter((p) => p.clienteId === cliente.id);
  const proximoNumeroPedido = dados.pedidos.reduce((max, p) => Math.max(max, p.numero || 0), 0) + 1;

  return (
    <PainelCliente
      cliente={cliente}
      produtos={dados.produtos}
      industrias={dados.industrias}
      onSair={onSair}
      onTrocarCliente={() => setClienteSelecionadoId(null)}
      onSairDoApp={onSair}
      onNovoPedido={(pedido) => onNovoPedido({ ...pedido, vendedorId: vendedor.id, vendedorNome: vendedor.nome })}
      pedidosDoCliente={pedidosDoCliente}
      proximoNumeroPedido={proximoNumeroPedido}
      vendedor={vendedor}
    />
  );
}

function PainelCliente({ cliente, produtos, industrias, onSair, onTrocarCliente, onSairDoApp, onNovoPedido, pedidosDoCliente, proximoNumeroPedido, vendedor }) {
  const [carrinho, setCarrinho] = useState({}); // {produtoId: quantidade}
  const [aba, setAba] = useState('precos'); // precos | pedidos
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [observacao, setObservacao] = useState('');

  // Para produtos com indústria de pallet fechado, o incremento é de 1 pallet por vez.
  // Para produtos vendidos por peso (kg), o incremento é de 10kg por vez.
  // Para produtos sem indústria (ex: queijos por unidade), o incremento é de 1 unidade.
  function alterarQtd(produto, delta) {
    const industria = getIndustriaDoProduto(produto, industrias);
    let passo = 1;
    if (produtoEhPorPeso(produto, industria)) passo = 10;
    else if (industria) passo = unidadesPorPallet(industria);
    setCarrinho((prev) => {
      const atual = prev[produto.id] || 0;
      const nova = Math.max(0, atual + delta * passo);
      const copia = { ...prev };
      if (nova === 0) delete copia[produto.id];
      else copia[produto.id] = nova;
      return copia;
    });
  }

  // Permite digitar a quantidade direto: em kg (produtos vendidos por peso), em
  // pallets (produtos com indústria de pallet fechado), ou em unidades (demais produtos).
  function definirQtdDigitada(produto, valorDigitado) {
    const industria = getIndustriaDoProduto(produto, industrias);
    if (produtoEhPorPeso(produto, industria)) {
      // Aceita números decimais (ex: 512.5 kg), trocando vírgula por ponto se necessário.
      const numero = Math.max(0, parseFloat(String(valorDigitado).replace(',', '.')) || 0);
      setCarrinho((prev) => {
        const copia = { ...prev };
        if (numero === 0) delete copia[produto.id];
        else copia[produto.id] = numero;
        return copia;
      });
      return;
    }
    const numero = Math.max(0, parseInt(valorDigitado, 10) || 0);
    const novaQtdUnidades = industria ? numero * unidadesPorPallet(industria) : numero;
    setCarrinho((prev) => {
      const copia = { ...prev };
      if (novaQtdUnidades === 0) delete copia[produto.id];
      else copia[produto.id] = novaQtdUnidades;
      return copia;
    });
  }

  function repetirPedido(pedido) {
    const novoCarrinho = {};
    pedido.itens.forEach((i) => { novoCarrinho[i.produtoId] = i.qtd; });
    setCarrinho(novoCarrinho);
    setAba('precos');
  }

  const itensCarrinho = Object.entries(carrinho).map(([pid, qtd]) => {
    const produto = produtos.find((p) => p.id === pid);
    const preco = produto?.precoPadrao ?? 0;
    return { produto, qtd, preco, subtotal: preco * qtd };
  });
  const totalCarrinho = itensCarrinho.reduce((s, i) => s + i.subtotal, 0);
  const qtdItens = itensCarrinho.reduce((s, i) => s + i.qtd, 0);

  // Soma a quantidade do carrinho por indústria, pra checar pedido mínimo.
  // Para indústrias de pallet fechado, soma em unidades (depois convertido pra pallets).
  // Para indústrias vendidas por peso, soma direto em kg.
  const resumoPorIndustria = {};
  itensCarrinho.forEach((i) => {
    const industria = getIndustriaDoProduto(i.produto, industrias);
    if (!industria) return;
    if (!resumoPorIndustria[industria.id]) {
      resumoPorIndustria[industria.id] = { industria, unidades: 0 };
    }
    resumoPorIndustria[industria.id].unidades += i.qtd;
  });
  const industriasAbaixoDoMinimo = Object.values(resumoPorIndustria).filter(({ industria, unidades }) => {
    if (ehVendidoPorPeso(industria)) {
      return unidades < industria.pesoMinimoKgPorPedido;
    }
    const upp = unidadesPorPallet(industria);
    const pallets = unidades / upp;
    return pallets < industria.pallettesMinimoPorPedido;
  });
  // Cada pedido só pode ter produtos de UMA indústria por vez — facilita entrega e
  // faturamento por fornecedor, e evita confusão entre marcas diferentes no mesmo pedido.
  const industriasNoCarrinho = Object.values(resumoPorIndustria).map((r) => r.industria);
  const misturaIndustrias = industriasNoCarrinho.length > 1;
  // Regra de pedido mínimo (pallets/kg) NÃO bloqueia mais o envio — fica só como aviso
  // informativo na tela (industriasAbaixoDoMinimo continua sendo usado pra mostrar o texto).
  const pedidoBloqueado = misturaIndustrias;

  function montarTextoWhatsApp() {
    let texto = vendedor
      ? `Pedido feito por *${vendedor.nome}* para *${cliente.nomeFantasia}* (CNPJ: ${cliente.cnpj}) — Pedido nº ${String(proximoNumeroPedido).padStart(4, '0')}\n\n`
      : `Olá! Sou da *${cliente.nomeFantasia}* (CNPJ: ${cliente.cnpj}) — Pedido nº ${String(proximoNumeroPedido).padStart(4, '0')}\n\n`;
    itensCarrinho.forEach((i) => {
      const industria = getIndustriaDoProduto(i.produto, industrias);
      if (produtoEhPorPeso(i.produto, industria)) {
        texto += `• ${industria ? `[${industria.nome}] ` : ''}${i.produto.nome} — ${i.qtd} kg — ${fmtMoeda(i.preco)}/kg = ${fmtMoeda(i.subtotal)}\n`;
      } else if (industria) {
        const upp = unidadesPorPallet(industria);
        const pallets = i.qtd / upp;
        texto += `• [${industria.nome}] ${i.produto.nome} — ${pallets} pallet(s) (${i.qtd} un) — ${fmtMoeda(i.preco)} = ${fmtMoeda(i.subtotal)}\n`;
      } else {
        texto += `• ${i.produto.nome} — ${i.qtd}x — ${fmtMoeda(i.preco)} = ${fmtMoeda(i.subtotal)}\n`;
      }
    });
    texto += `\n*Total: ${fmtMoeda(totalCarrinho)}*`;
    texto += `\n*Prazo de pagamento: ${cliente.prazoPagamento}*`;
    if (observacao.trim()) {
      texto += `\n\n*Observação do cliente:*\n${observacao.trim()}`;
    }
    return encodeURIComponent(texto);
  }

  // Abre a tela de revisão antes de enviar de fato — o cliente confere os itens
  // e pode deixar uma observação (ex: pedir outro prazo de pagamento) antes de confirmar.
  function abrirConfirmacao() {
    if (itensCarrinho.length === 0 || pedidoBloqueado) return;
    setConfirmacaoAberta(true);
  }

  function registrarPedidoEFechar() {
    const pedido = {
      id: 'ped_' + Date.now(),
      numero: proximoNumeroPedido,
      clienteId: cliente.id,
      data: new Date().toISOString(),
      itens: itensCarrinho.map((i) => ({ produtoId: i.produto.id, nome: i.produto.nome, qtd: i.qtd, preco: i.preco })),
      total: totalCarrinho,
      observacao: observacao.trim() || null,
      status: 'novo',
    };
    onNovoPedido(pedido);
    setCarrinho({});
    setObservacao('');
    setConfirmacaoAberta(false);
    setAba('pedidos');
  }

  const categorias = [...new Set(produtos.map((p) => p.categoria))];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f8fb', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Header cliente={cliente} onSair={onSair} isVendedor={!!vendedor} vendedor={vendedor} onTrocarCliente={onTrocarCliente} />

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '28px 20px 100px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <TabButton ativo={aba === 'precos'} onClick={() => setAba('precos')} label="Tabela de preços" />
          <TabButton ativo={aba === 'pedidos'} onClick={() => setAba('pedidos')} label={`Meus pedidos${pedidosDoCliente.length ? ` (${pedidosDoCliente.length})` : ''}`} />
        </div>

        {aba === 'precos' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eaf1f7', borderRadius: 12, padding: '12px 18px', marginBottom: 22 }}>
              <span style={{ fontSize: 13.5, color: '#3a5872' }}>Prazo de pagamento contratado</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0a4d8c' }}>{cliente.prazoPagamento}</span>
            </div>

            {categorias.map((cat) => (
              <div key={cat} style={{ marginBottom: 28 }}>
                <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 19, color: '#0a3a66', margin: '0 0 12px', fontWeight: 600 }}>
                  {cat}
                </h3>
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e3ecf4', overflow: 'hidden' }}>
                  {produtos.filter((p) => p.categoria === cat).map((p, idx) => {
                    const qtdUnidades = carrinho[p.id] || 0;
                    const industria = getIndustriaDoProduto(p, industrias);
                    const vendidoPorPeso = produtoEhPorPeso(p, industria);
                    const upp = industria && !vendidoPorPeso ? unidadesPorPallet(industria) : null;
                    // FIX: o preço mostrado ao vendedor SEMPRE vem da tabela geral (p.precoPadrao),
                    // nunca de um preço fixo salvo por cliente. Antes usava "cliente.precos[p.id]",
                    // que ficava desatualizado sempre que o admin mudava o preço na tabela geral.
                    const precoUnit = p.precoPadrao ?? 0;
                    const qtdPallets = industria && !vendidoPorPeso ? qtdUnidades / upp : null;
                    return (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 18px',
                          borderTop: idx === 0 ? 'none' : '1px solid #eef3f8',
                          gap: 14,
                        }}
                      >
                        <FotoProduto produto={p} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14.5, color: '#1c3a52', fontWeight: 500 }}>{p.nome}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                            {industria && (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 800,
                                  padding: '2px 9px',
                                  borderRadius: 6,
                                  background: industria.corSelo?.bg || '#0a3a8c',
                                  color: industria.corSelo?.texto || '#ffd166',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                }}
                              >
                                {industria.nome}
                              </span>
                            )}
                            {p.categoria === 'Leite UHT' && typeof p.tampa === 'boolean' && (
                              <span
                                style={{
                                  fontSize: 10.5,
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  borderRadius: 20,
                                  background: p.tampa ? '#e9f7ee' : '#fdf3e0',
                                  color: p.tampa ? '#1c8a4b' : '#b07a1f',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.02em',
                                }}
                              >
                                {p.tampa ? 'Com tampa' : 'Sem tampa'}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 13.5, color: '#5b7691', marginTop: 2 }}>
                            {fmtMoeda(precoUnit)} {vendidoPorPeso ? '/ kg' : '/ un'}
                          </div>
                          {industria && !vendidoPorPeso && (
                            <div style={{ fontSize: 11.5, color: '#0a4d8c', marginTop: 2, fontWeight: 600 }}>
                              1 pallet = {industria.caixasPorPallet} cx ({upp} un) = {fmtMoeda(precoUnit * upp)}
                            </div>
                          )}
                          {vendidoPorPeso && industria && (
                            <div style={{ fontSize: 11.5, color: '#0a4d8c', marginTop: 2, fontWeight: 600 }}>
                              Cx: {industria.pecasPorCaixa} peças (~{industria.kgPorPecaAprox}kg cada) · Pallet: {industria.caixasPorPallet} cx (~{industria.kgPorPalletAprox}kg) ≈ {fmtMoeda(precoUnit * industria.kgPorPalletAprox)}
                            </div>
                          )}
                          {p.validadeDias && (
                            <div style={{ fontSize: 11.5, color: '#90a6ba', marginTop: 2 }}>
                              Validade: {p.validadeDias} dias{p.validadeObs ? ` ${p.validadeObs}` : ''}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                          {vendidoPorPeso ? (
                            <>
                              <button onClick={() => alterarQtd(p, -1)} disabled={qtdUnidades === 0} style={qtdBtn(qtdUnidades === 0)}>−</button>
                              <div style={{ minWidth: 60, textAlign: 'center' }}>
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={qtdUnidades}
                                  onFocus={(e) => e.target.select()}
                                  onChange={(e) => definirQtdDigitada(p, e.target.value.replace(/^0+(?=\d)/, ''))}
                                  style={{
                                    width: 64,
                                    textAlign: 'center',
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: '#0a3a66',
                                    border: '1.5px solid #d7e3ed',
                                    borderRadius: 8,
                                    padding: '4px 2px',
                                    fontFamily: 'inherit',
                                  }}
                                />
                                <div style={{ fontSize: 10, color: '#90a6ba', textTransform: 'uppercase', letterSpacing: '0.03em', marginTop: 2 }}>
                                  kg
                                </div>
                              </div>
                              <button onClick={() => alterarQtd(p, 1)} style={qtdBtn(false)}>+</button>
                            </>
                          ) : industria ? (
                            <>
                              <button onClick={() => alterarQtd(p, -1)} disabled={qtdPallets === 0} style={qtdBtn(qtdPallets === 0)}>−</button>
                              <div style={{ minWidth: 56, textAlign: 'center' }}>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  value={qtdPallets}
                                  onFocus={(e) => e.target.select()}
                                  onChange={(e) => definirQtdDigitada(p, e.target.value.replace(/^0+(?=\d)/, ''))}
                                  style={{
                                    width: 56,
                                    textAlign: 'center',
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: '#0a3a66',
                                    border: '1.5px solid #d7e3ed',
                                    borderRadius: 8,
                                    padding: '4px 2px',
                                    fontFamily: 'inherit',
                                  }}
                                />
                                <div style={{ fontSize: 10, color: '#90a6ba', textTransform: 'uppercase', letterSpacing: '0.03em', marginTop: 2 }}>
                                  {qtdPallets === 1 ? 'pallet' : 'pallets'}
                                </div>
                              </div>
                              <button onClick={() => alterarQtd(p, 1)} style={qtdBtn(false)}>+</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => alterarQtd(p, -1)} disabled={qtdUnidades === 0} style={qtdBtn(qtdUnidades === 0)}>−</button>
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={qtdUnidades}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => definirQtdDigitada(p, e.target.value.replace(/^0+(?=\d)/, ''))}
                                style={{
                                  width: 48,
                                  textAlign: 'center',
                                  fontSize: 15,
                                  fontWeight: 600,
                                  color: '#0a3a66',
                                  border: '1.5px solid #d7e3ed',
                                  borderRadius: 8,
                                  padding: '6px 2px',
                                  fontFamily: 'inherit',
                                }}
                              />
                              <button onClick={() => alterarQtd(p, 1)} style={qtdBtn(false)}>+</button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {misturaIndustrias && (
              <div
                style={{
                  background: '#fdecea',
                  color: '#b3261e',
                  borderRadius: 10,
                  padding: '12px 16px',
                  fontSize: 13.5,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Seu pedido tem produtos de mais de uma indústria ({industriasNoCarrinho.map((i) => i.nome).join(', ')}). Cada pedido deve conter produtos de uma única indústria — remova os itens de uma das marcas para continuar.
              </div>
            )}

            {Object.values(resumoPorIndustria).length > 0 && (
              <div style={{ marginBottom: 8 }}>
                {Object.values(resumoPorIndustria).map(({ industria, unidades }) => {
                  if (ehVendidoPorPeso(industria)) {
                    const abaixoDoMinimo = unidades < industria.pesoMinimoKgPorPedido;
                    return (
                      <div
                        key={industria.id}
                        style={{
                          background: abaixoDoMinimo ? '#fdecea' : '#e9f7ee',
                          color: abaixoDoMinimo ? '#b3261e' : '#1c8a4b',
                          borderRadius: 10,
                          padding: '11px 16px',
                          fontSize: 13,
                          marginBottom: 8,
                          fontWeight: 500,
                        }}
                      >
                        {industria.nome}: {unidades.toFixed(1)} kg no carrinho — pedido mínimo é {industria.pesoMinimoKgPorPedido} kg.
                        {abaixoDoMinimo && ` Faltam ${(industria.pesoMinimoKgPorPedido - unidades).toFixed(1)} kg para atingir o mínimo.`}
                      </div>
                    );
                  }
                  const upp = unidadesPorPallet(industria);
                  const pallets = unidades / upp;
                  const abaixoDoMinimo = pallets < industria.pallettesMinimoPorPedido;
                  return (
                    <div
                      key={industria.id}
                      style={{
                        background: abaixoDoMinimo ? '#fdecea' : '#e9f7ee',
                        color: abaixoDoMinimo ? '#b3261e' : '#1c8a4b',
                        borderRadius: 10,
                        padding: '11px 16px',
                        fontSize: 13,
                        marginBottom: 8,
                        fontWeight: 500,
                      }}
                    >
                      {industria.nome}: {pallets.toFixed(2)} pallet(s) no carrinho — pedido mínimo é {industria.pallettesMinimoPorPedido} pallets.
                      {abaixoDoMinimo && ` Faltam ${((industria.pallettesMinimoPorPedido - pallets) * upp).toFixed(0)} unidades para atingir o mínimo.`}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {aba === 'pedidos' && (
          <div>
            {pedidosDoCliente.length === 0 ? (
              <EmptyState texto="Nenhum pedido ainda. Monte seu pedido na aba de preços." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pedidosDoCliente.slice().reverse().map((ped) => (
                  <div key={ped.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e3ecf4', padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#0a3a66' }}>Pedido nº {String(ped.numero ?? '—').padStart(4, '0')}</span>
                        <span style={{ fontSize: 13, color: '#90a6ba', marginLeft: 8 }}>{fmtData(ped.data)}</span>
                      </div>
                      <StatusBadge status={ped.status} />
                    </div>
                    {ped.itens.map((i) => (
                      <div key={i.produtoId} style={{ fontSize: 14, color: '#3a5872', display: 'flex', justifyContent: 'space-between', padding: '3px 0', gap: 10 }}>
                        <span>{descreverQtdItem(i, produtos, industrias)} {prefixoIndustriaItem(i, produtos, industrias)}{i.nome}</span>
                        <span style={{ flexShrink: 0 }}>{fmtMoeda(i.preco * i.qtd)}</span>
                      </div>
                    ))}
                    {ped.observacao && (
                      <div style={{ marginTop: 8, fontSize: 12.5, color: '#5b7691', background: '#f5f8fb', borderRadius: 8, padding: '8px 10px' }}>
                        <span style={{ fontWeight: 700 }}>Observação:</span> {ped.observacao}
                      </div>
                    )}
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #eef3f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#0a3a66' }}>Total {fmtMoeda(ped.total)}</span>
                      <button onClick={() => repetirPedido(ped)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#eaf1f7', color: '#0a4d8c', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        <Icon.Repeat width={13} height={13} /> Comprar de novo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 28, background: '#fff', borderRadius: 14, border: '1px solid #e3ecf4', padding: '18px 20px' }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#3a5872', marginBottom: 12 }}>Falar diretamente com a Britto</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/${WHATSAPP_VENDAS}?text=${encodeURIComponent(`Olá! Sou da *${cliente.nomeFantasia}* e gostaria de falar com vendas a respeito do meu pedido.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={linkWhats}
                >
                  <Icon.WhatsApp width={16} height={16} /> Vendas
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_FINANCEIRO}?text=${encodeURIComponent(`Olá! Sou da *${cliente.nomeFantasia}* e gostaria de falar com o financeiro.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={linkWhats}
                >
                  <Icon.WhatsApp width={16} height={16} /> Financeiro
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {aba === 'precos' && qtdItens > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#fff',
            borderTop: '1px solid #e3ecf4',
            boxShadow: '0 -8px 24px rgba(10,58,102,0.08)',
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '100%', maxWidth: 920, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12.5, color: '#5b7691' }}>{qtdItens} {qtdItens === 1 ? 'item' : 'itens'}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0a3a66' }}>{fmtMoeda(totalCarrinho)}</div>
            </div>
            <button
              onClick={abrirConfirmacao}
              disabled={pedidoBloqueado}
              style={{
                ...btnPrimary,
                width: 'auto',
                margin: 0,
                padding: '13px 26px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: pedidoBloqueado ? '#c2d1de' : '#0a4d8c',
                cursor: pedidoBloqueado ? 'not-allowed' : 'pointer',
              }}
            >
              <Icon.WhatsApp width={17} height={17} /> {misturaIndustrias ? 'Misture só 1 indústria' : 'Revisar e enviar'}
            </button>
          </div>
        </div>
      )}

      {confirmacaoAberta && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10,32,56,0.55)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#fff',
              borderRadius: '20px 20px 0 0',
              padding: '22px 20px 24px',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 19, fontWeight: 600, color: '#0a3a66', marginBottom: 4 }}>
              Confirmar pedido
            </div>
            <div style={{ fontSize: 13, color: '#90a6ba', marginBottom: 18 }}>
              Revise os itens antes de enviar para a Britto Laticínios.
            </div>

            <div style={{ background: '#f5f8fb', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
              {itensCarrinho.map((i) => {
                const industria = getIndustriaDoProduto(i.produto, industrias);
                let descricaoQtd;
                if (produtoEhPorPeso(i.produto, industria)) {
                  descricaoQtd = `${i.qtd} kg`;
                } else if (industria) {
                  descricaoQtd = `${i.qtd / unidadesPorPallet(industria)} pallet(s)`;
                } else {
                  descricaoQtd = `${i.qtd}x`;
                }
                return (
                  <div key={i.produto.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '5px 0', fontSize: 13.5, color: '#3a5872' }}>
                    <span>{descricaoQtd} {industria ? `[${industria.nome}] ` : ''}{i.produto.nome}</span>
                    <span style={{ flexShrink: 0, fontWeight: 600 }}>{fmtMoeda(i.subtotal)}</span>
                  </div>
                );
              })}
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #e3ecf4', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0a3a66' }}>
                <span>Total</span>
                <span>{fmtMoeda(totalCarrinho)}</span>
              </div>
            </div>

            <div style={{ background: '#eaf1f7', borderRadius: 10, padding: '10px 14px', marginBottom: 18, display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
              <span style={{ color: '#3a5872' }}>Prazo de pagamento contratado</span>
              <span style={{ fontWeight: 700, color: '#0a4d8c' }}>{cliente.prazoPagamento}</span>
            </div>

            <label style={{ fontSize: 13, fontWeight: 600, color: '#3a5872', display: 'block', marginBottom: 6 }}>
              Observação (opcional)
            </label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: gostaria de combinar outro prazo de pagamento, ou alguma outra informação sobre este pedido..."
              rows={3}
              style={{
                width: '100%',
                padding: '11px 13px',
                borderRadius: 10,
                border: '1.5px solid #d7e3ed',
                fontSize: 14,
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
                marginBottom: 20,
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setConfirmacaoAberta(false)}
                style={{
                  flex: 1,
                  padding: '13px 0',
                  borderRadius: 10,
                  border: '1.5px solid #d7e3ed',
                  background: '#fff',
                  color: '#5b7691',
                  fontSize: 14.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Voltar e editar
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_VENDAS}?text=${montarTextoWhatsApp()}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={registrarPedidoEFechar}
                style={{
                  flex: 1.4,
                  padding: '13px 0',
                  borderRadius: 10,
                  border: 'none',
                  background: '#0a4d8c',
                  color: '#fff',
                  fontSize: 14.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  textDecoration: 'none',
                }}
              >
                <Icon.WhatsApp width={16} height={16} /> Confirmar e enviar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function qtdBtn(disabled) {
  return {
    width: 30,
    height: 30,
    borderRadius: 8,
    border: '1.5px solid #d7e3ed',
    background: disabled ? '#f5f8fb' : '#fff',
    color: disabled ? '#c2d1de' : '#0a4d8c',
    fontSize: 16,
    fontWeight: 600,
    cursor: disabled ? 'default' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}

const linkWhats = {
  display: 'flex',
  alignItems: 'center',
  gap: 7,
  padding: '9px 16px',
  background: '#e9f7ee',
  color: '#1c8a4b',
  borderRadius: 9,
  fontSize: 13.5,
  fontWeight: 600,
  textDecoration: 'none',
};

function StatusBadge({ status }) {
  const map = {
    novo: { bg: '#fff4e0', color: '#a05a00', label: 'Recebido' },
    confirmado: { bg: '#e9f7ee', color: '#1c8a4b', label: 'Confirmado' },
  };
  const s = map[status] || map.novo;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
      {s.label}
    </span>
  );
}

function TabButton({ ativo, onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '9px 18px',
        borderRadius: 9,
        border: ativo ? 'none' : '1px solid #e3ecf4',
        background: ativo ? '#0a4d8c' : '#fff',
        color: ativo ? '#fff' : '#3a5872',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

function EmptyState({ texto }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#90a6ba' }}>
      <Icon.Box width={40} height={40} style={{ margin: '0 auto 14px', opacity: 0.5 }} />
      <div style={{ fontSize: 14.5 }}>{texto}</div>
    </div>
  );
}

function Header({ cliente, isAdmin, isVendedor, vendedor, onSair, onTrocarCliente }) {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e3ecf4' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo size={36} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1c3a52' }}>
              {isAdmin ? 'Administrador' : isVendedor ? vendedor.nome : cliente.nomeFantasia}
            </div>
            {isVendedor && cliente && (
              <div style={{ fontSize: 12, color: '#90a6ba' }}>Atendendo: {cliente.nomeFantasia}</div>
            )}
            {!isAdmin && !isVendedor && cliente && <div style={{ fontSize: 12, color: '#90a6ba' }}>{cliente.cnpj}</div>}
          </div>
          {isVendedor && onTrocarCliente && (
            <button onClick={onTrocarCliente} title="Trocar cliente" style={{ background: '#eaf1f7', border: '1px solid #d7e3ed', borderRadius: 9, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0a4d8c' }}>
              <Icon.Repeat width={15} height={15} />
            </button>
          )}
          <button onClick={onSair} title="Sair" style={{ background: '#f5f8fb', border: '1px solid #e3ecf4', borderRadius: 9, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#5b7691' }}>
            <Icon.Logout width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- PAINEL ADMIN ----------
function PainelAdmin({ dados, setDados, onSair }) {
  const [aba, setAba] = useState('pedidos'); // pedidos | precos | clientes | vendedores
  const [clienteEditando, setClienteEditando] = useState(dados.clientes[0]?.id || null);
  const [novoClienteAberto, setNovoClienteAberto] = useState(false);
  const [novoVendedorAberto, setNovoVendedorAberto] = useState(false);
  const [novoProdutoAberto, setNovoProdutoAberto] = useState(false);
  const [novaIndustriaAberta, setNovaIndustriaAberta] = useState(false);
  const [tabelaCopiada, setTabelaCopiada] = useState(false);
  const [precosEditandoTexto, setPrecosEditandoTexto] = useState({});
  const [migrando, setMigrando] = useState(false);
  const [migracaoStatus, setMigracaoStatus] = useState(null);
  const [precosNaoSalvos, setPrecosNaoSalvos] = useState(false);
  const [salvandoPrecos, setSalvandoPrecos] = useState(false);
  const [precosSalvosRecentemente, setPrecosSalvosRecentemente] = useState(false);
  const [statusVendaPorIndustria, setStatusVendaPorIndustria] = useState({});

  // Envia todos os dados de exemplo (indústrias, produtos, vendedores, clientes
  // com seus preços) para o banco de dados de uma só vez. Usado apenas uma vez,
  // na primeira configuração do banco — depois disso os dados já ficam salvos
  // permanentemente e essa função não precisa ser usada de novo.
  async function migrarDadosParaOBanco() {
    setMigrando(true);
    setMigracaoStatus(null);
    try {
      await supabaseUpsert('industrias', INDUSTRIAS_INICIAIS.map((i) => ({
        id: i.id,
        nome: i.nome,
        tipo_venda: i.tipoVenda || 'pallet',
        unidades_por_caixa: i.unidadesPorCaixa || null,
        caixas_por_pallet: i.caixasPorPallet || null,
        pallets_minimo_pedido: i.pallettesMinimoPorPedido || null,
        pecas_por_caixa: i.pecasPorCaixa || null,
        kg_por_peca_aprox: i.kgPorPecaAprox || null,
        kg_por_pallet_aprox: i.kgPorPalletAprox || null,
        peso_minimo_kg_pedido: i.pesoMinimoKgPorPedido || null,
        cor_selo_bg: i.corSelo?.bg || null,
        cor_selo_texto: i.corSelo?.texto || null,
        regra_carga: i.regraCarga || null,
      })));

      await supabaseUpsert('produtos', PRODUTOS_BASE.map((p) => ({
        id: p.id,
        nome: p.nome,
        categoria: p.categoria,
        validade_dias: p.validadeDias || null,
        validade_obs: p.validadeObs || null,
        foto: p.foto || null,
        industria_id: p.industriaId || null,
        tampa: typeof p.tampa === 'boolean' ? p.tampa : null,
        unidade_venda: p.unidadeVenda || null,
        preco_padrao: p.precoPadrao || null,
      })));

      await supabaseUpsert('vendedores', VENDEDORES_INICIAIS);

      for (const cliente of CLIENTES_INICIAIS) {
        await salvarClienteNoBanco(cliente);
      }

      setMigracaoStatus('sucesso');
      const dadosAtualizados = await loadData();
      setDados(dadosAtualizados);
    } catch (e) {
      console.error('Erro na migração:', e);
      setMigracaoStatus('erro: ' + e.message);
    }
    setMigrando(false);
  }

  // Em cada indústria, Integral/Desnatado/Semidesnatado sempre têm o mesmo preço entre si,
  // e o Zero Lactose acompanha automaticamente como esse preço + R$ 0,50.
  const DIFERENCA_ZERO_LACTOSE = 0.5;
  const GRUPOS_LEITE_PADRAO = [
    { padrao: ['p1', 'p2', 'p3'], zeroLactose: 'p8' }, // Santa Clara
    { padrao: ['p9', 'p10', 'p11'], zeroLactose: 'p12' }, // Amanhecer
    { padrao: ['p13', 'p14', 'p15'], zeroLactose: 'p16' }, // Terra Viva
    { padrao: ['p17', 'p18', 'p19'], zeroLactose: 'p20' }, // Dália Alimentos
  ];

  // Grava a tabela de produtos inteira no banco (nomes e preços atuais).
  async function salvarProdutosNoBanco(produtos) {
    await supabaseUpsert('produtos', produtos.map((p) => ({
      id: p.id,
      nome: p.nome,
      categoria: p.categoria,
      validade_dias: p.validadeDias ?? null,
      validade_obs: p.validadeObs ?? null,
      foto: p.foto ?? null,
      industria_id: p.industriaId ?? null,
      tampa: typeof p.tampa === 'boolean' ? p.tampa : null,
      unidade_venda: p.unidadeVenda ?? null,
      preco_padrao: p.precoPadrao ?? null,
    })));
  }

  // Agora so atualiza a tela (em memoria); so grava no banco quando clicar em "Salvar alteracoes".
  function atualizarPreco(produtoId, valor) {
    setDados((prev) => {
      const novosProdutos = prev.produtos.map((p) => {
        const grupo = GRUPOS_LEITE_PADRAO.find((g) => g.padrao.includes(produtoId) || g.zeroLactose === produtoId);
        if (grupo) {
          if (grupo.padrao.includes(p.id)) return { ...p, precoPadrao: valor };
          if (p.id === grupo.zeroLactose) return { ...p, precoPadrao: Math.round((valor + DIFERENCA_ZERO_LACTOSE) * 100) / 100 };
          return p;
        }
        if (p.id === produtoId) return { ...p, precoPadrao: valor };
        return p;
      });
      return { ...prev, produtos: novosProdutos };
    });
    setPrecosNaoSalvos(true);
    setPrecosSalvosRecentemente(false);
  }

  async function salvarAlteracoesDeTabela() {
    setSalvandoPrecos(true);
    try {
      await salvarProdutosNoBanco(dados.produtos);
      setPrecosNaoSalvos(false);
      setPrecosSalvosRecentemente(true);
      setTimeout(() => setPrecosSalvosRecentemente(false), 2500);
    } catch (e) {
      console.error('Erro ao salvar tabela de preços:', e);
    }
    setSalvandoPrecos(false);
  }

  // Monta os grupos (industria + produtos) a partir do estado atual — usado tanto
  // pra gerar o texto do WhatsApp quanto pro PDF, sempre com os precos mais recentes
  // (incluindo grupos com "venda suspensa", que aparecem com preco R$ 0,00).
  // Verifica se um grupo (industria) esta com venda suspensa: manualmente marcado
  // no seletor, OU todos os produtos dele com preco zerado (deteccao automatica).
  function grupoEstaSuspenso(industria, produtos) {
    if (!industria) return false;
    if (statusVendaPorIndustria[industria.id] === 'suspensa') return true;
    return produtos.every((p) => (p.precoPadrao ?? 0) === 0);
  }

  function montarGruposDaTabela() {
    const produtosPorIndustria = {};
    dados.produtos.forEach((p) => {
      const chave = p.industriaId || 'sem-industria';
      if (!produtosPorIndustria[chave]) produtosPorIndustria[chave] = [];
      produtosPorIndustria[chave].push(p);
    });
    return [
      ...dados.industrias.map((ind) => ({ industria: ind, produtos: produtosPorIndustria[ind.id] || [] })),
      { industria: null, produtos: produtosPorIndustria['sem-industria'] || [] },
    ]
      .filter((g) => g.produtos.length > 0)
      .sort((a, b) => {
        const suspA = grupoEstaSuspenso(a.industria, a.produtos) ? 1 : 0;
        const suspB = grupoEstaSuspenso(b.industria, b.produtos) ? 1 : 0;
        if (suspA !== suspB) return suspA - suspB;
        return categoriaGrupoRank(a.produtos) - categoriaGrupoRank(b.produtos);
      });
  }

  function montarTextoTabelaAdmin() {
    const grupos = montarGruposDaTabela();
    const hoje = new Date().toLocaleDateString('pt-BR');
    let texto = `*TABELA DE PREÇOS — BRITTO LATICÍNIOS*\nAtualizada em ${hoje}\n`;
    grupos.forEach(({ industria, produtos }) => {
      const suspensa = grupoEstaSuspenso(industria, produtos);
      texto += `\n*${industria ? industria.nome.toUpperCase() : 'OUTROS'}*${suspensa ? ' — *VENDA SUSPENSA*' : ''}\n`;
      if (industria?.regraCarga) {
        texto += `_${industria.regraCarga}_\n`;
      }
      produtos.forEach((p) => {
        const unidade = produtoEhPorPeso(p, industria) ? '/kg' : '/un';
        texto += `• ${p.nome}: ${fmtMoeda(p.precoPadrao ?? 0)} ${unidade}\n`;
      });
    });
    texto += `\n\n*${NOTA_TABELA_PRECO}*`;
    return texto;
  }

  function gerarEBaixarPDFAdmin() {
    const grupos = montarGruposDaTabela();
    const linhas = [];
    const hoje = new Date().toLocaleDateString('pt-BR');
    linhas.push({ texto: 'TABELA DE PRECOS - BRITTO LATICINIOS', tamanho: 16, negrito: true });
    linhas.push({ texto: `Atualizada em ${hoje}`, tamanho: 9, cor: '0.55 0.55 0.55' });
    linhas.push({ texto: '', tamanho: 3 });
    linhas.push({ texto: 'Nota Rio: 22% de ICMS', tamanho: 11, negrito: true });
    linhas.push({ texto: '', tamanho: 6 });

    grupos.forEach(({ industria, produtos }) => {
      const suspensa = grupoEstaSuspenso(industria, produtos);
      linhas.push({
        texto: industria ? industria.nome.toUpperCase() : 'OUTROS',
        tamanho: 12,
        negrito: true,
        cor: hexParaCorPDF(industria?.corSelo?.bg),
        precoTexto: suspensa ? 'VENDA SUSPENSA' : undefined,
        corPreco: '0.7 0.15 0.12',
      });
      if (industria?.regraCarga) {
        linhas.push({ texto: removerAcentos(industria.regraCarga), tamanho: 9, cor: '0.4 0.4 0.4' });
      }
      produtos.forEach((p) => {
        const unidade = produtoEhPorPeso(p, industria) ? '/kg' : '/un';
        const nomeLimpo = removerAcentos(p.nome);
        const precoTxt = removerAcentos(`${fmtMoeda(p.precoPadrao ?? 0)} ${unidade}`);
        linhas.push({ texto: `${nomeLimpo}`, precoTexto: precoTxt, tamanho: 10 });
      });
      linhas.push({ texto: '', tamanho: 6 });
    });

    linhas.push({ texto: '', tamanho: 4 });
    linhas.push({ texto: removerAcentos('Preço sujeito à alteração conforme disponibilidade.'), tamanho: 9, negrito: true, cor: '0.57 0.25 0.05' });
    linhas.push({ texto: removerAcentos('Favor sempre consultar o vendedor antes de passar o pedido.'), tamanho: 9, negrito: true, cor: '0.57 0.25 0.05' });

    const pdfBytes = construirPDFSimples(linhas);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tabela-precos-britto-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function marcarConfirmado(pedidoId) {
    setDados((prev) => ({
      ...prev,
      pedidos: prev.pedidos.map((p) => (p.id === pedidoId ? { ...p, status: 'confirmado' } : p)),
    }));
    atualizarStatusPedidoNoBanco(pedidoId, 'confirmado').catch((e) => console.error('Erro ao confirmar pedido:', e));
  }

  function removerCliente(clienteId) {
    setDados((prev) => ({ ...prev, clientes: prev.clientes.filter((c) => c.id !== clienteId) }));
    if (clienteEditando === clienteId) setClienteEditando(null);
    removerClienteDoBanco(clienteId).catch((e) => console.error('Erro ao remover cliente:', e));
  }

  function adicionarVendedor(novo) {
    const id = 'v' + Date.now();
    const vendedorNovo = { id, ...novo };
    setDados((prev) => ({ ...prev, vendedores: [...prev.vendedores, vendedorNovo] }));
    setNovoVendedorAberto(false);
    salvarVendedorNoBanco(vendedorNovo).catch((e) => console.error('Erro ao salvar vendedor:', e));
  }

  function removerVendedor(vendedorId) {
    setDados((prev) => ({ ...prev, vendedores: prev.vendedores.filter((v) => v.id !== vendedorId) }));
    removerVendedorDoBanco(vendedorId).catch((e) => console.error('Erro ao remover vendedor:', e));
  }

  function atribuirVendedorAoCliente(clienteId, vendedorId) {
    setDados((prev) => {
      const novoClientes = prev.clientes.map((c) => (c.id === clienteId ? { ...c, vendedorId: vendedorId || null } : c));
      const clienteAtualizado = novoClientes.find((c) => c.id === clienteId);
      salvarClienteNoBanco(clienteAtualizado).catch((e) => console.error('Erro ao atribuir vendedor:', e));
      return { ...prev, clientes: novoClientes };
    });
  }

  function adicionarCliente(novo) {
    const id = 'c' + Date.now();
    const precos = {};
    dados.produtos.forEach((p) => (precos[p.id] = 0));
    const clienteNovo = { id, ...novo, precos };
    setDados((prev) => ({ ...prev, clientes: [...prev.clientes, clienteNovo] }));
    setClienteEditando(id);
    setNovoClienteAberto(false);
    salvarClienteNoBanco(clienteNovo).catch((e) => console.error('Erro ao salvar cliente:', e));
  }

  // Marca um grupo (industria) como venda ativa ou suspensa. Ao suspender, zera o
  // preco de todos os produtos daquela industria (ex: os 4 tipos de leite longa vida
  // da mesma marca). Ao reativar, so libera a edicao — o preco fica em R$ 0 ate o
  // admin digitar o valor novo.
  function alterarStatusVenda(industriaId, novoStatus) {
    setStatusVendaPorIndustria((prev) => ({ ...prev, [industriaId]: novoStatus }));
    if (novoStatus === 'suspensa') {
      setDados((prev) => ({
        ...prev,
        produtos: prev.produtos.map((p) => (p.industriaId === industriaId ? { ...p, precoPadrao: 0 } : p)),
      }));
    }
    setPrecosNaoSalvos(true);
    setPrecosSalvosRecentemente(false);
  }

  // Atualiza o nome de um produto (fica pendente ate clicar em "Salvar alteracoes",
  // igual ao preco).
  function atualizarNomeProduto(produtoId, nome) {
    setDados((prev) => ({
      ...prev,
      produtos: prev.produtos.map((p) => (p.id === produtoId ? { ...p, nome } : p)),
    }));
    setPrecosNaoSalvos(true);
    setPrecosSalvosRecentemente(false);
  }

  // Remove um produto da tabela (acao imediata, igual remover cliente/vendedor).
  function removerProduto(produtoId) {
    setDados((prev) => ({ ...prev, produtos: prev.produtos.filter((p) => p.id !== produtoId) }));
    removerProdutoDoBanco(produtoId).catch((e) => console.error('Erro ao remover produto:', e));
  }

  // Adiciona um produto novo na tabela (acao imediata).
  function adicionarProduto(novo) {
    const id = 'p' + Date.now();
    const produtoNovo = { id, ...novo };
    setDados((prev) => {
      const novosProdutos = [...prev.produtos, produtoNovo];
      salvarProdutosNoBanco(novosProdutos).catch((e) => console.error('Erro ao salvar produto:', e));
      return { ...prev, produtos: novosProdutos };
    });
    setNovoProdutoAberto(false);
  }

  // Adiciona uma nova industria/fornecedor (acao imediata, igual remover/adicionar cliente).
  function adicionarIndustria(novo) {
    const id = 'ind' + Date.now();
    const industriaNova = { id, ...novo };
    setDados((prev) => ({ ...prev, industrias: [...prev.industrias, industriaNova] }));
    salvarIndustriaNoBanco(industriaNova).catch((e) => console.error('Erro ao salvar indústria:', e));
    setNovaIndustriaAberta(false);
  }

  const clienteAtual = dados.clientes.find((c) => c.id === clienteEditando);
  const pedidosOrdenados = dados.pedidos.slice().sort((a, b) => new Date(b.data) - new Date(a.data));

  return (
    <div style={{ minHeight: '100vh', background: '#f5f8fb', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Header isAdmin onSair={onSair} />

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '28px 20px 60px' }}>
        {dados.clientes.length === 0 && (
          <div style={{ background: '#fff4e0', border: '1px solid #f0d090', borderRadius: 14, padding: '18px 20px', marginBottom: 22 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: '#92400e', marginBottom: 6 }}>
              Banco de dados vazio
            </div>
            <div style={{ fontSize: 13.5, color: '#92400e', marginBottom: 14 }}>
              Não há clientes cadastrados no banco ainda. Clique no botão abaixo para enviar todos os dados de teste (indústrias, produtos, vendedores e clientes) para o banco de dados, de uma só vez. Isso só precisa ser feito uma vez.
            </div>
            <button
              onClick={migrarDadosParaOBanco}
              disabled={migrando}
              style={{
                background: migrando ? '#c2d1de' : '#0a4d8c',
                color: '#fff',
                border: 'none',
                borderRadius: 9,
                padding: '11px 20px',
                fontSize: 13.5,
                fontWeight: 600,
                cursor: migrando ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {migrando ? 'Enviando dados...' : 'Enviar dados de teste para o banco'}
            </button>
            {migracaoStatus === 'sucesso' && (
              <div style={{ marginTop: 10, fontSize: 13, color: '#1c8a4b', fontWeight: 600 }}>
                ✓ Dados enviados com sucesso!
              </div>
            )}
            {migracaoStatus && migracaoStatus !== 'sucesso' && (
              <div style={{ marginTop: 10, fontSize: 13, color: '#b3261e' }}>
                Erro: {migracaoStatus}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <TabButton ativo={aba === 'pedidos'} onClick={() => setAba('pedidos')} label={`Pedidos${dados.pedidos.length ? ` (${dados.pedidos.length})` : ''}`} />
          <TabButton ativo={aba === 'precos'} onClick={() => setAba('precos')} label="Alteração de tabela" />
          <TabButton ativo={aba === 'clientes'} onClick={() => setAba('clientes')} label="Clientes" />
          <TabButton ativo={aba === 'vendedores'} onClick={() => setAba('vendedores')} label="Vendedores" />
        </div>

        {aba === 'pedidos' && (
          pedidosOrdenados.length === 0 ? (
            <EmptyState texto="Nenhum pedido recebido ainda." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pedidosOrdenados.map((ped) => {
                const cli = dados.clientes.find((c) => c.id === ped.clienteId);
                return (
                  <div key={ped.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e3ecf4', padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: '#0a3a66', fontSize: 15 }}>{cli ? cli.nomeFantasia : 'Cliente removido'}</span>
                      <StatusBadge status={ped.status} />
                    </div>
                    <div style={{ fontSize: 12.5, color: '#90a6ba', marginBottom: 10 }}>
                      <span style={{ fontWeight: 700, color: '#0a4d8c' }}>Pedido nº {String(ped.numero ?? '—').padStart(4, '0')}</span> · {fmtData(ped.data)}
                      {ped.vendedorNome && ` · vendedor: ${ped.vendedorNome}`}
                    </div>
                    {ped.itens.map((i) => (
                      <div key={i.produtoId} style={{ fontSize: 14, color: '#3a5872', display: 'flex', justifyContent: 'space-between', padding: '3px 0', gap: 10 }}>
                        <span>{descreverQtdItem(i, dados.produtos, dados.industrias)} {prefixoIndustriaItem(i, dados.produtos, dados.industrias)}{i.nome}</span>
                        <span style={{ flexShrink: 0 }}>{fmtMoeda(i.preco * i.qtd)}</span>
                      </div>
                    ))}
                    {ped.observacao && (
                      <div style={{ marginTop: 8, fontSize: 13, color: '#92400e', background: '#fef3e0', borderRadius: 8, padding: '9px 12px', border: '1px solid #fce0a8' }}>
                        <span style={{ fontWeight: 700 }}>Observação do cliente:</span> {ped.observacao}
                      </div>
                    )}
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #eef3f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#0a3a66' }}>Total {fmtMoeda(ped.total)}</span>
                      {ped.status === 'novo' && (
                        <button onClick={() => marcarConfirmado(ped.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#e9f7ee', color: '#1c8a4b', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                          <Icon.Check width={14} height={14} /> Confirmar pedido
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {aba === 'precos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setNovoProdutoAberto(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#eaf1f7', color: '#0a4d8c', border: 'none', borderRadius: 9, padding: '10px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <Icon.Plus width={15} height={15} /> Novo produto
                </button>
                <button
                  onClick={gerarEBaixarPDFAdmin}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#eaf1f7', color: '#0a4d8c', border: 'none', borderRadius: 9, padding: '10px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <Icon.Download width={15} height={15} /> Gerar PDF
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(montarTextoTabelaAdmin())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { try { navigator.clipboard.writeText(montarTextoTabelaAdmin()); } catch (e) {} }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#e9f7ee', color: '#1c8a4b', border: 'none', borderRadius: 9, padding: '10px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none' }}
                >
                  <Icon.WhatsApp width={15} height={15} /> Enviar tabela
                </a>
                <button
                  onClick={() => {
                    try { navigator.clipboard.writeText(montarTextoTabelaAdmin()); } catch (e) {}
                    setTabelaCopiada(true);
                    setTimeout(() => setTabelaCopiada(false), 2000);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#eaf1f7', color: '#0a4d8c', border: 'none', borderRadius: 9, padding: '10px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {tabelaCopiada ? '✓ Copiado!' : 'Copiar tabela'}
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {precosSalvosRecentemente && (
                <span style={{ fontSize: 13, color: '#1c8a4b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon.Check width={14} height={14} /> Salvo!
                </span>
              )}
              <button
                onClick={salvarAlteracoesDeTabela}
                disabled={!precosNaoSalvos || salvandoPrecos}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  background: precosNaoSalvos ? '#0a4d8c' : '#c2d1de',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 9,
                  padding: '10px 16px',
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: precosNaoSalvos && !salvandoPrecos ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                }}
              >
                <Icon.Check width={15} height={15} /> {salvandoPrecos ? 'Salvando...' : precosNaoSalvos ? 'Salvar alterações' : 'Tudo salvo'}
              </button>
              </div>
            </div>

            {novaIndustriaAberta && (
              <FormNovaIndustria
                onSalvar={adicionarIndustria}
                onCancelar={() => setNovaIndustriaAberta(false)}
              />
            )}

            {novoProdutoAberto && !novaIndustriaAberta && (
              <FormNovoProduto
                industrias={dados.industrias}
                onSalvar={adicionarProduto}
                onCancelar={() => setNovoProdutoAberto(false)}
                onAbrirNovaIndustria={() => setNovaIndustriaAberta(true)}
              />
            )}

            {(() => {
              const produtosPorIndustria = {};
              dados.produtos.forEach((p) => {
                const chave = p.industriaId || 'sem-industria';
                if (!produtosPorIndustria[chave]) produtosPorIndustria[chave] = [];
                produtosPorIndustria[chave].push(p);
              });
              const grupos = [
                ...dados.industrias.map((ind) => ({ industria: ind, produtos: produtosPorIndustria[ind.id] || [] })),
                { industria: null, produtos: produtosPorIndustria['sem-industria'] || [] },
              ]
                .filter((g) => g.produtos.length > 0)
                .sort((a, b) => {
                  const suspA = grupoEstaSuspenso(a.industria, a.produtos) ? 1 : 0;
                  const suspB = grupoEstaSuspenso(b.industria, b.produtos) ? 1 : 0;
                  if (suspA !== suspB) return suspA - suspB;
                  return categoriaGrupoRank(a.produtos) - categoriaGrupoRank(b.produtos);
                });

              return grupos.map(({ industria, produtos }) => {
                const statusGrupo = industria ? (statusVendaPorIndustria[industria.id] || 'ativa') : 'ativa';
                const suspensa = statusGrupo === 'suspensa';
                return (
                  <div key={industria ? industria.id : 'outros'} style={{ marginBottom: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                      <div
                        style={{
                          display: 'inline-block',
                          fontSize: 12,
                          fontWeight: 800,
                          padding: '4px 12px',
                          borderRadius: 6,
                          background: industria?.corSelo?.bg || '#5b7691',
                          color: industria?.corSelo?.texto || '#fff',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {industria ? industria.nome : 'Outros'}
                      </div>
                      {industria && (
                        <select
                          value={statusGrupo}
                          onChange={(e) => alterarStatusVenda(industria.id, e.target.value)}
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            padding: '6px 10px',
                            borderRadius: 8,
                            border: '1.5px solid ' + (suspensa ? '#f3b7ae' : '#b7ddc4'),
                            color: suspensa ? '#b3261e' : '#1c8a4b',
                            background: suspensa ? '#fdecea' : '#e9f7ee',
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="ativa">Venda ativa</option>
                          <option value="suspensa">Venda suspensa</option>
                        </select>
                      )}
                    </div>
                    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e3ecf4', overflow: 'hidden' }}>
                      {produtos.map((p, idx) => {
                        const ehZeroLactose = ['p8', 'p12', 'p16', 'p20'].includes(p.id);
                        const ehLeitePadrao = ['p1', 'p2', 'p3', 'p9', 'p10', 'p11', 'p13', 'p14', 'p15', 'p17', 'p18', 'p19'].includes(p.id);
                        const desabilitado = ehZeroLactose || suspensa;
                        return (
                          <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', borderTop: idx === 0 ? 'none' : '1px solid #eef3f8', gap: 10 }}>
                            <FotoProduto produto={p} size={44} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <input
                                type="text"
                                value={p.nome}
                                onChange={(e) => atualizarNomeProduto(p.id, e.target.value)}
                                style={{
                                  width: '100%',
                                  fontSize: 14,
                                  color: '#1c3a52',
                                  fontWeight: 500,
                                  border: '1.5px solid transparent',
                                  borderRadius: 6,
                                  padding: '3px 6px',
                                  fontFamily: 'inherit',
                                  marginLeft: -6,
                                  background: 'transparent',
                                }}
                                onFocus={(e) => { e.target.style.border = '1.5px solid #d7e3ed'; e.target.style.background = '#fff'; }}
                                onBlur={(e) => { e.target.style.border = '1.5px solid transparent'; e.target.style.background = 'transparent'; }}
                              />
                              <div style={{ fontSize: 12, color: '#90a6ba', marginTop: 2 }}>
                                {p.categoria}
                                {ehLeitePadrao && ' · preço sincronizado com Integral/Desnatado/Semidesnatado'}
                                {ehZeroLactose && ' · preço = Integral + R$ 0,50 (automático)'}
                                {suspensa && ' · venda suspensa'}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                              <span style={{ fontSize: 14, color: '#5b7691' }}>R$</span>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={precosEditandoTexto[p.id] !== undefined ? precosEditandoTexto[p.id] : String(p.precoPadrao ?? 0)}
                                disabled={desabilitado}
                                onFocus={(e) => {
                                  setPrecosEditandoTexto((prev) => ({ ...prev, [p.id]: String(p.precoPadrao ?? 0) }));
                                  e.target.select();
                                }}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9.,]/g, '');
                                  setPrecosEditandoTexto((prev) => ({ ...prev, [p.id]: raw }));
                                  const numero = parseFloat(raw.replace(',', '.'));
                                  if (!isNaN(numero)) atualizarPreco(p.id, numero);
                                }}
                                onBlur={() => {
                                  setPrecosEditandoTexto((prev) => {
                                    const copia = { ...prev };
                                    delete copia[p.id];
                                    return copia;
                                  });
                                }}
                                style={{
                                  width: 90,
                                  padding: '7px 10px',
                                  borderRadius: 8,
                                  border: '1.5px solid #d7e3ed',
                                  fontSize: 14,
                                  textAlign: 'right',
                                  fontFamily: 'inherit',
                                  background: desabilitado ? '#f5f8fb' : '#fff',
                                  color: desabilitado ? '#90a6ba' : '#1c3a52',
                                }}
                              />
                            </div>
                            <button
                              onClick={() => removerProduto(p.id)}
                              title="Excluir produto"
                              style={{ background: '#fdecea', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b3261e', cursor: 'pointer', flexShrink: 0 }}
                            >
                              <Icon.Trash width={14} height={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {aba === 'clientes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
              <button onClick={() => setNovoClienteAberto(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0a4d8c', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                <Icon.Plus width={15} height={15} /> Novo cliente
              </button>
            </div>

            {novoClienteAberto && <FormNovoCliente onSalvar={adicionarCliente} onCancelar={() => setNovoClienteAberto(false)} />}

            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e3ecf4', overflow: 'hidden' }}>
              {dados.clientes.map((c, idx) => {
                const vendedorDoCliente = dados.vendedores.find((v) => v.id === c.vendedorId);
                return (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderTop: idx === 0 ? 'none' : '1px solid #eef3f8', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: '#1c3a52' }}>{c.nomeFantasia}</div>
                      <div style={{ fontSize: 12.5, color: '#90a6ba' }}>{c.cnpj} · usuário: {c.usuario} · prazo: {c.prazoPagamento || 'não definido'}</div>
                    </div>
                    <select
                      value={c.vendedorId || ''}
                      onChange={(e) => atribuirVendedorAoCliente(c.id, e.target.value)}
                      style={{
                        fontSize: 12.5,
                        padding: '7px 9px',
                        borderRadius: 8,
                        border: '1.5px solid #d7e3ed',
                        color: vendedorDoCliente ? '#1c3a52' : '#b3261e',
                        background: vendedorDoCliente ? '#fff' : '#fdecea',
                        fontFamily: 'inherit',
                        flexShrink: 0,
                        maxWidth: 140,
                      }}
                    >
                      <option value="">Sem vendedor</option>
                      {dados.vendedores.map((v) => (
                        <option key={v.id} value={v.id}>{v.nome}</option>
                      ))}
                    </select>
                    <button onClick={() => removerCliente(c.id)} style={{ background: '#fdecea', border: 'none', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b3261e', cursor: 'pointer', flexShrink: 0 }}>
                      <Icon.Trash width={15} height={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {aba === 'vendedores' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
              <button onClick={() => setNovoVendedorAberto(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0a4d8c', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                <Icon.Plus width={15} height={15} /> Novo vendedor
              </button>
            </div>

            {novoVendedorAberto && <FormNovoVendedor onSalvar={adicionarVendedor} onCancelar={() => setNovoVendedorAberto(false)} />}

            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e3ecf4', overflow: 'hidden' }}>
              {dados.vendedores.length === 0 ? (
                <EmptyState texto="Nenhum vendedor cadastrado ainda." />
              ) : (
                dados.vendedores.map((v, idx) => {
                  const qtdClientes = dados.clientes.filter((c) => c.vendedorId === v.id).length;
                  return (
                    <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderTop: idx === 0 ? 'none' : '1px solid #eef3f8' }}>
                      <div>
                        <div style={{ fontSize: 14.5, fontWeight: 600, color: '#1c3a52' }}>{v.nome}</div>
                        <div style={{ fontSize: 12.5, color: '#90a6ba' }}>usuário: {v.usuario} · {qtdClientes} cliente{qtdClientes !== 1 ? 's' : ''} na carteira</div>
                      </div>
                      <button onClick={() => removerVendedor(v.id)} style={{ background: '#fdecea', border: 'none', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b3261e', cursor: 'pointer' }}>
                        <Icon.Trash width={15} height={15} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FormNovoVendedor({ onSalvar, onCancelar }) {
  const [form, setForm] = useState({ nome: '', usuario: '', senha: '' });

  function salvar() {
    if (!form.nome || !form.usuario || !form.senha) return;
    onSalvar(form);
  }

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e3ecf4', padding: 20, marginBottom: 16 }}>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0a3a66', marginBottom: 14 }}>Cadastrar novo vendedor</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <Campo label="Nome do vendedor" value={form.nome} onChange={(v) => setForm({ ...form, nome: v })} />
        <Campo label="Usuário de acesso" value={form.usuario} onChange={(v) => setForm({ ...form, usuario: v })} />
        <Campo label="Senha" value={form.senha} onChange={(v) => setForm({ ...form, senha: v })} />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={salvar} style={{ background: '#0a4d8c', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Salvar vendedor</button>
        <button onClick={onCancelar} style={{ background: '#f5f8fb', color: '#5b7691', border: '1px solid #e3ecf4', borderRadius: 9, padding: '10px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
      </div>
    </div>
  );
}

function FormNovoCliente({ onSalvar, onCancelar }) {
  const [form, setForm] = useState({ nomeFantasia: '', cnpj: '', usuario: '', senha: '', prazoPagamento: 'À vista' });

  function salvar() {
    if (!form.nomeFantasia || !form.usuario || !form.senha) return;
    onSalvar(form);
  }

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e3ecf4', padding: 20, marginBottom: 16 }}>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0a3a66', marginBottom: 14 }}>Cadastrar novo cliente</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <Campo label="Nome fantasia" value={form.nomeFantasia} onChange={(v) => setForm({ ...form, nomeFantasia: v })} />
        <Campo label="CNPJ" value={form.cnpj} onChange={(v) => setForm({ ...form, cnpj: v })} />
        <Campo label="Usuário de acesso" value={form.usuario} onChange={(v) => setForm({ ...form, usuario: v })} />
        <Campo label="Senha" value={form.senha} onChange={(v) => setForm({ ...form, senha: v })} />
        <Campo label="Prazo de pagamento (ex: 14/21/28 dias)" value={form.prazoPagamento} onChange={(v) => setForm({ ...form, prazoPagamento: v })} />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={salvar} style={{ background: '#0a4d8c', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Salvar cliente</button>
        <button onClick={onCancelar} style={{ background: '#f5f8fb', color: '#5b7691', border: '1px solid #e3ecf4', borderRadius: 9, padding: '10px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
      </div>
    </div>
  );
}

function FormNovoProduto({ industrias, onSalvar, onCancelar, onAbrirNovaIndustria }) {
  const [form, setForm] = useState({
    nome: '',
    categoria: 'Leite UHT',
    precoPadrao: '',
    industriaId: '',
    validadeDias: '',
    unidadeVenda: 'un', // 'un' (por unidade) ou 'kg' (peso variável)
  });

  function salvar() {
    if (!form.nome || !form.precoPadrao) return;
    onSalvar({
      nome: form.nome,
      categoria: form.categoria || 'Outros',
      precoPadrao: parseFloat(form.precoPadrao) || 0,
      industriaId: form.industriaId || null,
      validadeDias: form.validadeDias ? parseInt(form.validadeDias, 10) : null,
      unidadeVenda: form.unidadeVenda,
      foto: null,
    });
  }

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e3ecf4', padding: 20, marginBottom: 16 }}>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0a3a66', marginBottom: 14 }}>Cadastrar novo produto</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <Campo label="Nome do produto" value={form.nome} onChange={(v) => setForm({ ...form, nome: v })} />
        <Campo label="Categoria" value={form.categoria} onChange={(v) => setForm({ ...form, categoria: v })} />
        <Campo label="Preço padrão (R$)" value={form.precoPadrao} onChange={(v) => setForm({ ...form, precoPadrao: v })} />
        <Campo label="Validade (dias, opcional)" value={form.validadeDias} onChange={(v) => setForm({ ...form, validadeDias: v })} />
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: '#5b7691', display: 'block', marginBottom: 5 }}>Vendido por</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setForm({ ...form, unidadeVenda: 'un' })}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                border: '1.5px solid ' + (form.unidadeVenda === 'un' ? '#0a4d8c' : '#d7e3ed'),
                background: form.unidadeVenda === 'un' ? '#eaf1f7' : '#fff',
                color: form.unidadeVenda === 'un' ? '#0a4d8c' : '#5b7691',
              }}
            >
              Unidade
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, unidadeVenda: 'kg' })}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                border: '1.5px solid ' + (form.unidadeVenda === 'kg' ? '#0a4d8c' : '#d7e3ed'),
                background: form.unidadeVenda === 'kg' ? '#eaf1f7' : '#fff',
                color: form.unidadeVenda === 'kg' ? '#0a4d8c' : '#5b7691',
              }}
            >
              Peso (kg)
            </button>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: '#5b7691', display: 'block', marginBottom: 5 }}>Indústria (opcional)</label>
          <select
            value={form.industriaId}
            onChange={(e) => setForm({ ...form, industriaId: e.target.value })}
            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #d7e3ed', fontSize: 13.5, fontFamily: 'inherit', boxSizing: 'border-box' }}
          >
            <option value="">Nenhuma (ex: queijos avulsos)</option>
            {industrias.map((i) => (
              <option key={i.id} value={i.id}>{i.nome}</option>
            ))}
          </select>
          {onAbrirNovaIndustria && (
            <button
              type="button"
              onClick={onAbrirNovaIndustria}
              style={{ marginTop: 6, background: 'none', border: 'none', color: '#0a4d8c', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0, fontFamily: 'inherit' }}
            >
              + Cadastrar nova indústria/fornecedor
            </button>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={salvar} style={{ background: '#0a4d8c', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Salvar produto</button>
        <button onClick={onCancelar} style={{ background: '#f5f8fb', color: '#5b7691', border: '1px solid #e3ecf4', borderRadius: 9, padding: '10px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
      </div>
    </div>
  );
}

function FormNovaIndustria({ onSalvar, onCancelar }) {
  const [form, setForm] = useState({
    nome: '',
    tipoVenda: 'pallet', // 'pallet' (leite longa vida, embalagem fechada) ou 'peso' (queijo, peso variável)
    unidadesPorCaixa: '12',
    caixasPorPallet: '85',
    pallettesMinimoPorPedido: '12',
    pecasPorCaixa: '6',
    kgPorPecaAprox: '4',
    kgPorPalletAprox: '1000',
    pesoMinimoKgPorPedido: '500',
    corBg: '#0a4d8c',
    corTexto: '#ffe066',
    regraCarga: '',
  });

  function salvar() {
    if (!form.nome) return;
    const ehPeso = form.tipoVenda === 'peso';
    const regraPadrao = ehPeso
      ? `Mínimo de ${form.pesoMinimoKgPorPedido || 0} kg por CNPJ`
      : `Carreta: pedido mínimo de ${form.pallettesMinimoPorPedido || 0} pallets`;
    onSalvar({
      nome: form.nome,
      tipoVenda: ehPeso ? 'peso' : undefined,
      unidadesPorCaixa: !ehPeso ? parseInt(form.unidadesPorCaixa, 10) || null : null,
      caixasPorPallet: parseInt(form.caixasPorPallet, 10) || null,
      pallettesMinimoPorPedido: !ehPeso ? parseInt(form.pallettesMinimoPorPedido, 10) || null : null,
      pecasPorCaixa: ehPeso ? parseInt(form.pecasPorCaixa, 10) || null : null,
      kgPorPecaAprox: ehPeso ? parseFloat(form.kgPorPecaAprox) || null : null,
      kgPorPalletAprox: ehPeso ? parseFloat(form.kgPorPalletAprox) || null : null,
      pesoMinimoKgPorPedido: ehPeso ? parseFloat(form.pesoMinimoKgPorPedido) || null : null,
      corSelo: { bg: form.corBg, texto: form.corTexto },
      regraCarga: form.regraCarga.trim() || regraPadrao,
    });
  }

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e3ecf4', padding: 20, marginBottom: 16 }}>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0a3a66', marginBottom: 14 }}>Cadastrar nova indústria/fornecedor</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <Campo label="Nome da indústria" value={form.nome} onChange={(v) => setForm({ ...form, nome: v })} />
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: '#5b7691', display: 'block', marginBottom: 5 }}>Forma de venda</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setForm({ ...form, tipoVenda: 'pallet' })}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                border: '1.5px solid ' + (form.tipoVenda === 'pallet' ? '#0a4d8c' : '#d7e3ed'),
                background: form.tipoVenda === 'pallet' ? '#eaf1f7' : '#fff',
                color: form.tipoVenda === 'pallet' ? '#0a4d8c' : '#5b7691',
              }}
            >
              Pallet fechado
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, tipoVenda: 'peso' })}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                border: '1.5px solid ' + (form.tipoVenda === 'peso' ? '#0a4d8c' : '#d7e3ed'),
                background: form.tipoVenda === 'peso' ? '#eaf1f7' : '#fff',
                color: form.tipoVenda === 'peso' ? '#0a4d8c' : '#5b7691',
              }}
            >
              Peso variável (kg)
            </button>
          </div>
        </div>

        {form.tipoVenda === 'pallet' ? (
          <>
            <Campo label="Unidades por caixa" value={form.unidadesPorCaixa} onChange={(v) => setForm({ ...form, unidadesPorCaixa: v })} />
            <Campo label="Caixas por pallet" value={form.caixasPorPallet} onChange={(v) => setForm({ ...form, caixasPorPallet: v })} />
            <Campo label="Pallets mínimo por pedido" value={form.pallettesMinimoPorPedido} onChange={(v) => setForm({ ...form, pallettesMinimoPorPedido: v })} />
          </>
        ) : (
          <>
            <Campo label="Peças por caixa" value={form.pecasPorCaixa} onChange={(v) => setForm({ ...form, pecasPorCaixa: v })} />
            <Campo label="Kg aprox. por peça" value={form.kgPorPecaAprox} onChange={(v) => setForm({ ...form, kgPorPecaAprox: v })} />
            <Campo label="Caixas por pallet (aprox.)" value={form.caixasPorPallet} onChange={(v) => setForm({ ...form, caixasPorPallet: v })} />
            <Campo label="Kg aprox. por pallet" value={form.kgPorPalletAprox} onChange={(v) => setForm({ ...form, kgPorPalletAprox: v })} />
            <Campo label="Peso mínimo por pedido (kg)" value={form.pesoMinimoKgPorPedido} onChange={(v) => setForm({ ...form, pesoMinimoKgPorPedido: v })} />
          </>
        )}

        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: '#5b7691', display: 'block', marginBottom: 5 }}>Cor da faixa (fundo)</label>
          <input type="color" value={form.corBg} onChange={(e) => setForm({ ...form, corBg: e.target.value })} style={{ width: '100%', height: 38, borderRadius: 8, border: '1.5px solid #d7e3ed', padding: 2, boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: '#5b7691', display: 'block', marginBottom: 5 }}>Cor do texto da faixa</label>
          <input type="color" value={form.corTexto} onChange={(e) => setForm({ ...form, corTexto: e.target.value })} style={{ width: '100%', height: 38, borderRadius: 8, border: '1.5px solid #d7e3ed', padding: 2, boxSizing: 'border-box' }} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <Campo label="Regra de carga (opcional — se vazio, gera uma automática)" value={form.regraCarga} onChange={(v) => setForm({ ...form, regraCarga: v })} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={salvar} style={{ background: '#0a4d8c', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Salvar indústria</button>
        <button onClick={onCancelar} style={{ background: '#f5f8fb', color: '#5b7691', border: '1px solid #e3ecf4', borderRadius: 9, padding: '10px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
      </div>
    </div>
  );
}

function Campo({ label, value, onChange }) {
  return (
    <div>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: '#5b7691', display: 'block', marginBottom: 5 }}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #d7e3ed', fontSize: 13.5, fontFamily: 'inherit', boxSizing: 'border-box' }} />
    </div>
  );
}

// ---------- APP RAIZ ----------
export default function App() {
  // Sessão: { tipo: 'admin'|'vendedor', token, vendedorId?, vendedorNome? }.
  // Se houver uma sessão salva no aparelho, o app já abre logado.
  const [sessao, setSessao] = useState(() => carregarSessaoSalva());
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(() => !!carregarSessaoSalva());
  const [erroConexao, setErroConexao] = useState(null);

  function sair() {
    logoutNoBanco().catch(() => {});
    setPortalToken(null);
    limparSessao();
    setDados(null);
    setSessao(null);
  }

  // Assim que há uma sessão (salva ou recém-logada): valida o crachá no banco
  // e carrega os dados. Sem sessão válida, o banco não devolve nada (RLS).
  useEffect(() => {
    if (!sessao) return;
    let cancelado = false;
    setCarregando(true);
    setErroConexao(null);
    setPortalToken(sessao.token);
    validarSessaoNoBanco()
      .then((tipo) => {
        if (cancelado) return null;
        if (!tipo) {
          // Crachá vencido ou inválido: volta para a tela de login.
          setPortalToken(null);
          limparSessao();
          setSessao(null);
          setCarregando(false);
          return null;
        }
        return loadData().then((d) => {
          if (!cancelado) {
            setDados(d);
            setCarregando(false);
          }
        });
      })
      .catch((err) => {
        if (!cancelado) {
          setErroConexao(err.message || 'Não foi possível conectar ao banco de dados.');
          setCarregando(false);
        }
      });
    return () => { cancelado = true; };
  }, [sessao]);

  async function registrarPedido(pedido) {
    // Atualiza a tela imediatamente (resposta rápida pro usuário)...
    setDados((prev) => ({ ...prev, pedidos: [...prev.pedidos, pedido] }));
    // ...e grava no banco de dados em paralelo.
    try {
      await salvarPedidoNoBanco(pedido);
    } catch (e) {
      console.error('Erro ao salvar pedido no banco:', e);
    }
  }

  if (carregando) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f8fb', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <Logo size={48} />
          <div style={{ marginTop: 20, fontSize: 13.5, color: '#5b7691' }}>Carregando...</div>
        </div>
      </div>
    );
  }

  if (erroConexao) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f8fb', fontFamily: 'Inter, system-ui, sans-serif', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <Logo size={44} />
          <div style={{ marginTop: 20, fontSize: 14, color: '#b3261e', background: '#fdecea', padding: '14px 18px', borderRadius: 10 }}>
            Não foi possível conectar ao banco de dados. Verifique sua conexão com a internet e tente novamente.
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, background: '#0a4d8c', color: '#fff', border: 'none', borderRadius: 9, padding: '11px 20px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!sessao) {
    return <TelaLogin onLogin={setSessao} />;
  }

  if (!dados) {
    // Intervalo curto entre validar a sessão e os dados chegarem — evita tela quebrada.
    return null;
  }

  if (sessao.tipo === 'admin') {
    return <PainelAdmin dados={dados} setDados={setDados} onSair={sair} />;
  }

  // O cadastro do próprio vendedor vem do banco; se ainda não veio, usa o que
  // está guardado na sessão (id e nome) para não travar a tela.
  const vendedor =
    dados.vendedores.find((v) => v.id === sessao.vendedorId) ||
    { id: sessao.vendedorId, usuario: '', nome: sessao.vendedorNome || 'Vendedor' };

  return (
    <PainelVendedor
      vendedor={vendedor}
      dados={dados}
      onSair={sair}
      onNovoPedido={registrarPedido}
    />
  );
}
