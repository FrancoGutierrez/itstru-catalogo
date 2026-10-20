'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProforma } from '@/context/ProformaContext';
import { formatCurrency } from '@/lib/utils';
import { Plus, Minus, Trash2, ArrowLeft, ShoppingBag, Package } from 'lucide-react';

export function ProformaTable() {
  const { items, updateQuantity, removeItem, clearProforma } = useProforma();

  if (items.length === 0) {
    return (
      <div className="bg-[#130b29]/95 rounded-3xl border border-purple-900/60 p-12 text-center shadow-xl shadow-purple-950/40 backdrop-blur-sm">
        <div className="w-20 h-20 bg-purple-950/60 text-purple-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-purple-800/60 shadow-lg shadow-purple-950/50">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-white">Tu proforma está vacía</h3>
        <p className="text-purple-300/70 text-sm max-w-md mx-auto mt-2 mb-6">
          Explora nuestro catálogo oficial its tru de hardware gamer, sillas ergonómicas y componentes para armar tu cotización.
        </p>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md shadow-purple-600/30"
        >
          <ArrowLeft className="w-4 h-4" />
          Ver Catálogo de Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#130b29]/95 rounded-3xl border border-purple-900/60 shadow-xl shadow-purple-950/40 overflow-hidden backdrop-blur-sm">
      {/* Encabezado de la tabla */}
      <div className="p-4 sm:p-6 border-b border-purple-900/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white">
            Productos Seleccionados ({items.length})
          </h2>
          <p className="text-xs text-purple-300/60 mt-0.5">
            Ajusta las cantidades o retira productos de tu lista
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('¿Estás seguro de que deseas vaciar todos los productos de la proforma?')) {
              clearProforma();
            }
          }}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-rose-950/40 border border-rose-900/40 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Vaciar Lista
        </button>
      </div>

      {/* Lista de productos */}
      <div className="divide-y divide-purple-950/60">
        {items.map((item) => {
          const { product, quantity, unitPrice, subtotal } = item;
          return (
            <div
              key={product.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-purple-950/30 transition-colors"
            >
              {/* Info de Producto + Foto */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#090417] overflow-hidden shrink-0 border border-purple-900/60 p-2">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-purple-400/40">
                      <Package className="w-6 h-6 stroke-1" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60">
                      {product.sku}
                    </span>
                    <span className="text-xs text-purple-400/50 hidden sm:inline">•</span>
                    <span className="text-xs text-purple-300/70 hidden sm:inline">
                      {product.category}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 leading-snug truncate">
                    {product.name}
                  </h4>

                  <div className="text-xs text-purple-200/60 mt-0.5">
                    Precio unitario: <strong className="text-purple-300">{formatCurrency(unitPrice)}</strong>
                  </div>
                </div>
              </div>

              {/* Controles de Cantidad y Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-purple-900/40">
                {/* Selector de cantidad */}
                <div className="flex items-center border border-purple-800/80 rounded-xl bg-[#090417] shadow-inner overflow-hidden">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-2 text-purple-300 hover:bg-purple-900/40 hover:text-white transition-colors"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock || 999}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) updateQuantity(product.id, val);
                    }}
                    className="w-12 text-center font-bold text-xs text-white bg-transparent focus:outline-none py-1"
                  />
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-2 text-purple-300 hover:bg-purple-900/40 hover:text-white transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal del item */}
                <div className="text-right min-w-[90px]">
                  <span className="text-[10px] uppercase font-bold text-purple-300/60 block">
                    Subtotal
                  </span>
                  <div className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-cyan-300">
                    {formatCurrency(subtotal)}
                  </div>
                </div>

                {/* Botón eliminar */}
                <button
                  onClick={() => removeItem(product.id)}
                  className="p-2 text-purple-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors border border-transparent hover:border-rose-900/40"
                  title="Eliminar de la proforma"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
