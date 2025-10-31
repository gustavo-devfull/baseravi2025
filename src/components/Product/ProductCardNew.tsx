import React, { useState } from 'react';
import type { Product } from '../../types/Product';
import { Edit, Trash2, Eye, ZoomIn } from 'lucide-react';
import { ProductImageModal } from './ProductImageModal';
import { ProductDetailsModal } from './ProductDetailsModal';

interface ProductCardNewProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onDeactivate: (productId: string) => void;
  onShowAllFields: (productId: string) => void;
}

export const ProductCardNew: React.FC<ProductCardNewProps> = ({ 
  product, 
  onEdit, 
  onDelete, 
  onDeactivate
}) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Dados de exemplo baseados na imagem
  const productData = {
    marca: product.marca || 'Settup',
    nome: product.nomeRaviProfit || product.name || `${product.description} - ${product.referencia}` || 'BRAÇO FIXO / FIXED ARM - A11',
    referencia: product.referencia || 'A11',
    preco: product.unitPriceRmb || 12.00
  };

  const isActive = product.active !== false;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 15px 15px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      border: '1px solid #e5e7ebaf',
      padding: '1rem',
      marginBottom: '1rem',
      position: 'relative',
      opacity: isActive ? 1 : 0.5
    }}>
      {/* Overlay para produtos desativados */}
      {!isActive && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '0.5rem',
          pointerEvents: 'none',
          zIndex: 1
        }} />
      )}
      {/* Layout Desktop */}
      <div style={{ 
        display: window.innerWidth >= 768 ? 'grid' : 'none', 
        gridTemplateColumns: 'auto 1fr auto', 
        gap: '1rem', 
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Coluna 1: Foto */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Área da imagem */}
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            border: '2px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {productData.referencia ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img
                  src={`https://nyc3.digitaloceanspaces.com/moribr/base-fotos/${productData.referencia}.jpg`}
                  alt={`Imagem do produto ${productData.referencia}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowImageModal(true)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                {/* Botão de zoom */}
                <button
                  onClick={() => setShowImageModal(true)}
                  style={{
                    position: 'absolute',
                    top: '0.25rem',
                    right: '0.25rem',
                    padding: '0.25rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ZoomIn style={{ width: '0.75rem', height: '0.75rem' }} />
                </button>
              </div>
            ) : null}
            
            {/* Fallback - imagem padrão */}
            <div style={{
              width: '100%',
              height: '100%',
              display: productData.referencia ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: '#9ca3af',
              fontSize: '0.75rem',
              textAlign: 'center',
              padding: '0.5rem'
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
              </div>
              <span>Sem imagem</span>
            </div>
          </div>
        </div>

        {/* Coluna 2: Informações do Produto */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.25rem' }}>
          {/* Linha 1: Marca e Referência */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{productData.marca}</span>
            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827' }}>
              {productData.referencia}
            </span>
          </div>

          {/* Linha 2: Nome */}
          <div>
            <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.2' }}>
              {productData.nome}
            </div>
          </div>

          {/* Linha 3: Preço */}
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#059669' }}>
              {formatCurrency(productData.preco)}
            </div>
          </div>
        </div>

        {/* Coluna 3: Botões de ação */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
          {/* Primeira linha: EDITAR | EXCLUIR */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onEdit(product)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                backgroundColor: '#0175a6',
                color: 'white',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                flex: 1
              }}
            >
              <Edit style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
              Editar
            </button>
            <button
              onClick={() => onDelete(product.id!)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                backgroundColor: '#E65737f9',
                color: 'white',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                flex: 1
              }}
            >
              <Trash2 style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
              Excluir
            </button>
          </div>
          
          {/* Segunda linha: DESATIVAR | +INFO */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onDeactivate(product.id!)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                backgroundColor: '#0175a6af',
                color: 'white',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                flex: 1
              }}
            >
              Desativar
            </button>
            <button
              onClick={() => setShowDetailsModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                backgroundColor: '#0175a62a',
                color: '#374151',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                flex: 1
              }}
            >
              <Eye style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
              +info
            </button>
          </div>
        </div>
      </div>

      {/* Layout Mobile */}
      <div style={{ 
        display: window.innerWidth < 768 ? 'flex' : 'none', 
        gap: '0.75rem',
        alignItems: 'flex-start',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Coluna 1: Foto (40%) */}
        <div style={{ width: '40%', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '100%',
            aspectRatio: '1',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            border: '2px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {productData.referencia ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img
                  src={`https://nyc3.digitaloceanspaces.com/moribr/base-fotos/${productData.referencia}.jpg`}
                  alt={`Imagem do produto ${productData.referencia}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowImageModal(true)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <button
                  onClick={() => setShowImageModal(true)}
                  style={{
                    position: 'absolute',
                    top: '0.25rem',
                    right: '0.25rem',
                    padding: '0.25rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ZoomIn style={{ width: '0.75rem', height: '0.75rem' }} />
                </button>
              </div>
            ) : null}
            
            <div style={{
              width: '100%',
              height: '100%',
              display: productData.referencia ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: '#9ca3af',
              fontSize: '0.75rem',
              textAlign: 'center',
              padding: '0.5rem'
            }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                backgroundColor: '#e5e7eb',
                borderRadius: '0.25rem',
                marginBottom: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
              </div>
              <span>Sem imagem</span>
            </div>
          </div>
        </div>

        {/* Coluna 2: Informações (60%) */}
        <div style={{ width: '60%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* MARCA | REF */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>{productData.marca}</span>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>|</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#111827' }}>
              {productData.referencia}
            </span>
          </div>

          {/* NOME */}
          <div>
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#111827', 
              lineHeight: '1.3',
              fontWeight: '500'
            }}>
              {productData.nome}
            </div>
          </div>

          {/* U.PRICE */}
          <div>
            <div style={{ 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              color: '#059669'
            }}>
              {formatCurrency(productData.preco)}
            </div>
          </div>

          {/* BOTÃO +INFO */}
          <div style={{ marginTop: '0.25rem' }}>
            <button
              onClick={() => setShowDetailsModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: '#0175a62a',
                color: '#374151',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                border: '1px solid #0175a6',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              <Eye style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.375rem' }} />
              +info
            </button>
          </div>
        </div>
      </div>

      {/* Modal da imagem */}
      <ProductImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={`https://nyc3.digitaloceanspaces.com/moribr/base-fotos/${productData.referencia}.jpg`}
        productName={productData.nome}
        referencia={productData.referencia}
      />

      {/* Modal de detalhes */}
      <ProductDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        product={product}
      />
    </div>
  );
};