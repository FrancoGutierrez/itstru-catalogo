'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductModal } from '@/components/catalog/ProductModal';
import { ArrowRight, Sparkles, Tag, Layers, Radio } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { getProducts } from '@/lib/supabase/client';

interface FeaturedGridProps {
  products: Product[];
}

export function FeaturedGrid({ products: initialProducts }: FeaturedGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filter, setFilter] = useState<'all' | 'offers' | 'new'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);

  // Sincronización en tiempo real con Supabase
  useEffect(() => {
    let isMounted = true;

    async function fetchLive() {
      try {
        const liveProducts = await getProducts({ onlyActive: true });
        if (isMounted && liveProducts.length > 0) {
          setProducts(liveProducts);
        }
      } catch (err) {
        console.warn('Error al cargar productos iniciales en vivo:', err);
      }
    }

    fetchLive();

    if (!supabase) return;

    // Escuchar inserciones, actualizaciones de precio y eliminaciones en tiempo real
    const channel = supabase
      .channel('home-realtime-products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        async () => {
          try {
            const updated = await getProducts({ onlyActive: true });
            if (isMounted) {
              setProducts(updated);
            }
          } catch (e) {
            console.error('Error sincronizando productos en tiempo real:', e);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED' && isMounted) {
          setIsRealtimeActive(true);
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  const filteredProducts = products.filter((p) => {
    if (!p.is_active) return false;
    if (filter === 'offers') return p.is_offer;
    if (filter === 'new') return p.is_new;
    return p.is_featured || p.is_offer || p.is_new;
  });

  return (
    <section className="space-y-6">
      {/* Encabezado de Sección */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-purple-900/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Lo Más Buscado</span>
            {isRealtimeActive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ml-2 animate-pulse">
                <Radio className="w-2.5 h-2.5" />
                Tiempo Real Supabase
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Novedades & Ofertas Destacadas
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/60 mt-1">
            Hardware gamer, mobiliario y accesorios con stock garantizado listos para cotizar
          </p>
        </div>

        {/* Tabs de Filtro Rápido */}
        <div className="flex items-center gap-1.5 bg-[#140b2a] p-1 rounded-2xl self-start sm:self-auto border border-purple-900/60 shadow-inner">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('offers')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'offers'
                ? 'bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white shadow-md shadow-fuchsia-600/30'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Tag className="w-3 h-3" />
            Ofertas
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'new'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/30'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Novedades
          </button>
        </div>
      </div>

      {/* Grilla de Productos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-[#120a26] rounded-3xl border border-purple-900/50 p-8">
          <Layers className="w-12 h-12 text-purple-400/40 mx-auto mb-2" />
          <p className="text-sm text-purple-200/70 font-semibold">No hay productos en esta categoría por el momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Ver Catálogo Completo CTA */}
      <div className="text-center pt-4">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
          <span>Ver Todo el Catálogo Oficial ({products.length} productos)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Modal de Vista Rápida de Producto */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
