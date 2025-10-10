import React, { useState, useEffect } from 'react';
import { X, Save, Package, Edit3 } from 'lucide-react';
import type { ProductFormData } from '../../types/Product';

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductFormData[];
  onSave: (products: ProductFormData[]) => void;
}

export const BulkEditModal: React.FC<BulkEditModalProps> = ({
  isOpen,
  onClose,
  products,
  onSave
}) => {
  const [editedProducts, setEditedProducts] = useState<ProductFormData[]>(products);
  const [isSaving, setIsSaving] = useState(false);

  // Atualizar produtos quando as props mudarem
  useEffect(() => {
    console.log('BulkEditModal - useEffect - Produtos recebidos:', products.length);
    console.log('BulkEditModal - useEffect - isOpen:', isOpen);
    setEditedProducts(products);
  }, [products, isOpen]);

  // Log para debug
  console.log('BulkEditModal - Produtos recebidos:', products.length);
  console.log('BulkEditModal - Primeiro produto:', products[0]);
  console.log('BulkEditModal - isOpen:', isOpen);

  const handleProductChange = (index: number, field: keyof ProductFormData, value: string | number) => {
    setEditedProducts(prev => prev.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editedProducts);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produtos:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

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
        maxWidth: '80rem',
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
              backgroundColor: '#fef3c7',
              borderRadius: '0.5rem',
              marginRight: '0.75rem'
            }}>
              <Edit3 style={{ width: '1.5rem', height: '1.5rem', color: '#d97706' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>
                Editar Produtos Importados
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                {editedProducts.length} produtos para revisar e salvar
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
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {editedProducts.map((product, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  backgroundColor: '#f9fafb'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <Package style={{ width: '1rem', height: '1rem', color: '#6b7280', marginRight: '0.5rem' }} />
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                    Produto {index + 1}
                  </h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  {/* Coluna 1 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Nome *
                      </label>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Descrição
                      </label>
                      <input
                        type="text"
                        value={product.description}
                        onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Referência *
                      </label>
                      <input
                        type="text"
                        value={product.referencia}
                        onChange={(e) => handleProductChange(index, 'referencia', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Fabricante *
                      </label>
                      <input
                        type="text"
                        value={product.fabrica}
                        onChange={(e) => handleProductChange(index, 'fabrica', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Marca
                      </label>
                      <input
                        type="text"
                        value={product.marca}
                        onChange={(e) => handleProductChange(index, 'marca', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Item No
                      </label>
                      <input
                        type="text"
                        value={product.itemNo}
                        onChange={(e) => handleProductChange(index, 'itemNo', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Coluna 2 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Preço Unitário RMB *
                      </label>
                      <input
                        type="number"
                        value={product.unitPriceRmb}
                        onChange={(e) => handleProductChange(index, 'unitPriceRmb', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Valor Invoice USD
                      </label>
                      <input
                        type="number"
                        value={product.valorInvoiceUsd}
                        onChange={(e) => handleProductChange(index, 'valorInvoiceUsd', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        MOQ
                      </label>
                      <input
                        type="number"
                        value={product.moq}
                        onChange={(e) => handleProductChange(index, 'moq', parseInt(e.target.value) || 0)}
                        min="0"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Unidades por CTN
                      </label>
                      <input
                        type="number"
                        value={product.unitCtn}
                        onChange={(e) => handleProductChange(index, 'unitCtn', parseInt(e.target.value) || 0)}
                        min="0"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Unidade
                      </label>
                      <input
                        type="text"
                        value={product.unit}
                        onChange={(e) => handleProductChange(index, 'unit', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Quantidade Mínima de Venda
                      </label>
                      <input
                        type="number"
                        value={product.qtMinVenda}
                        onChange={(e) => handleProductChange(index, 'qtMinVenda', parseInt(e.target.value) || 0)}
                        min="0"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Dimensões */}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <h5 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>
                    Dimensões e Peso
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Comprimento (cm)
                      </label>
                      <input
                        type="number"
                        value={product.l}
                        onChange={(e) => handleProductChange(index, 'l', parseFloat(e.target.value) || 0)}
                        step="0.1"
                        min="0"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Largura (cm)
                      </label>
                      <input
                        type="number"
                        value={product.w}
                        onChange={(e) => handleProductChange(index, 'w', parseFloat(e.target.value) || 0)}
                        step="0.1"
                        min="0"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Altura (cm)
                      </label>
                      <input
                        type="number"
                        value={product.h}
                        onChange={(e) => handleProductChange(index, 'h', parseFloat(e.target.value) || 0)}
                        step="0.1"
                        min="0"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Peso Unitário (kg)
                      </label>
                      <input
                        type="number"
                        value={product.pesoUnitario}
                        onChange={(e) => handleProductChange(index, 'pesoUnitario', parseFloat(e.target.value) || 0)}
                        step="0.1"
                        min="0"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Peso Bruto (kg)
                      </label>
                      <input
                        type="number"
                        value={product.gw}
                        onChange={(e) => handleProductChange(index, 'gw', parseFloat(e.target.value) || 0)}
                        step="0.1"
                        min="0"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        CBM (m³)
                      </label>
                      <input
                        type="number"
                        value={product.cbm}
                        onChange={(e) => handleProductChange(index, 'cbm', parseFloat(e.target.value) || 0)}
                        step="0.001"
                        min="0"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Códigos */}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <h5 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>
                    Códigos
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Código Ravi
                      </label>
                      <input
                        type="text"
                        value={product.codRavi}
                        onChange={(e) => handleProductChange(index, 'codRavi', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        EAN
                      </label>
                      <input
                        type="text"
                        value={product.ean}
                        onChange={(e) => handleProductChange(index, 'ean', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        NCM
                      </label>
                      <input
                        type="text"
                        value={product.ncm}
                        onChange={(e) => handleProductChange(index, 'ncm', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        CEST
                      </label>
                      <input
                        type="text"
                        value={product.cest}
                        onChange={(e) => handleProductChange(index, 'cest', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <h5 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>
                    Observações
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Observações Gerais
                      </label>
                      <textarea
                        value={product.obs}
                        onChange={(e) => handleProductChange(index, 'obs', e.target.value)}
                        rows={2}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Remark
                      </label>
                      <textarea
                        value={product.remark}
                        onChange={(e) => handleProductChange(index, 'remark', e.target.value)}
                        rows={2}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Observações do Pedido
                      </label>
                      <textarea
                        value={product.obsPedido}
                        onChange={(e) => handleProductChange(index, 'obsPedido', e.target.value)}
                        rows={2}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
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
            Cancelar
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'white',
              backgroundColor: isSaving ? '#9ca3af' : '#16a34a',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
            {isSaving ? 'Salvando...' : `Salvar ${editedProducts.length} Produtos`}
          </button>
        </div>
      </div>
    </div>
  );
};
