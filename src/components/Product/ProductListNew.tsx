import React from 'react';
import type { Product } from '../../types/Product';
import { ProductCardNew } from './ProductCardNew';

interface ProductListNewProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onDeactivate: (productId: string) => void;
  onShowAllFields: (productId: string) => void;
}

export const ProductListNew: React.FC<ProductListNewProps> = ({ 
  products, 
  loading, 
  onEdit, 
  onDelete,
  onDeactivate,
  onShowAllFields
}) => {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', width: '100%' }}>
        {[...Array(6)].map((_, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            padding: '1.5rem',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '150px', height: '150px', backgroundColor: '#e5e7eb', borderRadius: '0.5rem' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                  <div style={{ width: '100%', height: '2rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }}></div>
                  <div style={{ width: '100%', height: '2rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }}></div>
                  <div style={{ width: '100%', height: '2rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }}></div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ height: '1rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', width: '40%' }}></div>
                <div style={{ height: '1rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', width: '30%' }}></div>
                <div style={{ height: '2rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', width: '100%' }}></div>
                <div style={{ height: '1rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', width: '25%' }}></div>
                <div style={{ height: '2rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', width: '60%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <svg width="2rem" height="2rem" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9ca3af' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
            Nenhum produto encontrado
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Não há produtos cadastrados ou que correspondam aos filtros aplicados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem',
      width: '100%'
    }}>
      {products.map((product) => (
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