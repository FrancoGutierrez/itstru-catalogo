'use client';

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Category, Product } from '@/types';
import { getProducts, getCategories } from '@/lib/supabase/client';
import { CatalogFilters } from '@/components/catalog/CatalogFilters';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductModal } from '@/components/catalog/ProductModal';
import { Package } from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('categoria') || 'all';
  const initialSearchParam = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de filtros
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchParam);
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);
  const [onlyNew, setOnlyNew] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          getProducts({ onlyActive: true }),
          getCategories(),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (e) {
        console.error('Error cargando catálogo:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Actualizar si los query params de la URL cambian
  useEffect(() => {
    const cat = searchParams.get('categoria');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Filtrado y ordenamiento reactivo
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      // 1. Filtro por categoría
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 2. Filtro por ofertas y novedades
      if (onlyOffers && !product.is_offer) return false;
      if (onlyNew && !product.is_new) return false;

      // 3. Filtro por texto de búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesDesc = product.description?.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesDesc && !matchesCat) {
          return false;
        }
      }

      return true;
    });

    // Ordenamiento
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'stock-desc':
        result.sort((a, b) => b.stock - a.stock);
        break;
      case 'featured':
      default:
        result.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, onlyOffers, onlyNew, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Título de la Sección */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Catálogo Oficial <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-400 lowercase">its tru</span>
        </h1>
        <p className="text-xs sm:text-sm text-purple-200/60">
          Encuentra especificaciones técnicas, precios en Soles y agrega a tu proforma con un solo clic
        </p>
      </div>

      {/* Componente de Filtros */}
      <CatalogFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onlyOffers={onlyOffers}
        onToggleOffers={() => setOnlyOffers(!onlyOffers)}
        onlyNew={onlyNew}
        onToggleNew={() => setOnlyNew(!onlyNew)}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalFiltered={filteredProducts.length}
      />

      {/* Grilla de Resultados */}
      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-purple-300 uppercase tracking-wider">
            Cargando catálogo its tru...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[#130b29]/95 rounded-3xl border border-purple-900/60 p-12 text-center shadow-xl shadow-purple-950/40">
          <Package className="w-14 h-14 text-purple-400/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">
            No se encontraron productos con los filtros seleccionados
          </h3>
          <p className="text-xs text-purple-300/60 mt-1 max-w-sm mx-auto">
            Prueba buscando con otro término, limpiando la categoría o desmarcando las opciones de oferta.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlyOffers(false);
              setOnlyNew(false);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 transition-all"
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Modal de Detalle */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
