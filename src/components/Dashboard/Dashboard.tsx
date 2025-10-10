import React, { useState, useEffect } from 'react';
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

export const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPermissionError, setShowPermissionError] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [importedProducts, setImportedProducts] = useState<ProductFormData[]>([]);

  // Carregar produtos
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchFilters = searchValue ? { ...filters, search: searchValue } : filters;
      const productsData = await ProductService.getAllProducts(searchFilters);
      setProducts(productsData);
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
  };

  useEffect(() => {
    loadProducts();
  }, [filters]);

  // Debounce para busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue !== (filters.search || '')) {
        loadProducts();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

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
        // Implementar lógica de desativação
        console.log('Desativar produto:', productId);
      } catch (err) {
        setError('Erro ao desativar produto');
        console.error('Erro ao desativar produto:', err);
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
    } catch (err) {
      throw new Error('Erro ao salvar produto');
    }
  };

  const handleSearch = (search: string) => {
    setSearchValue(search);
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleImportSpreadsheet = () => {
    setShowImportModal(true);
  };

  const handleImportProducts = (products: ProductFormData[]) => {
    setImportedProducts(products);
    setShowImportModal(false);
    setShowBulkEditModal(true);
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

  return (
    <>
      <FirebaseStatus />
      {showPermissionError && (
        <FirebasePermissionError />
      )}
      {products.length === 0 && !loading && !showPermissionError && (
        <InitializeFirebase />
      )}
      <Layout
        onAddProduct={handleAddProduct}
        onSearch={handleSearch}
        searchValue={searchValue}
        onToggleFilters={() => setShowFilters(true)}
        onImportSpreadsheet={handleImportSpreadsheet}
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
    </>
  );
};