import React from 'react';
import { 
  Home, 
  Package, 
  Filter, 
  BarChart3, 
  Settings,
  X 
} from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onToggleFilters: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onClose, 
  activeSection, 
  onSectionChange,
  onToggleFilters 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      {/* Header do sidebar */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <p className="text-xs text-gray-500">Navegação</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 mt-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                  ${isActive 
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Botão de filtros */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              onToggleFilters();
              onClose();
            }}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          >
            <Filter className="w-5 h-5 mr-3" />
            Filtros Avançados
          </button>
        </div>
      </nav>
    </div>
  );
};