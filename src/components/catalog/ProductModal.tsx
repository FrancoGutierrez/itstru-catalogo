'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useProforma } from '@/context/ProformaContext';
import { formatCurrency } from '@/lib/utils';
import { X, Plus, Minus, Check, Package, Sparkles, Tag, ShieldCheck } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useProforma();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    setIsAdding(true);
    addItem(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#140b2a] rounded-3xl shadow-2xl shadow-purple-950/80 border border-purple-800/80 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-white flex items-center justify-center transition-colors border border-purple-700/60"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Imagen del Producto */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-[#0a0518] flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-purple-900/60">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-4"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-purple-400/40">
              <Package className="w-16 h-16 stroke-1" />
              <span className="text-xs mt-2 text-purple-300/40">Sin Imagen</span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_offer && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white shadow-md">
                Oferta
              </span>
            )}
            {product.is_new && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md">
                Novedad
              </span>
            )}
          </div>
        </div>

        {/* Detalles y Acciones */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/60 text-xs font-bold">
                {product.category}
              </span>
              <span className="text-xs font-mono text-purple-300/60">
                SKU: {product.sku}
              </span>
            </div>

            <h2 className="text-lg font-black text-white leading-snug">
              {product.name}
            </h2>

            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-cyan-300">
              {formatCurrency(Number(product.price))}
            </div>

            <p className="text-xs text-purple-200/70 leading-relaxed border-t border-b border-purple-900/50 py-3">
              {product.description || 'Sin descripción adicional disponible para este modelo.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-purple-200/70">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Garantía de fábrica 100% original its tru.</span>
            </div>

            <div className="text-xs text-purple-300/80">
              Disponibilidad:{' '}
              <span className="font-bold text-emerald-400">
                {product.stock > 0 ? `${product.stock} unidades en almacén` : 'Agotado temporalmente'}
              </span>
            </div>
          </div>

          {/* Cantidad y Agregar */}
          <div className="pt-4 mt-4 border-t border-purple-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-200">Cantidad a proformar:</span>
              <div className="flex items-center border border-purple-800/80 rounded-xl overflow-hidden bg-[#090417]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-purple-300 hover:bg-purple-900/50 hover:text-white transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-3.5 py-1 font-bold text-xs text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="px-3 py-1 text-purple-300 hover:bg-purple-900/50 hover:text-white transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                isAdding
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-4 h-4" />
                  Agregado a la Proforma
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Agregar {quantity > 1 ? `(${quantity}) ` : ''}a Proforma
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
