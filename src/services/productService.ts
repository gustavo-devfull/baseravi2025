import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
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

  // Buscar todos os produtos
  static async getAllProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      let q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));

      if (filters?.search) {
        q = query(
          collection(db, COLLECTION_NAME),
          where('name', '>=', filters.search),
          where('name', '<=', filters.search + '\uf8ff'),
          orderBy('name')
        );
      }

      if (filters?.fabrica) {
        q = query(
          collection(db, COLLECTION_NAME),
          where('fabrica', '==', filters.fabrica),
          orderBy('createdAt', 'desc')
        );
      }

      if (filters?.marca) {
        q = query(
          collection(db, COLLECTION_NAME),
          where('marca', '==', filters.marca),
          orderBy('createdAt', 'desc')
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

      // Aplicar filtros de preço no lado do cliente se necessário
      let filteredProducts = products;
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
}
