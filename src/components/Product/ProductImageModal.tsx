import React from 'react';
import { X } from 'lucide-react';

interface ProductImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  productName: string;
  referencia: string;
}

export const ProductImageModal: React.FC<ProductImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  productName,
  referencia
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f9fafb'
        }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
              {productName}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
              Referência: {referencia}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            <X style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
        </div>

        {/* Image */}
        <div style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white'
        }}>
          <img
            src={imageUrl}
            alt={`Imagem do produto ${referencia}`}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              objectFit: 'contain',
              borderRadius: '0.25rem'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const errorDiv = target.nextElementSibling as HTMLElement;
              if (errorDiv) {
                errorDiv.style.display = 'flex';
              }
            }}
          />
          
          {/* Error fallback */}
          <div style={{
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Imagem não encontrada
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
              A imagem para a referência {referencia} não está disponível.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
