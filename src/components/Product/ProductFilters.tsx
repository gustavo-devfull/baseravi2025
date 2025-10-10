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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg mr-3">
                  <Filter className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Filtros Avançados
                  </h3>
                  <p className="text-sm text-gray-500">
                    Filtre produtos por critérios específicos
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white px-6 py-4">
            <div className="space-y-4">
              {/* Busca por texto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar por nome ou descrição
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={localFilters.search || ''}
                    onChange={(e) => handleInputChange('search', e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Digite para buscar..."
                  />
                </div>
              </div>

              {/* Fabricante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fabricante
                </label>
                <select
                  value={localFilters.fabrica || ''}
                  onChange={(e) => handleInputChange('fabrica', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca
                </label>
                <select
                  value={localFilters.marca || ''}
                  onChange={(e) => handleInputChange('marca', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faixa de Preço (RMB)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Preço mínimo</label>
                    <input
                      type="number"
                      value={localFilters.minPrice || ''}
                      onChange={(e) => handleInputChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                      step="0.01"
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Preço máximo</label>
                    <input
                      type="number"
                      value={localFilters.maxPrice || ''}
                      onChange={(e) => handleInputChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                      step="0.01"
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between">
            <div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Limpar todos os filtros
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancelar
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
