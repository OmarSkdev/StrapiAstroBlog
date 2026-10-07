const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';

export interface Categoria {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  color: string | null;
}

export interface ImagenPortada {
  id: number;  
  url: string;
  alternativeText: string | null;  
}

export interface Articulo {
  id: number;
  documentId: string;
  titulo: string;
  slug: string;
  extracto: string | null;
  contenido: any | null;
  imagenPortada: ImagenPortada | null;
  categorias: Categoria[];
  publicado: string ;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Convierte categorias (objeto o array) siempre a array
function normalizarCategorias(valor: any): Categoria[] {
  if (!valor) return [];
  if (Array.isArray(valor)) return valor;
  // Es un objeto único (relación "has one"), lo envolvemos
  return [valor];
}

// Normaliza un artículo completo
function normalizarArticulo(articulo: any): Articulo {
  return {
    ...articulo,
    categorias: normalizarCategorias(articulo.categorias),
    imagenPortada: articulo.imagenPortada || null,
  };
}

/**
 * Obtiene todos los artículos con sus categorías e imagen de portada
 */
export async function getArticulos(): Promise<Articulo[]> {
    const url = `${STRAPI_URL}/api/articulos?populate=imagenPortada,categorias&sort=publishedAt:desc`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error al obtener artículos  : ${response.statusText}`);
    const data = await response.json();
    return data.data.map(normalizarArticulo);
}



/**
 * Obtiene todas las categorías ordenadas alfabéticamente
 */
export async function getCategorias(): Promise<Categoria[]> {
  const url = `${STRAPI_URL}/api/categorias?sort=nombre:asc`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error al obtener categorías: ${res.statusText}`);
  const data = await res.json();
  return data.data;
}

/**
 * Obtiene un artículo por su slug
 */
export async function getCategoriaBySlug(slug: string): Promise<Categoria | null> {
  const url = `${STRAPI_URL}/api/categorias?filters[slug][$eq]=${slug}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error al obtener categoría: ${res.statusText}`);
    const data = await res.json();
    return data.data[0] || null;
}

export async function getArticuloBySlug(slug: string): Promise<Articulo | null> {
  const url = `${STRAPI_URL}/api/articulos?filters[slug][$eq]=${slug}&populate=imagenPortada,categorias`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error al obtener artículo: ${res.statusText}`);
  const data = await res.json();
  return data.data[0] || null;
}

/**
 * Obtiene los artículos que pertenecen a una categoría
 */
export async function getArticulosByCategoria(categoriaSlug: string): Promise<Articulo[]> {
  const url = `${STRAPI_URL}/api/articulos?filters[categorias][slug][$eq]=${categoriaSlug}&populate=imagenPortada,categorias&sort=publishedAt:desc`;
  const res = await fetch(url);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    console.error('❌ Respuesta de Strapi:', JSON.stringify(errorBody, null, 2));
    throw new Error(`Error al obtener artículos: ${res.statusText}`);
  }
  const data = await res.json();
  return data.data;
}
/**
 * Construye la URL completa de una imagen de Strapi
 */
export function getStrapiImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}