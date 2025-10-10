import React from 'react';
import type { Product } from '../../types/Product';
import { ProductCardNew } from './ProductCardNew';

interface SampleProductsProps {
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onDeactivate: (productId: string) => void;
  onShowAllFields: (productId: string) => void;
}

export const SampleProducts: React.FC<SampleProductsProps> = ({
  onEdit,
  onDelete,
  onDeactivate,
  onShowAllFields
}) => {
  // Produtos de exemplo baseados na imagem
  const sampleProducts: Product[] = [
    {
      id: '1',
      linhaCotacoes: '',
      referencia: 'A11',
      fabrica: 'Settup',
      itemNo: '',
      description: 'BRAÇO FIXO / FIXED ARM',
      name: 'BRAÇO FIXO / FIXED ARM - A11',
      remark: '',
      obs: '',
      moq: 0,
      unitCtn: 0,
      unitPriceRmb: 12.00,
      unit: '',
      l: 0,
      w: 0,
      h: 0,
      cbm: 0,
      gw: 0,
      nw: 0,
      pesoUnitario: 0,
      marca: 'Settup',
      codRavi: '',
      ean: '',
      dun: '',
      nomeInvoiceEn: '',
      nomeDiNb: '',
      nomeRaviProfit: '',
      qtMinVenda: 0,
      ncm: '',
      cest: '',
      valorInvoiceUsd: 0,
      obsPedido: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      linhaCotacoes: '',
      referencia: 'A20',
      fabrica: 'Settup',
      itemNo: '',
      description: 'BRAÇO ARTICULADO / ARTICULATED ARM',
      name: 'BRAÇO ARTICULADO / ARTICULATED ARM - A20',
      remark: '',
      obs: '',
      moq: 0,
      unitCtn: 0,
      unitPriceRmb: 0.00,
      unit: '',
      l: 0,
      w: 0,
      h: 0,
      cbm: 0,
      gw: 0,
      nw: 0,
      pesoUnitario: 0,
      marca: 'Settup',
      codRavi: '',
      ean: '',
      dun: '',
      nomeInvoiceEn: '',
      nomeDiNb: '',
      nomeRaviProfit: '',
      qtMinVenda: 0,
      ncm: '',
      cest: '',
      valorInvoiceUsd: 0,
      obsPedido: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      linhaCotacoes: '',
      referencia: 'A40',
      fabrica: 'Settup',
      itemNo: '',
      description: 'BRAÇO BI-ARTICULADO / BI-ARTICULATED ARM',
      name: 'BRAÇO BI-ARTICULADO / BI-ARTICULATED ARM - A40',
      remark: '',
      obs: '',
      moq: 0,
      unitCtn: 0,
      unitPriceRmb: 0.00,
      unit: '',
      l: 0,
      w: 0,
      h: 0,
      cbm: 0,
      gw: 0,
      nw: 0,
      pesoUnitario: 0,
      marca: 'Settup',
      codRavi: '',
      ean: '',
      dun: '',
      nomeInvoiceEn: '',
      nomeDiNb: '',
      nomeRaviProfit: '',
      qtMinVenda: 0,
      ncm: '',
      cest: '',
      valorInvoiceUsd: 0,
      obsPedido: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {sampleProducts.map((product) => (
        <ProductCardNew
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onDeactivate={onDeactivate}
          onShowAllFields={onShowAllFields}
        />
      ))}
    </div>
  );
};
