import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface SearchBarProps {
  searchValue: string;
  onSearch: (value: string) => void;
  onAddProduct: () => void;
  onImportSpreadsheet: () => void;
  onExportSpreadsheet: () => void;
  onViewCompact: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  onSearch,
  onAddProduct,
  onImportSpreadsheet,
  onExportSpreadsheet,
  onViewCompact
}) => {
  return (
    <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
      <div style={{ maxWidth: '1216px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Lado esquerdo - Busca */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
              <Search style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
            </div>
            <input
              type="text"
              style={{
                display: 'block',
                width: '20rem',
                paddingLeft: '2.5rem',
                paddingRight: '0.75rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                lineHeight: '1.25',
                backgroundColor: 'white',
                fontSize: '0.875rem'
              }}
              placeholder="Buscar produtos..."
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* Dropdown Referência */}
          <div style={{ position: 'relative' }}>
            <select style={{
              display: 'block',
              width: '12rem',
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
            }}>
              <option>Referência (Crescente)</option>
              <option>Referência (Decrescente)</option>
              <option>Nome (A-Z)</option>
              <option>Nome (Z-A)</option>
              <option>Preço (Menor-Maior)</option>
              <option>Preço (Maior-Menor)</option>
            </select>
            <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', paddingRight: '0.5rem', pointerEvents: 'none' }}>
              <ChevronDown style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
            </div>
          </div>
        </div>

        {/* Lado direito - Botões coloridos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Visualizar Compacto */}
          <button
            onClick={onViewCompact}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4b5563',
              color: 'white',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Visualizar Compacto
          </button>

          {/* Cadastrar Novo Produto */}
          <button
            onClick={onAddProduct}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
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
              backgroundColor: '#16a34a',
              color: 'white',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
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
              backgroundColor: '#9333ea',
              color: 'white',
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
      </div>
    </div>
  );
};
