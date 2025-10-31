import React, { useState, useEffect, useCallback } from 'react';
import type { Product, ProductFormData, ProductFilters } from '../../types/Product';
import { ProductService } from '../../services/productService';
import { ProductListNew } from '../Product/ProductListNew';
import { ProductForm } from '../Product/ProductForm';
import { ProductFilters as FiltersComponent } from '../Product/ProductFilters';
import { Layout } from '../Layout/Layout';
import { FirebaseStatus } from '../Status/FirebaseStatus';
import { InitializeFirebase } from '../Setup/InitializeFirebase';
import { FirebasePermissionError } from '../Error/FirebasePermissionError';
import { ImportModal } from '../Import/ImportModal';
import { BulkEditModal } from '../Import/BulkEditModal';
import { AlertCircle } from 'lucide-react';

interface DashboardProps {
  onNavigateToAllProducts?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToAllProducts }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasProductsInDB, setHasProductsInDB] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPermissionError, setShowPermissionError] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortOption, setSortOption] = useState<string>('createdAt-desc');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [importedProducts, setImportedProducts] = useState<ProductFormData[]>([]);

  // Verificar se há produtos no banco de dados
  const checkHasProducts = useCallback(async () => {
    try {
      const hasProducts = await ProductService.hasProducts();
      setHasProductsInDB(hasProducts);
    } catch (error) {
      console.error('Erro ao verificar produtos no banco:', error);
      setHasProductsInDB(false);
    }
  }, []);

  // Carregar produtos
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const productsData = await ProductService.getAllProducts(filters);
      
      // Aplicar ordenação
      const sortedProducts = sortProducts(productsData, sortOption);
      setProducts(sortedProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos';
      setError(errorMessage);
      
      // Verifica se é erro de permissão
      if (errorMessage.includes('Missing or insufficient permissions')) {
        setShowPermissionError(true);
      }
      
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortOption]);

  useEffect(() => {
    loadProducts();
    checkHasProducts();
  }, [loadProducts, checkHasProducts]);

  // Função para ordenar produtos
  const sortProducts = (products: Product[], sortOption: string): Product[] => {
    const sortedProducts = [...products];
    
    switch (sortOption) {
      case 'referencia-asc':
        return sortedProducts.sort((a, b) => String(a.referencia || '').localeCompare(String(b.referencia || '')));
      case 'referencia-desc':
        return sortedProducts.sort((a, b) => String(b.referencia || '').localeCompare(String(a.referencia || '')));
      case 'name-asc':
        return sortedProducts.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
      case 'name-desc':
        return sortedProducts.sort((a, b) => String(b.name || '').localeCompare(String(a.name || '')));
      case 'price-asc':
        return sortedProducts.sort((a, b) => (a.unitPriceRmb || 0) - (b.unitPriceRmb || 0));
      case 'price-desc':
        return sortedProducts.sort((a, b) => (b.unitPriceRmb || 0) - (a.unitPriceRmb || 0));
      case 'createdAt-desc':
        return sortedProducts.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      case 'createdAt-asc':
        return sortedProducts.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });
      default:
        return sortedProducts;
    }
  };

  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption);
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await ProductService.deleteProduct(productId);
        await loadProducts();
      } catch (err) {
        setError('Erro ao excluir produto');
        console.error('Erro ao excluir produto:', err);
      }
    }
  };

  const handleDeactivateProduct = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja desativar este produto?')) {
      try {
        await ProductService.updateProduct(productId, { active: false });
        await loadProducts();
      } catch (error) {
        setError('Erro ao desativar produto');
        console.error('Erro ao desativar produto:', error);
      }
    }
  };

  const handleShowAllFields = (productId: string) => {
    console.log('Mostrar todos os campos do produto:', productId);
    // Implementar modal com todos os campos
  };

  const handleSubmitProduct = async (productData: ProductFormData) => {
    try {
      if (editingProduct) {
        await ProductService.updateProduct(editingProduct.id!, productData);
      } else {
        await ProductService.createProduct(productData);
      }
      await loadProducts();
    } catch {
      throw new Error('Erro ao salvar produto');
    }
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleImportSpreadsheet = () => {
    setShowImportModal(true);
  };

  const handleImportProducts = async (products: ProductFormData[]) => {
    console.log('Dashboard - Produtos recebidos:', products.length);
    console.log('Dashboard - Primeiro produto:', products[0]);
    
    try {
      // Gerar REFs automáticos para produtos que não têm REF
      const productsWithRefs = await ProductService.generateRefsForImportedProducts(products);
      console.log('Dashboard - Produtos com REFs gerados:', productsWithRefs.length);
      
      setImportedProducts(productsWithRefs);
      setShowImportModal(false);
      
      // Pequeno delay para garantir que o estado seja atualizado
      setTimeout(() => {
        console.log('Dashboard - Abrindo modal de edição com produtos:', productsWithRefs.length);
        setShowBulkEditModal(true);
      }, 100);
    } catch (error) {
      console.error('Erro ao gerar REFs automáticos:', error);
      // Em caso de erro, usar produtos originais
      setImportedProducts(products);
      setShowImportModal(false);
      setTimeout(() => {
        setShowBulkEditModal(true);
      }, 100);
    }
  };

  const handleBulkSave = async (products: ProductFormData[]) => {
    try {
      // Salvar todos os produtos
      for (const product of products) {
        await ProductService.createProduct(product);
      }
      
      // Recarregar lista de produtos
      await loadProducts();
      
      setShowBulkEditModal(false);
      setImportedProducts([]);
    } catch (error) {
      console.error('Erro ao salvar produtos em lote:', error);
      throw error;
    }
  };

  // Debug - remover depois
  console.log('Dashboard - Estado atual:', {
    showBulkEditModal,
    importedProductsLength: importedProducts.length,
    importedProducts: importedProducts
  });

  return (
    <>
      <FirebaseStatus />
      {showPermissionError && (
        <FirebasePermissionError />
      )}
      {products.length === 0 && !loading && !showPermissionError && hasProductsInDB === false && (
        <InitializeFirebase />
      )}
      <Layout
        onAddProduct={handleAddProduct}
        onToggleFilters={() => setShowFilters(true)}
        onClearFilters={handleClearFilters}
        onSortChange={handleSortChange}
        onImportSpreadsheet={handleImportSpreadsheet}
        hasActiveFilters={Object.values(filters).some(value => value !== undefined && value !== '')}
        activeFilters={filters}
        onNavigateToAllProducts={onNavigateToAllProducts}
      >
        <div className="space-y-6">
        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Lista de produtos */}
        <ProductListNew
          products={products}
          loading={loading}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onDeactivate={handleDeactivateProduct}
          onShowAllFields={handleShowAllFields}
        />
      </div>

      {/* Modal do formulário de produto */}
      <ProductForm
        product={editingProduct}
        isOpen={showProductForm}
        onClose={() => setShowProductForm(false)}
        onSubmit={handleSubmitProduct}
      />

      {/* Modal de filtros */}
      <FiltersComponent
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Modal de importação */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportProducts}
      />

      {/* Modal de edição em lote */}
      <BulkEditModal
        isOpen={showBulkEditModal}
        onClose={() => setShowBulkEditModal(false)}
        products={importedProducts}
        onSave={handleBulkSave}
        />
      </Layout>

      {/* Modal do formulário de produto */}
      <ProductForm
        product={editingProduct}
        isOpen={showProductForm}
        onClose={() => setShowProductForm(false)}
        onSubmit={handleSubmitProduct}
      />

      {/* Modal de filtros */}
      <FiltersComponent
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Modal de importação */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportProducts}
      />

      {/* Modal de edição em lote */}
      <BulkEditModal
        isOpen={showBulkEditModal}
        onClose={() => setShowBulkEditModal(false)}
        products={importedProducts}
        onSave={handleBulkSave}
      />
    </>
  );
};