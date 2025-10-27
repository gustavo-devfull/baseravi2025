import React, { useState, useEffect } from 'react';
import type { ProductFilters as FilterType } from '../../types/Product';
import { ProductService } from '../../services/productService';
import { X, Filter, Search } from 'lucide-react';

interface ProductFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterType>(filters);
  const [fabricas, setFabricas] = useState<string[]>([]);
  const [marcas, setMarcas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (isOpen) {
      loadFilterOptions();
    }
  }, [isOpen]);

  const loadFilterOptions = async () => {
    setLoading(true);
    try {
      const [fabricasData, marcasData] = await Promise.all([
        ProductService.getUniqueFabricas(),
        ProductService.getUniqueMarcas(),
      ]);
      setFabricas(fabricasData);
      setMarcas(marcasData);
    } catch (error) {
      console.error('Erro ao carregar opções de filtro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FilterType, value: string | number | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const emptyFilters: FilterType = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyFilters();
    }
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== ''
  );

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
      overflowY: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(17, 24, 39, 0.6)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 0.3s'
        }}
        onClick={onClose} 
      />

      {/* Modal */}
      <div style={{
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'hidden',
        transform: 'translateY(0)',
        transition: 'all 0.3s',
        animation: 'slideInFromBottom 0.3s ease-out',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(to right, #eff6ff, #e0e7ff)',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(to bottom right, #3b82f6, #4f46e5)',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                marginRight: '1rem'
              }}>
                <Filter style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  Filtros Avançados
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0,
                  marginTop: '0.25rem',
                  display: window.innerWidth >= 640 ? 'block' : 'none'
                }}>
                  Filtre produtos por critérios específicos
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem',
                color: '#9ca3af',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.color = '#6b7280';
                (e.target as HTMLButtonElement).style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.color = '#9ca3af';
                (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              <X style={{ width: '1.5rem', height: '1.5rem' }} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: 'white',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '100%' }}>
            {/* Busca por texto */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Buscar por nome ou descrição
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  paddingLeft: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}>
                  <Search style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                </div>
                <input
                  type="text"
                  value={localFilters.search || ''}
                  onChange={(e) => handleInputChange('search', e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{
                    display: 'block',
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '1rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.75rem',
                    backgroundColor: 'white',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Digite para buscar produtos... (Enter para aplicar)"
                />
              </div>
            </div>

            {/* Fabricante */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Fabricante
              </label>
              <select
                value={localFilters.fabrica || ''}
                onChange={(e) => handleInputChange('fabrica', e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  paddingLeft: '1rem',
                  paddingRight: '2.5rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Todos os fabricantes</option>
                {loading ? (
                  <option disabled>Carregando...</option>
                ) : (
                  fabricas.map((fabrica) => (
                    <option key={fabrica} value={fabrica}>
                      {fabrica}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Marca */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Marca
              </label>
              <select
                value={localFilters.marca || ''}
                onChange={(e) => handleInputChange('marca', e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  paddingLeft: '1rem',
                  paddingRight: '2.5rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Todas as marcas</option>
                {loading ? (
                  <option disabled>Carregando...</option>
                ) : (
                  marcas.map((marca) => (
                    <option key={marca} value={marca}>
                      {marca}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: 'linear-gradient(to right, #f9fafb, #eff6ff)',
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth >= 640 ? 'row' : 'column',
            justifyContent: 'space-between',
            alignItems: window.innerWidth >= 640 ? 'center' : 'flex-start',
            gap: '1rem'
          }}>
            <div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.color = '#374151';
                    (e.target as HTMLButtonElement).style.backgroundColor = 'white';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.color = '#6b7280';
                    (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Limpar todos os filtros
                </button>
              )}
            </div>
            <div style={{
              display: 'flex',
              flexDirection: window.innerWidth >= 640 ? 'row' : 'column',
              gap: '0.75rem',
              width: window.innerWidth >= 640 ? 'auto' : '100%'
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  width: window.innerWidth >= 640 ? 'auto' : '100%'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb';
                  (e.target as HTMLButtonElement).style.borderColor = '#9ca3af';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'white';
                  (e.target as HTMLButtonElement).style.borderColor = '#d1d5db';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={applyFilters}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'white',
                  background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                  border: '1px solid transparent',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  width: window.innerWidth >= 640 ? 'auto' : '100%'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'linear-gradient(to right, #1d4ed8, #3730a3)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'linear-gradient(to right, #2563eb, #4f46e5)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};