import React, { useState, useEffect } from 'react';
import { ProductService } from '../../services/productService';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export const FirebaseStatus: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setStatus('loading');
        setMessage('Conectando ao Firebase...');
        
        // Testa a conexão tentando buscar produtos
        await ProductService.getAllProducts();
        
        setStatus('connected');
        setMessage('Conectado ao Firebase com sucesso!');
        
        // Remove a mensagem após 3 segundos
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage('Erro ao conectar com o Firebase');
        console.error('Erro de conexão Firebase:', error);
      }
    };

    checkConnection();
  }, []);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 1000,
      padding: '1rem',
      borderRadius: '0.5rem',
      backgroundColor: status === 'connected' ? '#dcfce7' : status === 'error' ? '#fef2f2' : '#f0f9ff',
      border: `1px solid ${status === 'connected' ? '#bbf7d0' : status === 'error' ? '#fecaca' : '#bae6fd'}`,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      {status === 'loading' && <Loader style={{ width: '1rem', height: '1rem', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />}
      {status === 'connected' && <CheckCircle style={{ width: '1rem', height: '1rem', color: '#16a34a' }} />}
      {status === 'error' && <XCircle style={{ width: '1rem', height: '1rem', color: '#dc2626' }} />}
      
      <span style={{
        fontSize: '0.875rem',
        fontWeight: '500',
        color: status === 'connected' ? '#166534' : status === 'error' ? '#991b1b' : '#1e40af'
      }}>
        {message}
      </span>
    </div>
  );
};
