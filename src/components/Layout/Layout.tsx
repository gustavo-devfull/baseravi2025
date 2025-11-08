import React from 'react';
import { MainHeader } from './MainHeader';
import { Header } from './Header';
import { SearchBar } from './SearchBar';

interface LayoutProps {
  children: React.ReactNode;
  onAddProduct: () => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onSortChange: (sortOption: string) => void;
  onImportSpreadsheet: () => void;
  hasActiveFilters?: boolean;
  activeFilters?: {
    search?: string;
    fabrica?: string;
    marca?: string;
  };
  onNavigateToAllProducts?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onAddProduct, 
  onToggleFilters,
  onClearFilters,
  onSortChange,
  onImportSpreadsheet,
  hasActiveFilters = false,
  activeFilters = {},
  onNavigateToAllProducts
}) => {
  const handleExportSpreadsheet = () => {
    console.log('Exportar planilha');
  };


  return (
    <div className="min-h-screen bg-white">
      {/* MainHeader - Navegação entre sistemas */}
      <MainHeader />
      
      {/* Header */}
      <Header onNavigateToAllProducts={onNavigateToAllProducts} />

      {/* Barra de busca e filtros */}
      <SearchBar
        onAddProduct={onAddProduct}
        onImportSpreadsheet={onImportSpreadsheet}
        onExportSpreadsheet={handleExportSpreadsheet}
        onToggleFilters={onToggleFilters}
        onClearFilters={onClearFilters}
        onSortChange={onSortChange}
        hasActiveFilters={hasActiveFilters}
        activeFilters={activeFilters}
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