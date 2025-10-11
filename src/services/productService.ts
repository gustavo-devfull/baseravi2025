import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Product, ProductFormData, ProductFilters } from '../types/Product';

const COLLECTION_NAME = 'products';

export class ProductService {
  // Criar um novo produto
  static async createProduct(productData: ProductFormData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...productData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw new Error('Falha ao criar produto');
    }
  }

  // Função auxiliar para remover acentos de uma string
  // Exemplos: "café" → "cafe", "garrafa" → "garrafa", "ação" → "acao"
  private static removeAccents(str: string): string {
    // Corrigir a função para remover acentos corretamente
    const result = str
      .normalize('NFD') // Decompõe caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
      .replace(/\s+/g, ' ') // Remove espaços múltiplos
      .trim(); // Remove espaços no início e fim
    
    
    return result;
  }

  // Função auxiliar para criar índice de busca
  private static createSearchIndex(product: Product): string {
    const searchableFields = [
      product.name,
      product.description,
      product.referencia,
      product.fabrica,
      product.itemNo,
      product.marca,
      product.codRavi,
      product.ean,
      product.dun,
      product.nomeInvoiceEn,
      product.nomeDiNb,
      product.nomeRaviProfit,
      product.ncm,
      product.cest,
      product.linhaCotacoes,
      product.remark,
      product.obs,
      product.obsPedido,
      product.unit,
      product.moq?.toString(),
      product.unitCtn?.toString(),
      product.unitPriceRmb?.toString(),
      product.l?.toString(),
      product.w?.toString(),
      product.h?.toString(),
      product.cbm?.toString(),
      product.gw?.toString(),
      product.nw?.toString(),
      product.pesoUnitario?.toString(),
      product.qtMinVenda?.toString(),
      product.valorInvoiceUsd?.toString()
    ];

    // Processar cada campo individualmente para remover acentos corretamente
    const processedFields = searchableFields
      .filter(field => field && field.toString().trim())
      .map(field => this.removeAccents(field.toString().toLowerCase()))
      .join(' ')
      .replace(/[^\w\s]/g, ' ') // Remove caracteres especiais
      .replace(/\s+/g, ' ') // Remove espaços múltiplos
      .trim();
    
    return processedFields;
  }

  // Função auxiliar para busca avançada com múltiplos termos
  private static matchesSearchTerms(product: Product, searchTerm: string): boolean {
    const searchIndex = this.createSearchIndex(product);
    const normalizedSearchTerm = this.removeAccents(searchTerm.toLowerCase().trim());
    
    
    // Se o termo de busca contém espaços, buscar por todos os termos
    if (normalizedSearchTerm.includes(' ')) {
      const terms = normalizedSearchTerm.split(/\s+/).filter(term => term.length > 0);
      return terms.every(term => searchIndex.includes(term));
    }
    
    // Busca simples por um termo
    return searchIndex.includes(normalizedSearchTerm);
  }

  // Buscar todos os produtos com busca em todos os campos
  // A busca agora pesquisa em todos os campos do produto:
  // - Campos de texto: name, description, referencia, fabrica, itemNo, marca, etc.
  // - Campos numéricos: moq, unitCtn, unitPriceRmb, dimensões, pesos, etc.
  // - Suporta busca por múltiplos termos (ex: "garrafa térmica")
  // - Case-insensitive e ignora caracteres especiais
  // - IGNORA ACENTOS: busca "cafe" encontra "café", "garrafa" encontra "garrafa"
  static async getAllProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      // Buscar todos os produtos sem filtros do Firestore para evitar problemas de índice
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Product);
      });

      // Aplicar todos os filtros no lado do cliente
      let filteredProducts = products;
      
      // Filtro por fabricante
      if (filters?.fabrica) {
        filteredProducts = filteredProducts.filter(p => p.fabrica === filters.fabrica);
      }

      // Filtro por marca
      if (filters?.marca) {
        filteredProducts = filteredProducts.filter(p => p.marca === filters.marca);
      }
      
      // Busca em todos os campos
      if (filters?.search) {
        filteredProducts = filteredProducts.filter(product => 
          this.matchesSearchTerms(product, filters.search!)
        );
      }

      // Filtros de preço
      if (filters?.minPrice) {
        filteredProducts = filteredProducts.filter(p => p.unitPriceRmb >= filters.minPrice!);
      }
      if (filters?.maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.unitPriceRmb <= filters.maxPrice!);
      }

      return filteredProducts;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Falha ao buscar produtos');
    }
  }

  // Buscar produto por ID
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Product;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw new Error('Falha ao buscar produto');
    }
  }

  // Atualizar produto
  static async updateProduct(id: string, productData: Partial<ProductFormData>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw new Error('Falha ao atualizar produto');
    }
  }

  // Deletar produto
  static async deleteProduct(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw new Error('Falha ao deletar produto');
    }
  }

  // Buscar produtos com paginação
  static async getProductsPaginated(
    pageSize: number = 10,
    lastDoc?: DocumentSnapshot
  ): Promise<{ products: Product[]; lastDoc: DocumentSnapshot | null; hasMore: boolean }> {
    try {
      let q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(
          collection(db, COLLECTION_NAME),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Product);
      });

      const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      const hasMore = querySnapshot.docs.length === pageSize;

      return {
        products,
        lastDoc: lastDocument,
        hasMore,
      };
    } catch (error) {
      console.error('Erro ao buscar produtos paginados:', error);
      throw new Error('Falha ao buscar produtos');
    }
  }

  // Buscar fabricantes únicos
  static async getUniqueFabricas(): Promise<string[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const fabricas = new Set<string>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.fabrica) {
          fabricas.add(data.fabrica);
        }
      });

      return Array.from(fabricas).sort();
    } catch (error) {
      console.error('Erro ao buscar fabricantes:', error);
      return [];
    }
  }

  // Buscar marcas únicas
  static async getUniqueMarcas(): Promise<string[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const marcas = new Set<string>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.marca) {
          marcas.add(data.marca);
        }
      });

      return Array.from(marcas).sort();
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
      return [];
    }
  }

  // Função de teste específica para o produto "tábua"
  static async testTabuaSearch(): Promise<void> {
    try {
      console.log('🧪 TESTE ESPECÍFICO PARA "tábua"');
      
      // Buscar todos os produtos
      const allProducts = await this.getAllProducts();
      console.log('Total de produtos:', allProducts.length);
      
      // Encontrar produtos que contenham "tábua"
      const tabuaProducts = allProducts.filter(p => 
        p.name?.toLowerCase().includes('tábua') || 
        p.description?.toLowerCase().includes('tábua') ||
        p.name?.toLowerCase().includes('tabua') || 
        p.description?.toLowerCase().includes('tabua')
      );
      
      console.log('Produtos encontrados com "tábua":', tabuaProducts.length);
      tabuaProducts.forEach(p => {
        console.log('  - Produto:', p.name, '| Descrição:', p.description);
      });
      
      // Testar busca específica
      console.log('\n🔍 TESTANDO BUSCA:');
      const searchResults = await this.getAllProducts({ search: 'tábua' });
      console.log('Resultados da busca "tábua":', searchResults.length);
      
      const searchResults2 = await this.getAllProducts({ search: 'tabua' });
      console.log('Resultados da busca "tabua":', searchResults2.length);
      
    } catch (error) {
      console.error('Erro no teste:', error);
    }
  }

  // Verificar se há produtos no banco de dados
  static async hasProducts(): Promise<boolean> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Erro ao verificar se há produtos:', error);
      return false;
    }
  }

  // Buscar produtos com busca avançada em campos específicos
  static async searchProductsInFields(
    searchTerm: string, 
    fields: (keyof Product)[] = []
  ): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Product);
      });

      const normalizedSearchTerm = this.removeAccents(searchTerm.toLowerCase().trim());
      
      return products.filter(product => {
        // Se não especificou campos, busca em todos
        const fieldsToSearch = fields.length > 0 ? fields : [
          'name', 'description', 'referencia', 'fabrica', 'itemNo', 'marca',
          'codRavi', 'ean', 'dun', 'nomeInvoiceEn', 'nomeDiNb', 'nomeRaviProfit',
          'ncm', 'cest', 'linhaCotacoes', 'remark', 'obs', 'obsPedido', 'unit'
        ];

        return fieldsToSearch.some(field => {
          const fieldValue = (product as any)[field];
          if (!fieldValue) return false;
          
          const normalizedFieldValue = this.removeAccents(fieldValue.toString().toLowerCase());
          return normalizedFieldValue.includes(normalizedSearchTerm);
        });
      });
    } catch (error) {
      console.error('Erro ao buscar produtos em campos específicos:', error);
      throw new Error('Falha ao buscar produtos');
    }
  }
}
