import React from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';

interface SearchBarProps {
  onAddProduct: () => void;
  onImportSpreadsheet: () => void;
  onExportSpreadsheet: () => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onSortChange: (sortOption: string) => void;
  hasActiveFilters?: boolean;
  activeFilters?: {
    search?: string;
    fabrica?: string;
    marca?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onAddProduct,
  onImportSpreadsheet,
  onExportSpreadsheet,
  onToggleFilters,
  onClearFilters,
  onSortChange,
  hasActiveFilters = false,
  activeFilters = {}
}) => {
  // Função para gerar texto dos filtros ativos
  const getActiveFiltersText = () => {
    const filters = [];
    
    if (activeFilters.search) {
      filters.push(`Busca: "${activeFilters.search}"`);
    }
    if (activeFilters.fabrica) {
      filters.push(`Fabricante: ${activeFilters.fabrica}`);
    }
    if (activeFilters.marca) {
      filters.push(`Marca: ${activeFilters.marca}`);
    }
    if (activeFilters.minPrice || activeFilters.maxPrice) {
      const minPrice = activeFilters.minPrice ? `CN¥ ${activeFilters.minPrice}` : 'CN¥ 0';
      const maxPrice = activeFilters.maxPrice ? `CN¥ ${activeFilters.maxPrice}` : 'CN¥ ∞';
      filters.push(`Preço: ${minPrice} - ${maxPrice}`);
    }
    
    return filters.join(' • ');
  };

  return (
    <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
      <div style={{ maxWidth: '1216px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Lado esquerdo - Controles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Dropdown Ordenação */}
          <div style={{ position: 'relative' }}>
            <select 
              style={{
                display: 'block',
                width: '16rem',
                paddingLeft: '0.75rem',
                paddingRight: '2.5rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                lineHeight: '1.25',
                backgroundColor: 'white',
                fontSize: '0.875rem',
                appearance: 'none'
              }}
              onChange={(e) => onSortChange(e.target.value)}
              defaultValue="referencia-asc"
            >
              <option value="referencia-asc">Referência (Crescente)</option>
              <option value="referencia-desc">Referência (Decrescente)</option>
              <option value="name-asc">Nome (A-Z)</option>
              <option value="name-desc">Nome (Z-A)</option>
              <option value="price-asc">Preço (Menor-Maior)</option>
              <option value="price-desc">Preço (Maior-Menor)</option>
              <option value="createdAt-desc">Mais Recentes</option>
              <option value="createdAt-asc">Mais Antigos</option>
            </select>
            <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', paddingRight: '0.5rem', pointerEvents: 'none' }}>
              <ChevronDown style={{ height: '1.25rem', width: '1.25rem', color: '#0175a6' }} />
            </div>
          </div>

          {/* Botão de Filtros */}
          <button
            onClick={onToggleFilters}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: hasActiveFilters ? '#0175a6' : '#6b7280',
              color: 'white',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Filter style={{ height: '1rem', width: '1rem' }} />
            {hasActiveFilters ? 'Filtros Ativos' : 'Filtros'}
          </button>

          {/* Botão Limpar Filtros */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <X style={{ height: '1rem', width: '1rem' }} />
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Lado direito - Botões coloridos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

          {/* Cadastrar Novo Produto */}
          <button
            onClick={onAddProduct}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0175a6bf',
              color: 'white',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Cadastrar Novo Produto
          </button>

          {/* Importar Planilha */}
          <button
            onClick={onImportSpreadsheet}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0175a6',
              color: 'white',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Importar Planilha
          </button>

          {/* Exportar Planilha */}
          <button
            onClick={onExportSpreadsheet}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0175a62a',
              color: '#0175a6',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Exportar Planilha
          </button>
        </div>
        </div>
        
        {/* Aviso de filtros ativos */}
        {hasActiveFilters && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.5rem 0.75rem',
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Filter style={{ height: '1rem', width: '1rem', flexShrink: 0 }} />
            <span style={{ fontWeight: '500' }}>Filtros ativos:</span>
            <span>{getActiveFiltersText()}</span>
          </div>
        )}
      </div>
    </div>
  );
};
