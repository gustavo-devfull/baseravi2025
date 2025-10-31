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
      padding: '0.5rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '95vw',
        maxHeight: '95vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto'
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
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, marginTop: '0.25rem' }}>
                {product.nomeRaviProfit || 'N/A'} | {product.referencia || 'N/A'}
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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem'
          }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Primeira linha: Referência | Nome */}
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Referência:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.referencia || 'N/A'}</div>
                    </div>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Nome:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.name || 'N/A'}</div>
                    </div>
                  </div>
                  
                  {/* Segunda linha: Marca | Fabricante | Item No */}
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Marca:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.marca || 'N/A'}</div>
                    </div>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Fabricante:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.fabrica || 'N/A'}</div>
                    </div>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Item No:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.itemNo || 'N/A'}</div>
                    </div>
                  </div>
                  
                  {/* Terceira linha: Descrição */}
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap', marginTop: '0.125rem' }}>Descrição:</span>
                    <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5', flex: 1 }}>{product.description || 'N/A'}</div>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Primeira linha: Preço Unitário RMB | Valor Invoice USD */}
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Preço Unitário RMB:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{formatCurrency(product.unitPriceRmb || 0)}</div>
                    </div>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Valor Invoice USD:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{formatCurrencyUSD(product.valorInvoiceUsd || 0)}</div>
                    </div>
                  </div>
                  
                  {/* Segunda linha: MOQ | Unidades por CTN | Qt Min Venda | Unidade */}
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>MOQ:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.moq || 0}</div>
                    </div>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Unidades por CTN:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.unitCtn || 0}</div>
                    </div>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Qt Min Venda:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.qtMinVenda || 0}</div>
                    </div>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Unidade:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.unit || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dimensões */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>
                  Dimensões e Peso
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Primeira linha: Dimensões (L×W×H) */}
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Dimensões (L×W×H):</span>
                    <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>
                      {product.l || 0} × {product.w || 0} × {product.h || 0} cm
                    </div>
                  </div>
                  
                  {/* Segunda linha: CBM | Peso Bruto | Peso Líquido | Peso Unitário */}
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>CBM:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.cbm || 0} m³</div>
                    </div>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Peso Bruto:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.gw || 0} kg</div>
                    </div>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Peso Líquido:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.nw || 0} kg</div>
                    </div>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Peso Unitário:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.pesoUnitario || 0} kg</div>
                    </div>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Primeira linha: Código Ravi | NCM | CEST */}
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Código Ravi:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.codRavi || 'N/A'}</div>
                    </div>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>NCM:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.ncm || 'N/A'}</div>
                    </div>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>CEST:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.cest || 'N/A'}</div>
                    </div>
                  </div>
                  
                  {/* Segunda linha: EAN | DUN */}
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>EAN:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.ean || 'N/A'}</div>
                    </div>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>DUN:</span>
                      <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.dun || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nomes */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>
                  Nomes
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Nome Invoice EN:</span>
                    <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.nomeInvoiceEn || 'N/A'}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Nome DI NB:</span>
                    <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.nomeDiNb || 'N/A'}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Nome RAVI Profit:</span>
                    <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.nomeRaviProfit || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {(product.obs || product.remark || product.obsPedido) && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>
                    Observações
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {product.obs && (
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Observações Gerais:</span>
                        <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.obs}</div>
                      </div>
                    )}
                    {product.remark && (
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Remark:</span>
                        <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.remark}</div>
                      </div>
                    )}
                    {product.obsPedido && (
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: '#0175a6', whiteSpace: 'nowrap' }}>Observações do Pedido:</span>
                        <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.5' }}>{product.obsPedido}</div>
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
