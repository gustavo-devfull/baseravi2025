import React from 'react';
import type { Product } from '../../types/Product';
import { 
  Edit, 
  Trash2, 
  Package, 
  Factory, 
  Tag, 
  DollarSign,
  Ruler,
  Weight,
  Calendar
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'CNY',
    }).format(value);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Header do card */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {product.description}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <Package className="w-3 h-3 mr-1" />
                {product.referencia}
              </span>
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(product.createdAt)}
              </span>
            </div>
          </div>
          
          {/* Ações */}
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              title="Editar produto"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product.id!)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Excluir produto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Informações principais */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Fabricante e Marca */}
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Factory className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Fabricante:</span>
              <span className="ml-2 font-medium text-gray-900">{product.fabrica}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Tag className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Marca:</span>
              <span className="ml-2 font-medium text-gray-900">{product.marca}</span>
            </div>

            <div className="flex items-center text-sm">
              <Package className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Item No:</span>
              <span className="ml-2 font-medium text-gray-900">{product.itemNo}</span>
            </div>
          </div>

          {/* Preço e Quantidades */}
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Preço RMB:</span>
              <span className="ml-2 font-medium text-gray-900">
                {formatCurrency(product.unitPriceRmb)}
              </span>
            </div>

            <div className="flex items-center text-sm">
              <Package className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">MOQ:</span>
              <span className="ml-2 font-medium text-gray-900">{product.moq}</span>
            </div>

            <div className="flex items-center text-sm">
              <Package className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Unit/CTN:</span>
              <span className="ml-2 font-medium text-gray-900">{product.unitCtn}</span>
            </div>
          </div>
        </div>

        {/* Dimensões e Peso */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
            <div className="flex items-center">
              <Ruler className="w-4 h-4 text-gray-400 mr-2" />
              <div>
                <span className="text-gray-600">Dimensões:</span>
                <div className="font-medium text-gray-900">
                  {product.l}×{product.w}×{product.h} cm
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <Weight className="w-4 h-4 text-gray-400 mr-2" />
              <div>
                <span className="text-gray-600">Peso Unit:</span>
                <div className="font-medium text-gray-900">{product.pesoUnitario} kg</div>
              </div>
            </div>

            <div className="flex items-center">
              <Package className="w-4 h-4 text-gray-400 mr-2" />
              <div>
                <span className="text-gray-600">CBM:</span>
                <div className="font-medium text-gray-900">{product.cbm} m³</div>
              </div>
            </div>

            <div className="flex items-center">
              <Weight className="w-4 h-4 text-gray-400 mr-2" />
              <div>
                <span className="text-gray-600">Peso Bruto:</span>
                <div className="font-medium text-gray-900">{product.gw} kg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Observações */}
        {(product.obs || product.remark) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm">
              {product.obs && (
                <div className="mb-2">
                  <span className="text-gray-600">Observações:</span>
                  <p className="text-gray-900 mt-1">{product.obs}</p>
                </div>
              )}
              {product.remark && (
                <div>
                  <span className="text-gray-600">Remark:</span>
                  <p className="text-gray-900 mt-1">{product.remark}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
