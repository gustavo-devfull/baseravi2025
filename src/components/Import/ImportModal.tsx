import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { ProductFormData } from '../../types/Product';
import { ExcelTemplate } from './ExcelTemplate';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: ProductFormData[]) => void;
}

interface ImportedProduct extends ProductFormData {
  _rowIndex: number;
  _errors?: string[];
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'processing'>('upload');
  const [importedProducts, setImportedProducts] = useState<ImportedProduct[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          setErrors(['A planilha deve ter pelo menos um cabeçalho e uma linha de dados']);
          return;
        }

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];

        // Mapear cabeçalhos para campos do produto
        const fieldMapping: Record<string, keyof ProductFormData> = {
          'linhaCotacoes': 'linhaCotacoes',
          'referencia': 'referencia',
          'fabrica': 'fabrica',
          'itemNo': 'itemNo',
          'description': 'description',
          'name': 'name',
          'remark': 'remark',
          'obs': 'obs',
          'moq': 'moq',
          'unitCtn': 'unitCtn',
          'unitPriceRmb': 'unitPriceRmb',
          'unit': 'unit',
          'l': 'l',
          'w': 'w',
          'h': 'h',
          'cbm': 'cbm',
          'gw': 'gw',
          'nw': 'nw',
          'pesoUnitario': 'pesoUnitario',
          'marca': 'marca',
          'codRavi': 'codRavi',
          'ean': 'ean',
          'dun': 'dun',
          'nomeInvoiceEn': 'nomeInvoiceEn',
          'nomeDiNb': 'nomeDiNb',
          'nomeRaviProfit': 'nomeRaviProfit',
          'qtMinVenda': 'qtMinVenda',
          'ncm': 'ncm',
          'cest': 'cest',
          'valorInvoiceUsd': 'valorInvoiceUsd',
          'obsPedido': 'obsPedido'
        };

        const products: ImportedProduct[] = [];
        const newErrors: string[] = [];

        rows.forEach((row, index) => {
          if (row.every(cell => cell === null || cell === undefined || cell === '')) {
            return; // Pula linhas vazias
          }

          const product: ImportedProduct = {
            linhaCotacoes: '',
            referencia: '',
            fabrica: '',
            itemNo: '',
            description: '',
            name: '',
            remark: '',
            obs: '',
            moq: 0,
            unitCtn: 0,
            unitPriceRmb: 0,
            unit: '',
            l: 0,
            w: 0,
            h: 0,
            cbm: 0,
            gw: 0,
            nw: 0,
            pesoUnitario: 0,
            marca: '',
            codRavi: '',
            ean: '',
            dun: '',
            nomeInvoiceEn: '',
            nomeDiNb: '',
            nomeRaviProfit: '',
            qtMinVenda: 0,
            ncm: '',
            cest: '',
            valorInvoiceUsd: 0,
            obsPedido: '',
            _rowIndex: index + 2 // +2 porque começamos do índice 0 e pulamos o cabeçalho
          };

          const productErrors: string[] = [];

          // Mapear dados da linha para o produto
          headers.forEach((header, colIndex) => {
            const field = fieldMapping[header?.toLowerCase()];
            if (field && row[colIndex] !== undefined && row[colIndex] !== null) {
              const value = row[colIndex];
              
              if (typeof value === 'number') {
                (product as any)[field] = value;
              } else if (typeof value === 'string') {
                (product as any)[field] = value.trim();
              }
            }
          });

          // Validações básicas
          if (!product.name && !product.description) {
            productErrors.push('Nome ou descrição é obrigatório');
          }

          if (!product.referencia) {
            productErrors.push('Referência é obrigatória');
          }

          if (!product.fabrica) {
            productErrors.push('Fabricante é obrigatório');
          }

          if (product.unitPriceRmb <= 0) {
            productErrors.push('Preço deve ser maior que zero');
          }

          if (productErrors.length > 0) {
            product._errors = productErrors;
            newErrors.push(`Linha ${product._rowIndex}: ${productErrors.join(', ')}`);
          }

          products.push(product);
        });

        setImportedProducts(products);
        setErrors(newErrors);
        setStep('preview');
      } catch (error) {
        setErrors(['Erro ao processar o arquivo Excel. Verifique se o formato está correto.']);
        console.error('Erro ao importar Excel:', error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    setStep('processing');
    
    try {
      // Filtrar apenas produtos sem erros
      const validProducts = importedProducts.filter(p => !p._errors || p._errors.length === 0);
      
      if (validProducts.length === 0) {
        setErrors(['Nenhum produto válido para importar']);
        setStep('preview');
        return;
      }

      // Remover campos internos antes de enviar
      const productsToImport = validProducts.map(({ _rowIndex, _errors, ...product }) => product);
      
      await onImport(productsToImport);
      onClose();
    } catch (error) {
      setErrors(['Erro ao importar produtos']);
      console.error('Erro na importação:', error);
      setStep('preview');
    }
  };

  const resetModal = () => {
    setStep('upload');
    setImportedProducts([]);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '56rem',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
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
              backgroundColor: '#dcfce7',
              borderRadius: '0.5rem',
              marginRight: '0.75rem'
            }}>
              <FileSpreadsheet style={{ width: '1.5rem', height: '1.5rem', color: '#16a34a' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>
                Importar Planilha
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                {step === 'upload' && 'Selecione um arquivo Excel (.xlsx)'}
                {step === 'preview' && `Preview dos dados (${importedProducts.length} produtos)`}
                {step === 'processing' && 'Processando importação...'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              color: '#9ca3af',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.25rem'
            }}
          >
            <X style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {step === 'upload' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <Upload style={{ width: '2rem', height: '2rem', color: '#2563eb' }} />
              </div>
              
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Selecione um arquivo Excel
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                Suporte para arquivos .xlsx com todos os campos do produto
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  Selecionar Arquivo
                </button>
                <ExcelTemplate />
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Campos esperados na planilha:
                </h5>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.5' }}>
                  linhaCotacoes, referencia, fabrica, itemNo, description, name, remark, obs, moq, unitCtn, unitPriceRmb, unit, l, w, h, cbm, gw, nw, pesoUnitario, marca, codRavi, ean, dun, nomeInvoiceEn, nomeDiNb, nomeRaviProfit, qtMinVenda, ncm, cest, valorInvoiceUsd, obsPedido
                </div>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div>
              {/* Resumo */}
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <CheckCircle style={{ width: '1rem', height: '1rem', color: '#16a34a', marginRight: '0.5rem' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#166534' }}>
                    {importedProducts.filter(p => !p._errors || p._errors.length === 0).length} produtos válidos
                  </span>
                </div>
                {errors.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <AlertCircle style={{ width: '1rem', height: '1rem', color: '#dc2626', marginRight: '0.5rem' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#991b1b' }}>
                      {errors.length} produtos com erros
                    </span>
                  </div>
                )}
              </div>

              {/* Lista de produtos */}
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {importedProducts.map((product, index) => (
                  <div
                    key={index}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      marginBottom: '0.5rem',
                      backgroundColor: product._errors && product._errors.length > 0 ? '#fef2f2' : '#f0fdf4'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>
                            Linha {product._rowIndex}:
                          </span>
                          <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                            {product.name || product.description || 'Produto sem nome'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          <span>Ref: {product.referencia || 'N/A'}</span>
                          <span style={{ marginLeft: '1rem' }}>Fab: {product.fabrica || 'N/A'}</span>
                          <span style={{ marginLeft: '1rem' }}>Preço: ¥{product.unitPriceRmb || 0}</span>
                        </div>
                      </div>
                      {product._errors && product._errors.length > 0 && (
                        <div style={{ marginLeft: '1rem' }}>
                          <AlertCircle style={{ width: '1rem', height: '1rem', color: '#dc2626' }} />
                        </div>
                      )}
                    </div>
                    
                    {product._errors && product._errors.length > 0 && (
                      <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #fecaca' }}>
                        <div style={{ fontSize: '0.75rem', color: '#dc2626' }}>
                          {product._errors.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                animation: 'spin 1s linear infinite'
              }}>
                <Upload style={{ width: '2rem', height: '2rem', color: '#2563eb' }} />
              </div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Importando produtos...
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Aguarde enquanto salvamos os produtos no banco de dados
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            onClick={handleClose}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          
          {step === 'preview' && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setStep('upload')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Voltar
              </button>
              <button
                onClick={handleImport}
                disabled={importedProducts.filter(p => !p._errors || p._errors.length === 0).length === 0}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: importedProducts.filter(p => !p._errors || p._errors.length === 0).length === 0 ? '#9ca3af' : '#16a34a',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: importedProducts.filter(p => !p._errors || p._errors.length === 0).length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Importar {importedProducts.filter(p => !p._errors || p._errors.length === 0).length} Produtos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
