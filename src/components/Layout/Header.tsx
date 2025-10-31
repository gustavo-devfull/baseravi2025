import React from 'react';
import RaviLogo from '../../assets/RAVI-LOGO.svg';

interface HeaderProps {
  onNavigateToAllProducts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateToAllProducts }) => {
  return (
    <header style={{ backgroundColor: '#0175a6', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: '1216px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          {/* Logo RAVI e Título */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={RaviLogo} 
              alt="RAVI Logo" 
              style={{ height: '50px', width: 'auto', cursor: 'pointer',  }}
              onClick={() => window.location.reload()}
            />

            
        <span className="text-lg md:text-xl font-[500] tracking-[-0.9px] text-[#ffffff] uppercase" style={{ 
  padding: '16px',
  fontSize: '16px'

}}>
  Base de Produtos
</span>
          </div>

          {/* Botões do lado direito */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Botão Todos os Produtos */}
            <button 
              onClick={onNavigateToAllProducts || (() => {})}
              disabled={!onNavigateToAllProducts}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.5rem 1rem', 
                backgroundColor: onNavigateToAllProducts ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)', 
                color: 'white', 
                borderRadius: '0.5rem', 
                fontSize: '0.875rem', 
                fontWeight: '500',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                cursor: onNavigateToAllProducts ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                opacity: onNavigateToAllProducts ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (onNavigateToAllProducts) {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.35)';
                  (e.target as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (onNavigateToAllProducts) {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  (e.target as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }
              }}
            >
              Todos os Produtos
            </button>
            
            {/* Botões que ficam ocultos no mobile */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.75rem' }}>
            
            {/* Botão Controle de Cotações */}
            <button 
              onClick={() => window.open('https://cotacoes25.vercel.app/', '_blank')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.5rem 1rem', 
                backgroundColor: '#0000008f', 
                color: 'white', 
                borderRadius: '0.5rem', 
                fontSize: '0.875rem', 
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                width: '1rem', 
                height: '1rem', 
                marginRight: '0.5rem', 
                backgroundColor: '#ffffff45', 
                borderRadius: '0.125rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                
              </div>
              Controle de Cotações
            </button>

            {/* Botão Controle de Importação */}
            <button style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#0000004f', 
              color: 'white', 
              borderRadius: '0.5rem', 
              fontSize: '0.875rem', 
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}>
              Controle de Importação
            </button>

            {/* Botão Sair */}
            <button style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#dc2626ae', 
              color: 'white', 
              borderRadius: '0.5rem', 
              fontSize: '0.875rem', 
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}>
              Sair
            </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};