import React from 'react';
import { AlertTriangle, ExternalLink, Copy } from 'lucide-react';

export const FirebasePermissionError: React.FC = () => {
  const copyRules = () => {
    const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura e escrita para todos os usuários (apenas para desenvolvimento)
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Regras específicas para a coleção de produtos
    match /products/{productId} {
      allow read, write: if true;
    }
  }
}`;
    
    navigator.clipboard.writeText(rules);
    alert('Regras copiadas para a área de transferência!');
  };

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
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertTriangle style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
              Erro de Permissão do Firebase
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
              Configure as regras de segurança do Firestore
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              Passo 1: Acessar o Firebase Console
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Vá para o console do Firebase e selecione o projeto <strong>cadastro-angular</strong>
            </p>
            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: '#2563eb',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <ExternalLink style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              Abrir Firebase Console
            </a>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              Passo 2: Configurar Regras do Firestore
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              1. Clique em <strong>Firestore Database</strong> no menu lateral<br/>
              2. Vá para a aba <strong>Regras</strong><br/>
              3. Substitua as regras atuais pelas regras abaixo
            </p>
            
            <div style={{
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              padding: '1rem',
              marginBottom: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={copyRules}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Copy style={{ width: '0.75rem', height: '0.75rem' }} />
                Copiar
              </button>
              
              <pre style={{
                fontSize: '0.75rem',
                color: '#374151',
                margin: 0,
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace'
              }}>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura e escrita para todos os usuários (apenas para desenvolvimento)
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Regras específicas para a coleção de produtos
    match /products/{productId} {
      allow read, write: if true;
    }
  }
}`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              Passo 3: Publicar e Testar
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              1. Clique em <strong>Publicar</strong> para salvar as regras<br/>
              2. Aguarde alguns segundos para a propagação<br/>
              3. Recarregue esta página
            </p>
          </div>

          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '0.25rem',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
              <strong>⚠️ Importante:</strong> Estas regras permitem acesso total ao banco de dados. 
              Use apenas para desenvolvimento. Em produção, implemente autenticação adequada.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem'
        }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Recarregar Página
          </button>
        </div>
      </div>
    </div>
  );
};
