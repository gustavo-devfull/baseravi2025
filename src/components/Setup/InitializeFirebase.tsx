import React, { useState } from 'react';
import { ProductService } from '../../services/productService';
import type { ProductFormData } from '../../types/Product';
import { Database, CheckCircle } from 'lucide-react';

export const InitializeFirebase: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const sampleProducts: ProductFormData[] = [
    {
      linhaCotacoes: 'Linha A',
      referencia: 'A11',
      fabrica: 'Settup',
      itemNo: 'ST001',
      description: 'BRAÇO FIXO / FIXED ARM',
      name: 'BRAÇO FIXO / FIXED ARM - A11',
      remark: 'Produto de alta qualidade',
      obs: 'Braço fixo para monitores',
      moq: 10,
      unitCtn: 1,
      unitPriceRmb: 12.00,
      unit: 'pcs',
      l: 30.0,
      w: 5.0,
      h: 5.0,
      cbm: 0.00075,
      gw: 0.5,
      nw: 0.4,
      pesoUnitario: 0.4,
      marca: 'Settup',
      codRavi: 'RAVI001',
      ean: '1234567890123',
      dun: 'DUN001',
      nomeInvoiceEn: 'Fixed Monitor Arm A11',
      nomeDiNb: 'Braço Fixo A11',
      nomeRaviProfit: 'Braço Fixo A11',
      qtMinVenda: 1,
      ncm: '84716000',
      cest: 'CEST001',
      valorInvoiceUsd: 1.50,
      obsPedido: 'Produto frágil, manuseio cuidadoso'
    },
    {
      linhaCotacoes: 'Linha A',
      referencia: 'A20',
      fabrica: 'Settup',
      itemNo: 'ST002',
      description: 'BRAÇO ARTICULADO / ARTICULATED ARM',
      name: 'BRAÇO ARTICULADO / ARTICULATED ARM - A20',
      remark: 'Braço com articulação completa',
      obs: 'Braço articulado para monitores',
      moq: 5,
      unitCtn: 1,
      unitPriceRmb: 25.00,
      unit: 'pcs',
      l: 40.0,
      w: 6.0,
      h: 6.0,
      cbm: 0.00144,
      gw: 0.8,
      nw: 0.7,
      pesoUnitario: 0.7,
      marca: 'Settup',
      codRavi: 'RAVI002',
      ean: '1234567890124',
      dun: 'DUN002',
      nomeInvoiceEn: 'Articulated Monitor Arm A20',
      nomeDiNb: 'Braço Articulado A20',
      nomeRaviProfit: 'Braço Articulado A20',
      qtMinVenda: 1,
      ncm: '84716000',
      cest: 'CEST002',
      valorInvoiceUsd: 3.00,
      obsPedido: 'Produto com articulação, verificar funcionamento'
    },
    {
      linhaCotacoes: 'Linha A',
      referencia: 'A40',
      fabrica: 'Settup',
      itemNo: 'ST003',
      description: 'BRAÇO BI-ARTICULADO / BI-ARTICULATED ARM',
      name: 'BRAÇO BI-ARTICULADO / BI-ARTICULATED ARM - A40',
      remark: 'Braço com dupla articulação',
      obs: 'Braço bi-articulado para monitores',
      moq: 3,
      unitCtn: 1,
      unitPriceRmb: 45.00,
      unit: 'pcs',
      l: 50.0,
      w: 7.0,
      h: 7.0,
      cbm: 0.00245,
      gw: 1.2,
      nw: 1.0,
      pesoUnitario: 1.0,
      marca: 'Settup',
      codRavi: 'RAVI003',
      ean: '1234567890125',
      dun: 'DUN003',
      nomeInvoiceEn: 'Bi-Articulated Monitor Arm A40',
      nomeDiNb: 'Braço Bi-Articulado A40',
      nomeRaviProfit: 'Braço Bi-Articulado A40',
      qtMinVenda: 1,
      ncm: '84716000',
      cest: 'CEST003',
      valorInvoiceUsd: 5.50,
      obsPedido: 'Produto premium, embalagem especial'
    }
  ];

  const initializeDatabase = async () => {
    setIsInitializing(true);
    try {
      // Adiciona cada produto de exemplo
      for (const product of sampleProducts) {
        await ProductService.createProduct(product);
      }
      
      setIsInitialized(true);
      console.log('Banco de dados inicializado com produtos de exemplo!');
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  if (isInitialized) {
    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <CheckCircle style={{ width: '3rem', height: '3rem', color: '#16a34a', margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
          Banco Inicializado!
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
          Produtos de exemplo foram adicionados com sucesso ao Firebase.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Recarregar Página
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      textAlign: 'center',
      maxWidth: '400px'
    }}>
      <Database style={{ width: '3rem', height: '3rem', color: '#3b82f6', margin: '0 auto 1rem' }} />
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
        Inicializar Banco de Dados
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        Adicionar produtos de exemplo ao Firebase para começar a usar o sistema.
      </p>
      <button
        onClick={initializeDatabase}
        disabled={isInitializing}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: isInitializing ? '#9ca3af' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: isInitializing ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}
      >
        {isInitializing ? 'Inicializando...' : 'Inicializar Banco'}
      </button>
    </div>
  );
};
