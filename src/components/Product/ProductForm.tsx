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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        linhaCotacoes: product.linhaCotacoes,
        referencia: product.referencia,
        fabrica: product.fabrica,
        itemNo: product.itemNo,
        description: product.description,
        name: product.name,
        remark: product.remark,
        obs: product.obs,
        moq: product.moq,
        unitCtn: product.unitCtn,
        unitPriceRmb: product.unitPriceRmb,
        unit: product.unit,
        l: product.l,
        w: product.w,
        h: product.h,
        cbm: product.cbm,
        gw: product.gw,
        nw: product.nw,
        pesoUnitario: product.pesoUnitario,
        marca: product.marca,
        codRavi: product.codRavi,
        ean: product.ean,
        dun: product.dun,
        nomeInvoiceEn: product.nomeInvoiceEn,
        nomeDiNb: product.nomeDiNb,
        nomeRaviProfit: product.nomeRaviProfit,
        qtMinVenda: product.qtMinVenda,
        ncm: product.ncm,
        cest: product.cest,
        valorInvoiceUsd: product.valorInvoiceUsd,
        obsPedido: product.obsPedido,
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
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '56rem',
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
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Informações Básicas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#111827',
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '0.5rem',
                  margin: 0
                }}>
                  Informações Básicas
                </h4>
                
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
                      outline: 'none'
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
                      resize: 'vertical'
                    }}
                    placeholder="Descrição do produto"
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
                      outline: 'none'
                    }}
                    placeholder="Código de referência"
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
                      outline: 'none'
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
                      outline: 'none'
                    }}
                    placeholder="Marca do produto"
                  />
                </div>
              </div>

              {/* Preços e Quantidades */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#111827',
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '0.5rem',
                  margin: 0
                }}>
                  Preços e Quantidades
                </h4>

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
                    step="0.01"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: `1px solid ${errors.unitPriceRmb ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none'
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
                    step="0.01"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none'
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
                    MOQ (Quantidade Mínima)
                  </label>
                  <input
                    type="number"
                    name="moq"
                    value={formData.moq}
                    onChange={handleInputChange}
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none'
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
                    Unidades por CTN
                  </label>
                  <input
                    type="number"
                    name="unitCtn"
                    value={formData.unitCtn}
                    onChange={handleInputChange}
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none'
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
                    Unidade
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
                      outline: 'none'
                    }}
                    placeholder="Ex: pcs, kg, m"
                  />
                </div>
              </div>
            </div>

            {/* Dimensões e Peso */}
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#111827',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '0.5rem',
                marginBottom: '1rem',
                margin: 0
              }}>
                Dimensões e Peso
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Comprimento (cm)
                  </label>
                  <input
                    type="number"
                    name="l"
                    value={formData.l}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    placeholder="0.0"
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
                    Largura (cm)
                  </label>
                  <input
                    type="number"
                    name="w"
                    value={formData.w}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    placeholder="0.0"
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
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    name="h"
                    value={formData.h}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    placeholder="0.0"
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
                      outline: 'none'
                    }}
                    placeholder="0.0"
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
                    Peso Bruto (kg)
                  </label>
                  <input
                    type="number"
                    name="gw"
                    value={formData.gw}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    placeholder="0.0"
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
                      outline: 'none'
                    }}
                    placeholder="0.000"
                  />
                </div>
              </div>
            </div>

            {/* Campos Adicionais */}
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#111827',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '0.5rem',
                marginBottom: '1rem',
                margin: 0
              }}>
                Campos Adicionais
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Linha de Cotações
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
                      outline: 'none'
                    }}
                    placeholder="Linha de cotações"
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
                      outline: 'none'
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
                    Remark
                  </label>
                  <input
                    type="text"
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    placeholder="Remark do produto"
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
                    Código Ravi
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
                      outline: 'none'
                    }}
                    placeholder="Código Ravi"
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
                      outline: 'none'
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
                      outline: 'none'
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
                      outline: 'none'
                    }}
                    placeholder="Nome em inglês para invoice"
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
                      outline: 'none'
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
                    Nome Ravi Profit
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
                      outline: 'none'
                    }}
                    placeholder="Nome no sistema Ravi Profit"
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
                    Quantidade Mínima de Venda
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
                      outline: 'none'
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
                      outline: 'none'
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
                      outline: 'none'
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
                    Peso Líquido (kg)
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
                      outline: 'none'
                    }}
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>

            {/* Observações */}
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#111827',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '0.5rem',
                marginBottom: '1rem',
                margin: 0
              }}>
                Observações
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Observações Gerais
                  </label>
                  <textarea
                    name="obs"
                    value={formData.obs}
                    onChange={handleInputChange}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    placeholder="Observações gerais sobre o produto"
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
                    Observações do Pedido
                  </label>
                  <textarea
                    name="obsPedido"
                    value={formData.obsPedido}
                    onChange={handleInputChange}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    placeholder="Observações específicas para pedidos"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
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
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: isSubmitting ? '#9ca3af' : '#2563eb',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};