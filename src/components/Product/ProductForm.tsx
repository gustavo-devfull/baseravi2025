import React, { useState, useEffect } from 'react';
import type { Product, ProductFormData } from '../../types/Product';
import { X, Save, Package } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: ProductFormData) => Promise<void>;
}

const initialFormData: ProductFormData = {
  linhaCotacoes: '',
  referencia: '',
  fabrica: '',
  itemNo: '',
  description: '',
  name: '',
  remark: '',
  obs: '',
  moq: 0,
  unitCtn: 0,
  unitPriceRmb: 0,
  unit: '',
  l: 0,
  w: 0,
  h: 0,
  cbm: 0,
  gw: 0,
  nw: 0,
  pesoUnitario: 0,
  marca: '',
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
};

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        linhaCotacoes: product.linhaCotacoes || '',
        referencia: product.referencia || '',
        fabrica: product.fabrica || '',
        itemNo: product.itemNo || '',
        description: product.description || '',
        name: product.name || '',
        remark: product.remark || '',
        obs: product.obs || '',
        moq: product.moq || 0,
        unitCtn: product.unitCtn || 0,
        unitPriceRmb: product.unitPriceRmb || 0,
        unit: product.unit || '',
        l: product.l || 0,
        w: product.w || 0,
        h: product.h || 0,
        cbm: product.cbm || 0,
        gw: product.gw || 0,
        nw: product.nw || 0,
        pesoUnitario: product.pesoUnitario || 0,
        marca: product.marca || '',
        codRavi: product.codRavi || '',
        ean: product.ean || '',
        dun: product.dun || '',
        nomeInvoiceEn: product.nomeInvoiceEn || '',
        nomeDiNb: product.nomeDiNb || '',
        nomeRaviProfit: product.nomeRaviProfit || '',
        qtMinVenda: product.qtMinVenda || 0,
        ncm: product.ncm || '',
        cest: product.cest || '',
        valorInvoiceUsd: product.valorInvoiceUsd || 0,
        obsPedido: product.obsPedido || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [product, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));

    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.referencia.trim()) {
      newErrors.referencia = 'Referência é obrigatória';
    }

    if (!formData.fabrica.trim()) {
      newErrors.fabrica = 'Fabricante é obrigatório';
    }

    if (formData.unitPriceRmb <= 0) {
      newErrors.unitPriceRmb = 'Preço deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setIsSubmitting(false);
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
      zIndex: 50,
      padding: '1rem'
    }}>
      {/* Modal */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: window.innerWidth < 768 ? '0.5rem 0.5rem 0 0' : '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: window.innerWidth < 768 ? '100vw' : '95vw',
        maxHeight: window.innerWidth < 768 ? '100vh' : '90vh',
        height: window.innerWidth < 768 ? '100vh' : 'auto',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        marginTop: window.innerWidth < 768 ? 'auto' : '0'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: window.innerWidth < 768 ? '1rem' : '1.5rem',
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
                {product ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                {product ? 'Atualize as informações do produto' : 'Preencha as informações do novo produto'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            overflowX: 'hidden', 
            padding: window.innerWidth < 768 ? '1rem' : '1.5rem',
            boxSizing: 'border-box'
          }}>
            {/* Seção 1: Informações Básicas */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                Informações Básicas
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr 1fr', 
                gap: '0.75rem' 
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: `1px solid ${errors.name ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Nome do produto"
                  />
                  {errors.name && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', margin: 0 }}>{errors.name}</p>}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Referência *
                  </label>
                  <input
                    type="text"
                    name="referencia"
                    value={formData.referencia}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: `1px solid ${errors.referencia ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Referência do produto"
                  />
                  {errors.referencia && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', margin: 0 }}>{errors.referencia}</p>}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Fabricante *
                  </label>
                  <input
                    type="text"
                    name="fabrica"
                    value={formData.fabrica}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: `1px solid ${errors.fabrica ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Nome do fabricante"
                  />
                  {errors.fabrica && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', margin: 0 }}>{errors.fabrica}</p>}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Marca
                  </label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Marca do produto"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Item No
                  </label>
                  <input
                    type="text"
                    name="itemNo"
                    value={formData.itemNo}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Número do item"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Linha Cotações
                  </label>
                  <input
                    type="text"
                    name="linhaCotacoes"
                    value={formData.linhaCotacoes}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Linha de cotações"
                  />
                </div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Descrição do produto"
                />
              </div>
            </div>

            {/* Seção 2: Preços e Quantidades */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                Preços e Quantidades
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr 1fr', 
                gap: '0.75rem' 
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Preço Unitário RMB *
                  </label>
                  <input
                    type="number"
                    name="unitPriceRmb"
                    value={formData.unitPriceRmb}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: `1px solid ${errors.unitPriceRmb ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="0.00"
                  />
                  {errors.unitPriceRmb && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', margin: 0 }}>{errors.unitPriceRmb}</p>}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Valor Invoice USD
                  </label>
                  <input
                    type="number"
                    name="valorInvoiceUsd"
                    value={formData.valorInvoiceUsd}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="0.00"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    MOQ
                  </label>
                  <input
                    type="number"
                    name="moq"
                    value={formData.moq}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="0"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Unit CTN
                  </label>
                  <input
                    type="number"
                    name="unitCtn"
                    value={formData.unitCtn}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="0"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Qt Min Venda
                  </label>
                  <input
                    type="number"
                    name="qtMinVenda"
                    value={formData.qtMinVenda}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="0"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Unidade"
                  />
                </div>
              </div>
            </div>

            {/* Seção 3: Dimensões e Peso */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                Dimensões e Peso
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr 1fr', 
                gap: '0.75rem' 
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Largura (L)
                  </label>
                  <input
                    type="number"
                    name="l"
                    value={formData.l}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="0"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Altura (H)
                  </label>
                  <input
                    type="number"
                    name="h"
                    value={formData.h}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="0"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Profundidade (W)
                  </label>
                  <input
                    type="number"
                    name="w"
                    value={formData.w}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="0"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    CBM (m³)
                  </label>
                  <input
                    type="number"
                    name="cbm"
                    value={formData.cbm}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="0"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Peso Unitário (kg)
                  </label>
                  <input
                    type="number"
                    name="pesoUnitario"
                    value={formData.pesoUnitario}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="0"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Peso Bruto (GW)
                  </label>
                  <input
                    type="number"
                    name="gw"
                    value={formData.gw}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="0"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Peso Líquido (NW)
                  </label>
                  <input
                    type="number"
                    name="nw"
                    value={formData.nw}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Seção 4: Campos Adicionais */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                Campos Adicionais
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr 1fr', 
                gap: '0.75rem' 
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Código RAVI
                  </label>
                  <input
                    type="text"
                    name="codRavi"
                    value={formData.codRavi}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Código RAVI"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    EAN
                  </label>
                  <input
                    type="text"
                    name="ean"
                    value={formData.ean}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Código EAN"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    DUN
                  </label>
                  <input
                    type="text"
                    name="dun"
                    value={formData.dun}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Código DUN"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    NCM
                  </label>
                  <input
                    type="text"
                    name="ncm"
                    value={formData.ncm}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Código NCM"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    CEST
                  </label>
                  <input
                    type="text"
                    name="cest"
                    value={formData.cest}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Código CEST"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Nome Invoice EN
                  </label>
                  <input
                    type="text"
                    name="nomeInvoiceEn"
                    value={formData.nomeInvoiceEn}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Nome em inglês"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Nome DI NB
                  </label>
                  <input
                    type="text"
                    name="nomeDiNb"
                    value={formData.nomeDiNb}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Nome DI NB"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Nome RAVI Profit
                  </label>
                  <input
                    type="text"
                    name="nomeRaviProfit"
                    value={formData.nomeRaviProfit}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Nome RAVI Profit"
                  />
                </div>
              </div>
            </div>

            {/* Seção 5: Observações */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                Observações
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr 1fr', 
                gap: '0.75rem' 
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Remark
                  </label>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    placeholder="Observações gerais"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    OBS
                  </label>
                  <textarea
                    name="obs"
                    value={formData.obs}
                    onChange={handleInputChange}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    placeholder="Observações adicionais"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    OBS Pedido
                  </label>
                  <textarea
                    name="obsPedido"
                    value={formData.obsPedido}
                    onChange={handleInputChange}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    placeholder="Observações do pedido"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: window.innerWidth < 768 ? '1rem' : '1.5rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: window.innerWidth < 768 ? 'column' : 'row',
            justifyContent: 'flex-end',
            gap: '0.75rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: '#6b7280',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: '1px solid #d1d5db',
                cursor: 'pointer',
                width: window.innerWidth < 768 ? '100%' : 'auto'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem 1.5rem',
                backgroundColor: isSubmitting ? '#9ca3af' : '#2563eb',
                color: 'white',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                width: window.innerWidth < 768 ? '100%' : 'auto'
              }}
            >
              <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};