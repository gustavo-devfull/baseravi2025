import React from 'react';
import { X, Package } from 'lucide-react';
import type { Product } from '../../types/Product';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatCurrencyUSD = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '95vw',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: '#dbeafe',
              borderRadius: '0.5rem',
              marginRight: '0.75rem'
            }}>
              <Package style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>
                Detalhes do Produto
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                {product.name} - {product.referencia}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              color: '#9ca3af',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.25rem'
            }}
          >
            <X style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            {/* Coluna 1: Imagem e Informações Básicas */}
            <div>
              {/* Imagem */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                  Imagem do Produto
                </h4>
                <div style={{
                  width: '100%',
                  height: '300px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  border: '2px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {product.referencia ? (
                    <img
                      src={`https://nyc3.digitaloceanspaces.com/moribr/base-fotos/${product.referencia}.jpg`}
                      alt={`Imagem do produto ${product.referencia}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: product.referencia ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                  }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '0.25rem',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Package style={{ width: '1.5rem', height: '1.5rem' }} />
                    </div>
                    <span>Sem imagem</span>
                  </div>
                </div>
              </div>

              {/* Informações Básicas */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>
                  Informações Básicas
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Nome:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.name || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Descrição:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.description || 'N/A'}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Referência:</span>
                      <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.referencia || 'N/A'}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Fabricante:</span>
                      <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.fabrica || 'N/A'}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Marca:</span>
                      <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.marca || 'N/A'}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Item No:</span>
                      <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.itemNo || 'N/A'}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Linha Cotações:</span>
                      <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.linhaCotacoes || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna 2: Preços e Quantidades */}
            <div>
              {/* Preços */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>
                  Preços e Quantidades
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Preço Unitário RMB:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{formatCurrency(product.unitPriceRmb || 0)}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Valor Invoice USD:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{formatCurrencyUSD(product.valorInvoiceUsd || 0)}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>MOQ:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.moq || 0}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Unidades por CTN:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.unitCtn || 0}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Qt Min Venda:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.qtMinVenda || 0}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Unidade:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.unit || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Dimensões */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>
                  Dimensões e Peso
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Dimensões (L×W×H):</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>
                      {product.l || 0} × {product.w || 0} × {product.h || 0} cm
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>CBM:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.cbm || 0} m³</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Peso Bruto:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.gw || 0} kg</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Peso Líquido:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.nw || 0} kg</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Peso Unitário:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.pesoUnitario || 0} kg</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna 3: Códigos e Nomes */}
            <div>
              {/* Códigos */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>
                  Códigos
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Código Ravi:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.codRavi || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>EAN:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.ean || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>DUN:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.dun || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>NCM:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.ncm || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>CEST:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.cest || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Nomes */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>
                  Nomes
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Nome Invoice EN:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.nomeInvoiceEn || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Nome DI NB:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.nomeDiNb || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Nome RAVI Profit:</span>
                    <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.nomeRaviProfit || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {(product.obs || product.remark || product.obsPedido) && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>
                    Observações
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {product.obs && (
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Observações Gerais:</span>
                        <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.obs}</div>
                      </div>
                    )}
                    {product.remark && (
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Remark:</span>
                        <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.remark}</div>
                      </div>
                    )}
                    {product.obsPedido && (
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>Observações do Pedido:</span>
                        <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>{product.obsPedido}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'flex-end',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
