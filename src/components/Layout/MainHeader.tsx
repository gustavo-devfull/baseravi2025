import React from 'react';

export const MainHeader: React.FC = () => {
  const navigationLinks = [
    {
      label: 'Sistema de Cotações Online',
      url: 'https://prod-mori.vercel.app/',
      backgroundColor: '#2563eb',
      hoverBackgroundColor: '#1d4ed8',
      textColor: '#ffffff'
    },
    {
      label: 'Exportar Cotações Online',
      url: 'https://exporta-planilha-gamma.vercel.app/',
      backgroundColor: '#3b82f6',
      hoverBackgroundColor: '#2563eb',
      textColor: '#ffffff'
    },
    {
      label: 'Gerenciador de Cotações',
      url: 'https://cotacoes2025.vercel.app/',
      backgroundColor: '#16a34a',
      hoverBackgroundColor: '#15803d',
      textColor: '#ffffff'
    },
    {
      label: 'Importar Imagens Cotações',
      url: 'https://upload-imagens.onrender.com/',
      backgroundColor: '#22c55e',
      hoverBackgroundColor: '#16a34a',
      textColor: '#ffffff'
    },
    {
      label: 'Base de Produtos',
      url: 'https://baseravi2025.vercel.app/',
      backgroundColor: '#ea580c',
      hoverBackgroundColor: '#c2410c',
      textColor: '#ffffff'
    },
    {
      label: 'Importar Imagens Base',
      url: 'https://imagens-base.vercel.app/',
      backgroundColor: '#f97316',
      hoverBackgroundColor: '#ea580c',
      textColor: '#ffffff'
    },
    {
      label: 'Controle de Pedidos',
      url: 'https://controle-pedidos-ravi.vercel.app/',
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#f3f4f6',
      textColor: '#2563eb'
    }
  ];

  return (
    <header style={{ 
      backgroundColor: '#1f2937', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
    }}>
      <div style={{ 
        width: '100%', 
        padding: '0.75rem 1rem',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '0.5rem' 
        }}>
          {navigationLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: '0.875rem',
                borderRadius: '0.25rem',
                flex: '1 1 0%',
                minWidth: '0',
                textAlign: 'center',
                backgroundColor: link.backgroundColor,
                color: link.textColor,
                textDecoration: 'none',
                transition: 'background-color 0.2s ease',
                cursor: 'pointer',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = link.hoverBackgroundColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = link.backgroundColor;
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

