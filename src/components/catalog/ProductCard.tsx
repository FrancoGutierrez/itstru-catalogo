'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useProforma } from '@/context/ProformaContext';
import { formatCurrency } from '@/lib/utils';
import { Plus, Check, Eye, Package, Sparkles, Tag, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem, items } = useProforma();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Cantidad ya presente en la proforma
  const currentItemInCart = items.find((item) => item.product.id === product.id);
  const currentQuantity = currentItemInCart ? currentItemInCart.quantity : 0;

  const handleAdd = () => {
    if (product.stock <= 0) return;
    setIsAdding(true);
    addItem(product, 1);
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-[#130b29]/95 rounded-2xl border border-purple-900/60 shadow-lg shadow-purple-950/40 hover:border-purple-500/70 hover:shadow-xl hover:shadow-purple-900/30 transition-all duration-300 flex flex-col overflow-hidden backdrop-blur-sm">
      {/* Badges superiores */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
        {product.is_offer && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white border border-fuchsia-400/40 shadow-lg shadow-fuchsia-950/50">
            <Tag className="w-3 h-3" />
            Oferta
          </span>
        )}
        {product.is_new && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-400/40 shadow-lg shadow-purple-950/50">
            <Sparkles className="w-3 h-3" />
            Novedad
          </span>
        )}
      </div>

      {/* Badge de cantidad si ya está en la proforma */}
      {currentQuantity > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-600 text-white shadow-lg border border-purple-400/60">
            {currentQuantity} en Proforma
          </span>
        </div>
      )}

      {/* Contenedor de Imagen */}
      <div className="relative w-full h-52 bg-[#090417] overflow-hidden flex items-center justify-center border-b border-purple-950/60">
        {product.image_url && !imageError ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-purple-400/40 bg-[#090417]">
            <Package className="w-12 h-12 stroke-1" />
            <span className="text-xs text-purple-300/40 mt-1">Sin Imagen</span>
          </div>
        )}

        {/* Overlay botón vista rápida */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute inset-0 bg-[#090417]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs backdrop-blur-[2px]"
          >
            <span className="px-3.5 py-1.5 rounded-full bg-purple-950/90 border border-purple-500/40 text-purple-200 flex items-center gap-1.5 hover:scale-105 transition-transform shadow-lg shadow-purple-950">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              Detalles
            </span>
          </button>
        )}
      </div>

      {/* Contenido del Producto */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="font-bold text-purple-300 uppercase tracking-wider text-[10px] bg-purple-950/70 border border-purple-800/60 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <span className="font-mono text-[11px] text-purple-300/60 font-medium">
              Cód: {product.sku}
            </span>
          </div>

          <h3 className="font-bold text-slate-100 text-sm leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs text-purple-200/60 line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Precios y Botón de Acción */}
        <div className="pt-2 border-t border-purple-900/40 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-300/70 block">
                Precio Unitario
              </span>
              <div className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-cyan-300 tracking-tight">
                {formatCurrency(Number(product.price))}
              </div>
            </div>

            <div className="text-right">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
                  <AlertCircle className="w-3 h-3" />
                  Agotado
                </span>
              ) : (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Stock: {product.stock} disp.
                </span>
              )}
            </div>
          </div>

          {/* Botón "+ Agregar a Proforma" */}
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${
              isOutOfStock
                ? 'bg-purple-950/20 text-purple-400/40 cursor-not-allowed border border-purple-950/40'
                : isAdding
                ? 'bg-emerald-600 text-white scale-[0.98]'
                : 'bg-[#1b1136] hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-purple-200 hover:text-white border border-purple-800/60 hover:border-purple-500 active:scale-[0.98] shadow-md shadow-purple-950/50'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4 text-white" />
                ¡Agregado!
              </>
            ) : isOutOfStock ? (
              'Sin Stock'
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Agregar a Proforma
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
