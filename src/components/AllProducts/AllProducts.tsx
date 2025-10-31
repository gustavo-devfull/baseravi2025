import React, { useState, useEffect } from 'react';
import type { Product, ProductFormData } from '../../types/Product';
import { ProductService } from '../../services/productService';
import { Header } from '../Layout/Header';
import { ProductForm } from '../Product/ProductForm';
import { ArrowLeft, Download, ChevronUp, ChevronDown, Trash2, Power, PowerOff, Edit } from 'lucide-react';

type SortConfig = {
  column: string;
  direction: 'asc' | 'desc';
};

export const AllProducts: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [editingCell, setEditingCell] = useState<{ productId: string; column: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, columnFilters, sortConfig]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await ProductService.getAllProducts({});
      setProducts(productsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos';
      setError(errorMessage);
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Aplicar filtros
    Object.keys(columnFilters).forEach((columnKey) => {
      const filterValue = columnFilters[columnKey]?.toLowerCase().trim();
      if (!filterValue) return;

      filtered = filtered.filter((product) => {
        const value = (product as any)[columnKey];
        if (value === undefined || value === null) return false;
        
        const stringValue = value.toString().toLowerCase();
        return stringValue.includes(filterValue);
      });
    });

    // Aplicar ordenação
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = (a as any)[sortConfig.column];
        const bValue = (b as any)[sortConfig.column];

        // Tratar valores nulos/undefined
        if (aValue === undefined || aValue === null) return sortConfig.direction === 'asc' ? 1 : -1;
        if (bValue === undefined || bValue === null) return sortConfig.direction === 'asc' ? -1 : 1;

        // Comparação numérica
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        // Comparação de strings
        const aStr = aValue.toString().toLowerCase();
        const bStr = bValue.toString().toLowerCase();
        if (sortConfig.direction === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    setFilteredProducts(filtered);
  };

  const handleSort = (columnKey: string) => {
    if (sortConfig?.column === columnKey) {
      if (sortConfig.direction === 'asc') {
        setSortConfig({ column: columnKey, direction: 'desc' });
      } else {
        setSortConfig(null);
      }
    } else {
      setSortConfig({ column: columnKey, direction: 'asc' });
    }
  };

  const handleColumnFilterChange = (columnKey: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnKey]: value,
    }));
  };

  const clearAllFilters = () => {
    setColumnFilters({});
    setSortConfig(null);
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id!)));
    }
  };

  const handleEditStart = (productId: string, column: string, currentValue: any) => {
    setEditingCell({ productId, column });
    setEditValue(currentValue !== undefined && currentValue !== null ? currentValue.toString() : '');
  };

  const handleEditSave = async (productId: string, column: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      let value: any = editValue.trim();
      
      // Converter para o tipo correto
      const columnDef = allColumns.find(c => c.key === column);
      if (columnDef?.type === 'number') {
        value = value === '' ? 0 : parseFloat(value);
        if (isNaN(value)) return;
      }

      await ProductService.updateProduct(productId, { [column]: value });
      await loadProducts();
      setEditingCell(null);
      setEditValue('');
    } catch (err) {
      console.error('Erro ao salvar edição:', err);
      alert('Erro ao salvar alteração');
    }
  };

  const handleEditCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;
    if (!window.confirm(`Tem certeza que deseja excluir ${selectedProducts.size} produto(s)?`)) return;

    try {
      for (const productId of selectedProducts) {
        await ProductService.deleteProduct(productId);
      }
      setSelectedProducts(new Set());
      await loadProducts();
    } catch (err) {
      console.error('Erro ao excluir produtos:', err);
      alert('Erro ao excluir produtos');
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedProducts.size === 0) return;
    if (!window.confirm(`Tem certeza que deseja desativar ${selectedProducts.size} produto(s)?`)) return;

    try {
      for (const productId of selectedProducts) {
        await ProductService.updateProduct(productId, { active: false });
      }
      setSelectedProducts(new Set());
      await loadProducts();
    } catch (err) {
      console.error('Erro ao desativar produtos:', err);
      alert('Erro ao desativar produtos');
    }
  };

  const handleBulkActivate = async () => {
    if (selectedProducts.size === 0) return;
    if (!window.confirm(`Tem certeza que deseja ativar ${selectedProducts.size} produto(s)?`)) return;

    try {
      for (const productId of selectedProducts) {
        await ProductService.updateProduct(productId, { active: true });
      }
      setSelectedProducts(new Set());
      await loadProducts();
    } catch (err) {
      console.error('Erro ao ativar produtos:', err);
      alert('Erro ao ativar produtos');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSubmitProduct = async (productData: ProductFormData) => {
    try {
      if (editingProduct) {
        await ProductService.updateProduct(editingProduct.id!, productData);
        await loadProducts();
        setShowProductForm(false);
        setEditingProduct(undefined);
      }
    } catch {
      throw new Error('Erro ao salvar produto');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatCurrencyUSD = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const exportToCSV = () => {
    if (filteredProducts.length === 0) return;

    const headers = [
      'ID',
      'Imagem',
      'Referência',
      'Nome RAVI Profit',
      'Nome',
      'Descrição',
      'Fabricante',
      'Marca',
      'Item No',
      'Linha Cotações',
      'Preço Unitário RMB',
      'Valor Invoice USD',
      'MOQ',
      'Unidades por CTN',
      'Qt Min Venda',
      'Unidade',
      'Comprimento (L)',
      'Largura (W)',
      'Altura (H)',
      'CBM',
      'Peso Bruto (GW)',
      'Peso Líquido (NW)',
      'Peso Unitário',
      'Código Ravi',
      'EAN',
      'DUN',
      'NCM',
      'CEST',
      'Nome Invoice EN',
      'Nome DI NB',
      'Remark',
      'Observações',
      'Obs Pedido',
      'Ativo',
      'Data Criação',
      'Data Atualização'
    ];

    const rows = filteredProducts.map(product => [
      product.id || '',
      product.referencia ? `https://nyc3.digitaloceanspaces.com/moribr/base-fotos/${product.referencia}.jpg` : '',
      product.referencia || '',
      product.nomeRaviProfit || '',
      product.name || '',
      product.description || '',
      product.fabrica || '',
      product.marca || '',
      product.itemNo || '',
      product.linhaCotacoes || '',
      product.unitPriceRmb?.toString() || '0',
      product.valorInvoiceUsd?.toString() || '0',
      product.moq?.toString() || '0',
      product.unitCtn?.toString() || '0',
      product.qtMinVenda?.toString() || '0',
      product.unit || '',
      product.l?.toString() || '0',
      product.w?.toString() || '0',
      product.h?.toString() || '0',
      product.cbm?.toString() || '0',
      product.gw?.toString() || '0',
      product.nw?.toString() || '0',
      product.pesoUnitario?.toString() || '0',
      product.codRavi || '',
      product.ean || '',
      product.dun || '',
      product.ncm || '',
      product.cest || '',
      product.nomeInvoiceEn || '',
      product.nomeDiNb || '',
      product.remark || '',
      product.obs || '',
      product.obsPedido || '',
      product.active !== false ? 'Sim' : 'Não',
      formatDate(product.createdAt),
      formatDate(product.updatedAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `todos-os-produtos-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allColumns = [
    { key: 'imagem', label: 'Imagem', width: '100px', type: 'image', editable: false },
    { key: 'referencia', label: 'Referência', width: '120px', type: 'string', editable: true },
    { key: 'nomeRaviProfit', label: 'Nome RAVI Profit', width: '200px', type: 'string', editable: true },
    { key: 'name', label: 'Nome', width: '200px', type: 'string', editable: true },
    { key: 'description', label: 'Descrição', width: '200px', type: 'string', editable: true },
    { key: 'fabrica', label: 'Fabricante', width: '150px', type: 'string', editable: true },
    { key: 'marca', label: 'Marca', width: '120px', type: 'string', editable: true },
    { key: 'itemNo', label: 'Item No', width: '120px', type: 'string', editable: true },
    { key: 'linhaCotacoes', label: 'Linha Cotações', width: '150px', type: 'string', editable: true },
    { key: 'unitPriceRmb', label: 'Preço Unitário RMB', width: '150px', type: 'number', editable: true, format: formatCurrency },
    { key: 'valorInvoiceUsd', label: 'Valor Invoice USD', width: '150px', type: 'number', editable: true, format: formatCurrencyUSD },
    { key: 'moq', label: 'MOQ', width: '80px', type: 'number', editable: true },
    { key: 'unitCtn', label: 'Unidades por CTN', width: '130px', type: 'number', editable: true },
    { key: 'qtMinVenda', label: 'Qt Min Venda', width: '120px', type: 'number', editable: true },
    { key: 'unit', label: 'Unidade', width: '100px', type: 'string', editable: true },
    { key: 'l', label: 'Comprimento (L)', width: '140px', type: 'number', editable: true },
    { key: 'w', label: 'Largura (W)', width: '120px', type: 'number', editable: true },
    { key: 'h', label: 'Altura (H)', width: '120px', type: 'number', editable: true },
    { key: 'cbm', label: 'CBM', width: '100px', type: 'number', editable: true },
    { key: 'gw', label: 'Peso Bruto (GW)', width: '130px', type: 'number', editable: true },
    { key: 'nw', label: 'Peso Líquido (NW)', width: '140px', type: 'number', editable: true },
    { key: 'pesoUnitario', label: 'Peso Unitário', width: '130px', type: 'number', editable: true },
    { key: 'codRavi', label: 'Código Ravi', width: '130px', type: 'string', editable: true },
    { key: 'ean', label: 'EAN', width: '150px', type: 'string', editable: true },
    { key: 'dun', label: 'DUN', width: '150px', type: 'string', editable: true },
    { key: 'ncm', label: 'NCM', width: '120px', type: 'string', editable: true },
    { key: 'cest', label: 'CEST', width: '120px', type: 'string', editable: true },
    { key: 'nomeInvoiceEn', label: 'Nome Invoice EN', width: '200px', type: 'string', editable: true },
    { key: 'nomeDiNb', label: 'Nome DI NB', width: '200px', type: 'string', editable: true },
    { key: 'remark', label: 'Remark', width: '200px', type: 'string', editable: true },
    { key: 'obs', label: 'Observações', width: '200px', type: 'string', editable: true },
    { key: 'obsPedido', label: 'Obs Pedido', width: '200px', type: 'string', editable: true },
    { key: 'createdAt', label: 'Data Criação', width: '130px', type: 'date', editable: false, format: formatDate },
    { key: 'updatedAt', label: 'Data Atualização', width: '150px', type: 'date', editable: false, format: formatDate },
  ];

  const hasActiveFilters = Object.values(columnFilters).some(filter => filter.trim() !== '');
  const allSelected = filteredProducts.length > 0 && selectedProducts.size === filteredProducts.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main style={{ padding: '1.5rem' }}>
          <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Carregando produtos...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main style={{ padding: '1.5rem' }}>
          <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ fontSize: '1.125rem', color: '#dc2626' }}>Erro: {error}</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main style={{ padding: '1.5rem' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          <div style={{ padding: '1.5rem 0' }}>
            {/* Header da página */}
            <div style={{ 
              display: 'flex', 
              flexDirection: window.innerWidth < 768 ? 'column' : 'row',
              justifyContent: 'space-between', 
              alignItems: window.innerWidth < 768 ? 'flex-start' : 'center',
              gap: window.innerWidth < 768 ? '1rem' : '0',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={onBack}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#0175a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
                  {window.innerWidth >= 768 && 'Voltar'}
                </button>
                <h1 style={{ fontSize: window.innerWidth < 768 ? '1.25rem' : '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Todos os Produtos
                </h1>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  ({filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'})
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                alignItems: 'center', 
                flexWrap: 'wrap',
                width: window.innerWidth < 768 ? '100%' : 'auto'
              }}>
                {selectedProducts.size > 0 && (
                  <>
                    <button
                      onClick={handleBulkActivate}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem',
                        fontWeight: '500',
                        flex: window.innerWidth < 768 ? '1' : 'auto',
                        justifyContent: 'center',
                        minWidth: window.innerWidth < 768 ? '100px' : 'auto'
                      }}
                    >
                      <Power style={{ width: '0.875rem', height: '0.875rem' }} />
                      {window.innerWidth >= 768 && <>Ativar ({selectedProducts.size})</>}
                      {window.innerWidth < 768 && `Ativar`}
                    </button>
                    <button
                      onClick={handleBulkDeactivate}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem',
                        fontWeight: '500',
                        flex: window.innerWidth < 768 ? '1' : 'auto',
                        justifyContent: 'center',
                        minWidth: window.innerWidth < 768 ? '100px' : 'auto'
                      }}
                    >
                      <PowerOff style={{ width: '0.875rem', height: '0.875rem' }} />
                      {window.innerWidth >= 768 && <>Desativar ({selectedProducts.size})</>}
                      {window.innerWidth < 768 && `Desativar`}
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem',
                        fontWeight: '500',
                        flex: window.innerWidth < 768 ? '1' : 'auto',
                        justifyContent: 'center',
                        minWidth: window.innerWidth < 768 ? '100px' : 'auto'
                      }}
                    >
                      <Trash2 style={{ width: '0.875rem', height: '0.875rem' }} />
                      {window.innerWidth >= 768 && <>Excluir ({selectedProducts.size})</>}
                      {window.innerWidth < 768 && `Excluir`}
                    </button>
                  </>
                )}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem',
                      fontWeight: '500',
                      flex: window.innerWidth < 768 ? '1' : 'auto'
                    }}
                  >
                    Limpar Filtros
                  </button>
                )}
                <button
                  onClick={exportToCSV}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem',
                    fontWeight: '500',
                    flex: window.innerWidth < 768 ? '1' : 'auto',
                    justifyContent: 'center',
                    minWidth: window.innerWidth < 768 ? '100px' : 'auto'
                  }}
                >
                  <Download style={{ width: '0.875rem', height: '0.875rem' }} />
                  {window.innerWidth >= 768 && 'Exportar CSV'}
                  {window.innerWidth < 768 && 'Exportar'}
                </button>
              </div>
            </div>

            {/* Tabela Desktop */}
            <div style={{
              display: window.innerWidth >= 768 ? 'block' : 'none',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              overflow: 'auto',
              maxHeight: 'calc(100vh - 300px)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '100%' }}>
                <thead style={{ 
                  backgroundColor: '#f9fafb',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10
                }}>
                  {/* Filtros */}
                  <tr>
                    <th style={{ padding: '0.25rem', borderBottom: '1px solid #e5e7eb', width: '50px' }}>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        style={{ cursor: 'pointer' }}
                      />
                    </th>
                    {allColumns.map((column) => (
                      <th
                        key={`filter-${column.key}`}
                        style={{
                          padding: '0.25rem',
                          textAlign: 'left',
                          borderBottom: '1px solid #e5e7eb'
                        }}
                      >
                        {column.type !== 'image' && (
                          <input
                            type="text"
                            placeholder={`Filtrar ${column.label}...`}
                            value={columnFilters[column.key] || ''}
                            onChange={(e) => handleColumnFilterChange(column.key, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.5rem',
                              fontSize: '0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.25rem',
                              outline: 'none'
                            }}
                            onFocus={(e) => {
                              (e.target as HTMLInputElement).style.borderColor = '#0175a6';
                            }}
                            onBlur={(e) => {
                              (e.target as HTMLInputElement).style.borderColor = '#d1d5db';
                            }}
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                  {/* Headers */}
                  <tr>
                    <th style={{
                      padding: '0.75rem',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#0175a6',
                      textTransform: 'uppercase',
                      borderBottom: '2px solid #e5e7eb',
                      width: '50px'
                    }}>
                      Sel.
                    </th>
                    {allColumns.map((column) => (
                      <th
                        key={column.key}
                        onClick={() => column.type !== 'image' && handleSort(column.key)}
                        style={{
                          padding: '0.75rem',
                          textAlign: 'left',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#0175a6',
                          textTransform: 'uppercase',
                          borderBottom: '2px solid #e5e7eb',
                          whiteSpace: 'nowrap',
                          minWidth: column.width,
                          cursor: column.type !== 'image' ? 'pointer' : 'default',
                          userSelect: 'none'
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{column.label}</span>
                          {column.type !== 'image' && (
                            <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.1rem', lineHeight: '0.5' }}>
                              {sortConfig?.column === column.key && sortConfig.direction === 'asc' ? (
                                <ChevronUp style={{ width: '0.75rem', height: '0.75rem' }} />
                              ) : sortConfig?.column === column.key && sortConfig.direction === 'desc' ? (
                                <ChevronDown style={{ width: '0.75rem', height: '0.75rem' }} />
                              ) : (
                                <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.1rem', opacity: 0.3, lineHeight: '0.5' }}>
                                  <ChevronUp style={{ width: '0.75rem', height: '0.75rem' }} />
                                  <ChevronDown style={{ width: '0.75rem', height: '0.75rem', marginTop: '-0.25rem' }} />
                                </span>
                              )}
                            </span>
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={allColumns.length + 1} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                        {hasActiveFilters ? 'Nenhum produto encontrado com os filtros aplicados' : 'Nenhum produto encontrado'}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const isActive = product.active !== false;
                      const isSelected = selectedProducts.has(product.id!);
                      
                      return (
                        <tr
                          key={product.id}
                          style={{
                            borderBottom: '1px solid #e5e7eb',
                            transition: 'background-color 0.2s',
                            position: 'relative',
                            opacity: isActive ? 1 : 0.5
                          }}
                          onMouseEnter={(e) => {
                            if (isActive) {
                              (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
                          }}
                        >
                          {/* Overlay para produtos desativados */}
                          {!isActive && (
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              pointerEvents: 'none',
                              zIndex: 1
                            }} />
                          )}
                          
                          {/* Checkbox de seleção */}
                          <td style={{
                            padding: '0.75rem',
                            textAlign: 'center',
                            borderBottom: '1px solid #f3f4f6',
                            position: 'relative',
                            zIndex: 2
                          }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectProduct(product.id!)}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>

                          {allColumns.map((column) => {
                            if (column.type === 'image') {
                              const imageUrl = product.referencia 
                                ? `https://nyc3.digitaloceanspaces.com/moribr/base-fotos/${product.referencia}.jpg`
                                : null;
                              
                              return (
                                <td
                                  key={column.key}
                                  style={{
                                    padding: '0.5rem',
                                    textAlign: 'center',
                                    borderBottom: '1px solid #f3f4f6',
                                    position: 'relative',
                                    zIndex: 2
                                  }}
                                >
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt={`Imagem ${product.referencia}`}
                                      style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'contain',
                                        borderRadius: '0.25rem',
                                        border: '1px solid #e5e7eb'
                                      }}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div style={{
                                      width: '60px',
                                      height: '60px',
                                      backgroundColor: '#f3f4f6',
                                      borderRadius: '0.25rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.75rem',
                                      color: '#9ca3af',
                                      margin: '0 auto'
                                    }}>
                                      N/A
                                    </div>
                                  )}
                                </td>
                              );
                            }

                            const isEditing = editingCell?.productId === product.id && editingCell?.column === column.key;
                            const value = (product as any)[column.key];
                            const displayValue = column.format 
                              ? column.format(value) 
                              : value !== undefined && value !== null 
                                ? value.toString() 
                                : 'N/A';

                            return (
                              <td
                                key={column.key}
                                onClick={() => column.editable && !isEditing && handleEditStart(product.id!, column.key, value)}
                                style={{
                                  padding: '0.75rem',
                                  fontSize: '0.875rem',
                                  color: 'rgba(0, 0, 0, 0.7)',
                                  borderBottom: '1px solid #f3f4f6',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: column.width,
                                  cursor: column.editable ? 'pointer' : 'default',
                                  position: 'relative',
                                  zIndex: 2,
                                  backgroundColor: isEditing ? '#fef3c7' : 'transparent'
                                }}
                                title={isEditing ? '' : displayValue}
                              >
                                {isEditing ? (
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                      type={column.type === 'number' ? 'number' : 'text'}
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      onBlur={() => handleEditSave(product.id!, column.key)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleEditSave(product.id!, column.key);
                                        } else if (e.key === 'Escape') {
                                          handleEditCancel();
                                        }
                                      }}
                                      autoFocus
                                      style={{
                                        width: '100%',
                                        padding: '0.25rem',
                                        border: '1px solid #0175a6',
                                        borderRadius: '0.25rem',
                                        fontSize: '0.875rem',
                                        outline: 'none'
                                      }}
                                    />
                                  </div>
                                ) : (
                                  displayValue
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards Mobile */}
            <div style={{
              display: window.innerWidth < 768 ? 'flex' : 'none',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Filtros e ordenação mobile */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer', width: '1.25rem', height: '1.25rem' }}
                  />
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                    Selecionar Todos
                  </span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem'
                }}>
                  {['referencia', 'nomeRaviProfit', 'fabrica', 'marca'].map((key) => {
                    const column = allColumns.find(c => c.key === key);
                    if (!column) return null;
                    return (
                      <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#0175a6' }}>
                          {column.label}
                        </label>
                        <input
                          type="text"
                          placeholder={`Filtrar...`}
                          value={columnFilters[key] || ''}
                          onChange={(e) => handleColumnFilterChange(key, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            fontSize: '0.875rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            outline: 'none'
                          }}
                          onFocus={(e) => {
                            (e.target as HTMLInputElement).style.borderColor = '#0175a6';
                          }}
                          onBlur={(e) => {
                            (e.target as HTMLInputElement).style.borderColor = '#d1d5db';
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lista de produtos mobile */}
              {filteredProducts.length === 0 ? (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  {hasActiveFilters ? 'Nenhum produto encontrado com os filtros aplicados' : 'Nenhum produto encontrado'}
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const isActive = product.active !== false;
                  const isSelected = selectedProducts.has(product.id!);
                  
                  return (
                    <div
                      key={product.id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        padding: '1rem',
                        position: 'relative',
                        opacity: isActive ? 1 : 0.5
                      }}
                    >
                      {/* Overlay para produtos desativados */}
                      {!isActive && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: '0.5rem',
                          pointerEvents: 'none',
                          zIndex: 1
                        }} />
                      )}

                      {/* Header do card */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.75rem', 
                        marginBottom: '0.75rem',
                        position: 'relative',
                        zIndex: 2
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectProduct(product.id!)}
                            style={{ cursor: 'pointer', width: '1.25rem', height: '1.25rem' }}
                          />
                          <button
                            onClick={() => handleEditProduct(product)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0.375rem',
                              backgroundColor: '#0175a6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              width: '1.75rem',
                              height: '1.75rem'
                            }}
                          >
                            <Edit style={{ width: '0.875rem', height: '0.875rem' }} />
                          </button>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            {product.referencia && (
                              <img
                                src={`https://nyc3.digitaloceanspaces.com/moribr/base-fotos/${product.referencia}.jpg`}
                                alt={`Imagem ${product.referencia}`}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'contain',
                                  borderRadius: '0.375rem',
                                  border: '1px solid #e5e7eb'
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ 
                                fontSize: '1rem', 
                                fontWeight: '600', 
                                color: '#111827',
                                marginBottom: '0.25rem'
                              }}>
                                {product.referencia || 'N/A'}
                              </div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                {product.nomeRaviProfit || product.name || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Campos principais */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        position: 'relative',
                        zIndex: 2
                      }}>
                        {[
                          { key: 'fabrica', label: 'Fabricante' },
                          { key: 'marca', label: 'Marca' },
                          { key: 'unitPriceRmb', label: 'Preço RMB', format: formatCurrency },
                          { key: 'moq', label: 'MOQ' },
                        ].map(({ key, label, format }) => {
                          const value = (product as any)[key];
                          const displayValue = format ? format(value) : (value !== undefined && value !== null ? value.toString() : 'N/A');
                          const isEditing = editingCell?.productId === product.id && editingCell?.column === key;
                          const column = allColumns.find(c => c.key === key);
                          
                          return (
                            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#0175a6' }}>
                                {label}:
                              </label>
                              {isEditing && column?.editable ? (
                                <input
                                  type={column.type === 'number' ? 'number' : 'text'}
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={() => handleEditSave(product.id!, key)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleEditSave(product.id!, key);
                                    } else if (e.key === 'Escape') {
                                      handleEditCancel();
                                    }
                                  }}
                                  autoFocus
                                  style={{
                                    width: '100%',
                                    padding: '0.375rem',
                                    border: '1px solid #0175a6',
                                    borderRadius: '0.25rem',
                                    fontSize: '0.875rem',
                                    outline: 'none'
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    fontSize: '0.875rem',
                                    color: 'rgba(0, 0, 0, 0.7)',
                                    padding: '0.25rem 0',
                                    backgroundColor: isEditing ? '#fef3c7' : 'transparent'
                                  }}
                                >
                                  {displayValue}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal de edição de produto */}
      <ProductForm
        product={editingProduct}
        isOpen={showProductForm}
        onClose={() => {
          setShowProductForm(false);
          setEditingProduct(undefined);
        }}
        onSubmit={handleSubmitProduct}
      />
    </div>
  );
};
