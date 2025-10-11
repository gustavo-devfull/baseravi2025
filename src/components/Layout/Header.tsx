import React from 'react';
import RaviLogo from '../../assets/RAVI-LOGO.svg';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: '1216px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          {/* Logo RAVI e Título */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={RaviLogo} 
              alt="RAVI Logo" 
              style={{ height: '48px', width: 'auto', cursor: 'pointer' }}
              onClick={() => window.location.reload()}
            />
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '500', 
              color: '#111827',
              padding: '16px',
              margin: 0
            }}>
              Base de Produtos
            </h2>
          </div>

          {/* Botões do lado direito */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Botão Controle de Cotações */}
            <button 
              onClick={() => window.open('https://cotacoes25.vercel.app/', '_blank')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.5rem 1rem', 
                backgroundColor: '#000000', 
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
                backgroundColor: 'white', 
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
              backgroundColor: '#737373', 
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
              backgroundColor: '#dc2626', 
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
    </header>
  );
};