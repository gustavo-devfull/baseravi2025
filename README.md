# Base Ravi 2025 - Sistema de Gestão de Produtos

Sistema completo para gerenciamento de base de produtos com dashboard, importação de planilhas Excel e integração com Firebase.

## 🚀 Funcionalidades

### 📊 Dashboard
- **Visualização em cards** com layout responsivo
- **Grid de 3 produtos por linha** otimizado
- **Imagens dos produtos** carregadas do DigitalOcean Spaces
- **Busca e filtros** avançados
- **Largura fixa** de 1216px para consistência visual

### 📋 Gestão de Produtos
- **CRUD completo** (Create, Read, Update, Delete)
- **Mais de 30 campos** por produto
- **Validação de dados** em tempo real
- **Modal de detalhes** com todos os campos
- **Modal de edição** completo

### 📥 Importação de Planilhas
- **Upload de arquivos Excel** (.xlsx, .xls)
- **Template disponível** para download
- **Validação automática** de dados
- **Preview dos produtos** importados
- **Edição em lote** antes do salvamento
- **Mapeamento automático** de campos

### 🖼️ Sistema de Imagens
- **Carregamento dinâmico** do DigitalOcean Spaces
- **URL baseada na referência** do produto
- **Modal de visualização** ampliada
- **Fallback** para produtos sem imagem
- **Tamanho otimizado** (150px x 150px)

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Firebase Firestore** - Banco de dados NoSQL
- **XLSX** - Leitura de arquivos Excel
- **Lucide React** - Ícones modernos

## 📦 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/gustavo-devfull/baseravi2025.git
cd baseravi2025
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o Firebase:**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com)
   - Configure as regras do Firestore (veja `FIREBASE_SETUP.md`)
   - Atualize as credenciais em `src/config/firebase.ts`

4. **Execute o projeto:**
```bash
npm run dev
```

## 🔧 Configuração do Firebase

### Regras do Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document} {
      allow read, write: if true;
    }
  }
}
```

### Estrutura dos Dados
```typescript
interface Product {
  // Informações básicas
  linhaCotacoes: string;
  referencia: string;
  fabrica: string;
  itemNo: string;
  description: string;
  name: string;
  remark: string;
  obs: string;
  
  // Preços e quantidades
  moq: number;
  unitCtn: number;
  unitPriceRmb: number;
  unit: string;
  valorInvoiceUsd: number;
  qtMinVenda: number;
  
  // Dimensões e peso
  l: number;
  w: number;
  h: number;
  cbm: number;
  gw: number;
  nw: number;
  pesoUnitario: number;
  
  // Códigos
  marca: string;
  codRavi: string;
  ean: string;
  dun: string;
  ncm: string;
  cest: string;
  
  // Nomes comerciais
  nomeInvoiceEn: string;
  nomeDiNb: string;
  nomeRaviProfit: string;
  
  // Observações
  obsPedido: string;
}
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Dashboard/          # Componente principal
│   ├── Layout/            # Header, Sidebar, SearchBar
│   ├── Product/           # Cards, Forms, Modals
│   ├── Import/            # Importação de planilhas
│   ├── Status/            # Status do Firebase
│   ├── Setup/             # Inicialização
│   └── Error/             # Tratamento de erros
├── services/
│   └── productService.ts  # CRUD operations
├── types/
│   └── Product.ts         # Interfaces TypeScript
├── config/
│   └── firebase.ts        # Configuração Firebase
└── App.tsx               # Componente raiz
```

## 🎨 Layout e Design

### Cards de Produto
- **Layout de 2 colunas:** Imagem + Botões | Informações
- **Imagem:** 150px x 150px com object-fit: contain
- **Botões de ação:** Editar, Excluir, Desativar
- **Informações:** Marca, Referência, Nome, Preço
- **Modal de detalhes:** Todos os campos + imagem

### Grid Responsivo
- **Desktop:** 3 produtos por linha
- **Tablet:** 2 produtos por linha
- **Mobile:** 1 produto por linha
- **Largura máxima:** 1216px centralizada

## 📥 Importação de Planilhas

### Template Excel
1. **Baixe o template** no modal de importação
2. **Preencha os dados** seguindo o formato
3. **Faça upload** da planilha
4. **Revise os dados** no preview
5. **Edite se necessário** no modal de edição
6. **Salve os produtos** no banco

### Campos Obrigatórios
- `name` ou `description`
- `referencia`
- `fabrica`
- `unitPriceRmb` > 0

## 🖼️ Sistema de Imagens

### DigitalOcean Spaces
- **URL base:** `https://nyc3.digitaloceanspaces.com/moribr/base-fotos/`
- **Formato:** `{referencia}.jpg`
- **Fallback:** Placeholder para produtos sem imagem
- **Modal:** Visualização ampliada com zoom

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

- **GitHub:** [@gustavo-devfull](https://github.com/gustavo-devfull)
- **Repositório:** [baseravi2025](https://github.com/gustavo-devfull/baseravi2025)

---

Desenvolvido com ❤️ por Gustavo DevFull