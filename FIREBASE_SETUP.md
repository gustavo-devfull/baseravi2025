# Configuração do Firebase - Base de Produtos

## 🚨 Problema: Missing or insufficient permissions

O erro indica que as regras de segurança do Firestore não estão configuradas para permitir leitura e escrita.

## 🔧 Solução: Configurar Regras do Firestore

### Passo 1: Acessar o Console do Firebase
1. Vá para [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `cadastro-angular`
3. No menu lateral, clique em **Firestore Database**

### Passo 2: Configurar Regras de Segurança
1. Clique na aba **Regras**
2. Substitua as regras atuais por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura e escrita para todos os usuários (apenas para desenvolvimento)
    // Em produção, você deve implementar autenticação adequada
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Regras específicas para a coleção de produtos
    match /products/{productId} {
      allow read, write: if true;
    }
  }
}
```

3. Clique em **Publicar**

### Passo 3: Verificar Configuração
1. Após publicar as regras, aguarde alguns segundos
2. Recarregue a aplicação
3. O status de conexão deve aparecer como "Conectado"

## 🛡️ Regras de Segurança (Desenvolvimento vs Produção)

### Para Desenvolvimento (Atual):
```javascript
allow read, write: if true;
```
- ✅ Permite acesso total
- ⚠️ **NÃO usar em produção**

### Para Produção (Recomendado):
```javascript
// Com autenticação
allow read, write: if request.auth != null;

// Ou com validação específica
allow read, write: if request.auth != null && 
  request.auth.token.email_verified == true;
```

## 📋 Checklist de Configuração

- [ ] Firebase Console acessado
- [ ] Projeto `cadastro-angular` selecionado
- [ ] Firestore Database ativado
- [ ] Regras de segurança atualizadas
- [ ] Regras publicadas
- [ ] Aplicação recarregada
- [ ] Status de conexão verde

## 🔍 Verificação de Funcionamento

Após configurar as regras, você deve ver:

1. **Status de Conexão:** Verde com "Conectado ao Firebase com sucesso!"
2. **Modal de Inicialização:** Se não houver produtos, aparecerá o modal para inicializar
3. **Produtos Carregados:** Após inicializar, os produtos aparecerão na lista

## 🚨 Importante

- As regras atuais permitem acesso total (apenas para desenvolvimento)
- Em produção, implemente autenticação adequada
- Sempre teste as regras antes de publicar em produção

## 📞 Suporte

Se ainda houver problemas:
1. Verifique se o Firestore está ativado no projeto
2. Confirme se as regras foram publicadas corretamente
3. Aguarde alguns minutos para a propagação das regras
4. Limpe o cache do navegador e recarregue
