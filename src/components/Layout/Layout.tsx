import React from 'react';
import { MainHeader } from './MainHeader';
import { Header } from './Header';
import { SearchBar } from './SearchBar';

import type { Product } from '../../types/Product';

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
  products?: Product[];
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
  onNavigateToAllProducts,
  products = []
}) => {
  const handleExportSpreadsheet = async () => {
    if (products.length === 0) {
      alert('Não há produtos para exportar');
      return;
    }

    try {
      const { ExcelExportService } = await import('../../services/excelExportService');
      await ExcelExportService.exportProductsToExcel(products);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar planilha. Verifique o console para mais detalhes.');
    }
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