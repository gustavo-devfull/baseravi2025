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
      padding: '1rem'
    }}>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(107, 114, 128, 0.75)',
          transition: 'opacity 0.3s'
        }} 
        onClick={onClose} 
      />

      {/* Modal */}
      <div style={{
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '600px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'hidden',
        transform: 'translateY(0)',
        transition: 'all 0.3s'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
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
                width: '2.5rem',
                height: '2.5rem',
                backgroundColor: '#dbeafe',
                borderRadius: '0.5rem',
                marginRight: '0.75rem'
              }}>
                <Filter style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  color: '#111827',
                  margin: 0
                }}>
                  Filtros Avançados
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Filtre produtos por critérios específicos
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
                padding: '0.25rem',
                borderRadius: '0.25rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#6b7280'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#9ca3af'}
            >
              <X style={{ width: '1.5rem', height: '1.5rem' }} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Busca por texto */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.25rem'
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
                  style={{
                    display: 'block',
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '0.75rem',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="Digite para buscar..."
                />
              </div>
            </div>

            {/* Fabricante */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.25rem'
              }}>
                Fabricante
              </label>
              <select
                value={localFilters.fabrica || ''}
                onChange={(e) => handleInputChange('fabrica', e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  paddingLeft: '0.75rem',
                  paddingRight: '0.75rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  outline: 'none'
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
              <select
                value={localFilters.marca || ''}
                onChange={(e) => handleInputChange('marca', e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  paddingLeft: '0.75rem',
                  paddingRight: '0.75rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  outline: 'none'
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

            {/* Faixa de preço */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Faixa de Preço (RMB)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>Preço mínimo</label>
                  <input
                    type="number"
                    value={localFilters.minPrice || ''}
                    onChange={(e) => handleInputChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    step="0.01"
                    min="0"
                    style={{
                      display: 'block',
                      width: '100%',
                      paddingLeft: '0.75rem',
                      paddingRight: '0.75rem',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      backgroundColor: 'white',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>Preço máximo</label>
                  <input
                    type="number"
                    value={localFilters.maxPrice || ''}
                    onChange={(e) => handleInputChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    step="0.01"
                    min="0"
                    style={{
                      display: 'block',
                      width: '100%',
                      paddingLeft: '0.75rem',
                      paddingRight: '0.75rem',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      backgroundColor: 'white',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#374151'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#6b7280'}
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
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
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'white'}
            >
              Cancelar
            </button>
            <button
              onClick={applyFilters}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#2563eb',
                border: '1px solid transparent',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#2563eb'}
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};