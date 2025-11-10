import React, { useState, useEffect } from 'react';
import { ShoppingCart, ClipboardList, Package, ShoppingBag, ChevronUp, ChevronDown } from 'lucide-react';

export const MainHeader: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigationLinks = [
    {
      label: 'Sistemas Cotações Online',
      url: 'https://prod-mori.vercel.app/',
      icon: ShoppingCart,
      backgroundColor: '#2563eb',
      hoverBackgroundColor: '#1d4ed8',
      textColor: '#ffffff'
    },
    {
      label: 'Gerenciador de Cotações',
      url: 'https://cotacoes2025.vercel.app/',
      icon: ClipboardList,
      backgroundColor: '#16a34a',
      hoverBackgroundColor: '#15803d',
      textColor: '#ffffff'
    },
    {
      label: 'Base de Produtos',
      url: 'https://baseravi2025.vercel.app/',
      icon: Package,
      backgroundColor: '#ea580c',
      hoverBackgroundColor: '#c2410c',
      textColor: '#ffffff'
    },
    {
      label: 'Controle Pedidos',
      url: 'https://controle-pedidos-ravi.vercel.app/',
      icon: ShoppingBag,
      backgroundColor: '#9333ea',
      hoverBackgroundColor: '#7e22ce',
      textColor: '#ffffff'
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header style={{
      backgroundColor: '#1f2937',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      position: 'relative',
      transition: 'all 0.3s',
      paddingBottom: isCollapsed ? '1.5rem' : '0'
    }}>
      {/* Botão de Colapsar/Expandir */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: 'absolute',
          bottom: '-1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          backgroundColor: '#1f2937',
          border: 'none',
          color: '#ffffff',
          padding: '0.5rem',
          borderRadius: '9999px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#374151';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1f2937';
        }}
        aria-label={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
      >
        {isCollapsed ? (
          <ChevronDown style={{ width: '1.25rem', height: '1.25rem' }} />
        ) : (
          <ChevronUp style={{ width: '1.25rem', height: '1.25rem' }} />
        )}
      </button>

      {!isCollapsed && (
        <div style={{
          width: '100%',
          padding: isMobile ? '1rem' : '1.5rem 2rem',
          boxSizing: 'border-box'
        }}>
          {/* Menu Desktop - Grid com Boxes */}
          <div style={{
            display: isMobile ? 'none' : 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem'
          }}>
            {navigationLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: link.backgroundColor,
                    color: link.textColor,
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    minHeight: '120px',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = link.hoverBackgroundColor;
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.05)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = link.backgroundColor;
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                  }}
                >
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent style={{ width: '2rem', height: '2rem' }} />
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textAlign: 'center'
                  }}>
                    {link.label}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Menu Mobile - Grid com Boxes */}
          <div style={{
            display: isMobile ? 'grid' : 'none',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem'
          }}>
            {navigationLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsCollapsed(true)}
                  style={{
                    backgroundColor: link.backgroundColor,
                    color: link.textColor,
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    minHeight: '100px',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = link.hoverBackgroundColor;
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = link.backgroundColor;
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                  }}
                >
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent style={{ width: '1.5rem', height: '1.5rem' }} />
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textAlign: 'center'
                  }}>
                    {link.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

