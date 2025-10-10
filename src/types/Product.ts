export interface Product {
  id?: string;
  linhaCotacoes: string;
  referencia: string;
  fabrica: string;
  itemNo: string;
  description: string;
  name: string;
  remark: string;
  obs: string;
  moq: number;
  unitCtn: number;
  unitPriceRmb: number;
  unit: string;
  l: number; // length
  w: number; // width
  h: number; // height
  cbm: number; // cubic meter
  gw: number; // gross weight
  nw: number; // net weight
  pesoUnitario: number;
  marca: string;
  codRavi: string;
  ean: string;
  dun: string;
  nomeInvoiceEn: string;
  nomeDiNb: string;
  nomeRaviProfit: string;
  qtMinVenda: number;
  ncm: string;
  cest: string;
  valorInvoiceUsd: number;
  obsPedido: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFormData extends Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {}

export interface ProductFilters {
  search?: string;
  fabrica?: string;
  marca?: string;
  minPrice?: number;
  maxPrice?: number;
}
