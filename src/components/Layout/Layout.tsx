import React from 'react';
import { Header } from './Header';
import { SearchBar } from './SearchBar';

interface LayoutProps {
  children: React.ReactNode;
  onAddProduct: () => void;
  onSearch: (search: string) => void;
  searchValue: string;
  onToggleFilters: () => void;
  onImportSpreadsheet: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onAddProduct, 
  onSearch, 
  searchValue,
  onImportSpreadsheet
}) => {
  const handleExportSpreadsheet = () => {
    console.log('Exportar planilha');
  };

  const handleViewCompact = () => {
    console.log('Visualizar compacto');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Barra de busca e filtros */}
      <SearchBar
        searchValue={searchValue}
        onSearch={onSearch}
        onAddProduct={onAddProduct}
        onImportSpreadsheet={onImportSpreadsheet}
        onExportSpreadsheet={handleExportSpreadsheet}
        onViewCompact={handleViewCompact}
      />

      {/* Conteúdo principal */}
      <main style={{ padding: '1.5rem' }}>
        <div style={{ maxWidth: '1216px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};