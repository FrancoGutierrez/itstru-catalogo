'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import {
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Package,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onRefresh: () => void;
}

export function ProductTable({ products, onEdit, onRefresh }: ProductTableProps) {
  const [search, setSearch] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  // Alternar estado activo / pausado
  const handleToggleActive = async (product: Product) => {
    const newStatus = !product.is_active;
    if (supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .update({ is_active: newStatus })
          .eq('id', product.id);
        if (error) throw error;
        onRefresh();
      } catch (e) {
        alert('Error al actualizar estado en Supabase: ' + (e as Error).message);
      }
    } else {
      product.is_active = newStatus;
      onRefresh();
    }
  };

  // Guardar edición rápida de precio
  const handleSavePrice = async (productId: string) => {
    const numPrice = parseFloat(tempPrice);
    if (isNaN(numPrice) || numPrice < 0) {
      alert('Ingresa un precio válido');
      return;
    }

    setIsUpdating(true);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .update({ price: numPrice })
          .eq('id', productId);
        if (error) throw error;
        setEditingPriceId(null);
        onRefresh();
      } catch (e) {
        alert('Error al guardar precio: ' + (e as Error).message);
      } finally {
        setIsUpdating(false);
      }
    } else {
      const p = products.find((item) => item.id === productId);
      if (p) p.price = numPrice;
      setEditingPriceId(null);
      setIsUpdating(false);
      onRefresh();
    }
  };

  // Eliminar producto
  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Confirmas que deseas eliminar el producto "${product.name}" (${product.sku})?`)) {
      return;
    }

    if (supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', product.id);
        if (error) throw error;
        onRefresh();
      } catch (e) {
        alert('Error al eliminar en Supabase: ' + (e as Error).message);
      }
    } else {
      const idx = products.findIndex((p) => p.id === product.id);
      if (idx > -1) products.splice(idx, 1);
      onRefresh();
    }
  };

  return (
    <div className="bg-[#130b29]/95 rounded-3xl border border-purple-900/60 shadow-xl shadow-purple-950/40 overflow-hidden space-y-4 backdrop-blur-sm">
      {/* Barra de Búsqueda de Productos en Admin */}
      <div className="p-4 sm:p-6 border-b border-purple-900/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white">
            Catálogo Oficial its tru ({products.length})
          </h3>
          <p className="text-xs text-purple-300/60">
            Administra precios en Soles, existencias y estado de publicación
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, SKU o categoría..."
            className="w-full pl-9 pr-4 py-2 bg-[#090417] border border-purple-900/80 rounded-xl text-xs sm:text-sm text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0e0720] text-purple-200/80 font-bold uppercase text-[10px] tracking-wider border-b border-purple-900/50">
              <th className="py-3 px-4">Producto / SKU</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4">Precio (S/.)</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-950/50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-purple-400/50">
                  No se encontraron productos coincidentes.
                </td>
              </tr>
            ) : (
              filtered.map((product) => {
                const isEditingPrice = editingPriceId === product.id;

                return (
                  <tr key={product.id} className="hover:bg-purple-950/20 transition-colors">
                    {/* Producto */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-[#090417] overflow-hidden shrink-0 border border-purple-900/60 p-1">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-purple-400/40">
                              <Package className="w-5 h-5 stroke-1" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white leading-snug truncate max-w-xs sm:max-w-md">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[11px] font-bold text-purple-300 bg-purple-950/60 border border-purple-800/60 px-1.5 py-0.5 rounded">
                              {product.sku}
                            </span>
                            {product.is_offer && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-800/60">
                                Oferta
                              </span>
                            )}
                            {product.is_new && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60">
                                Nuevo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="py-3.5 px-4 text-purple-200 font-medium">
                      {product.category}
                    </td>

                    {/* Precio Editable */}
                    <td className="py-3.5 px-4 font-bold">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            step="0.01"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="w-20 px-2 py-1 bg-[#090417] border border-purple-400 rounded-lg text-xs font-bold text-white focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePrice(product.id)}
                            disabled={isUpdating}
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                            title="Guardar"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="p-1 rounded bg-purple-950 text-purple-300 hover:bg-purple-900"
                            title="Cancelar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/price">
                          <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-cyan-300">
                            {formatCurrency(Number(product.price))}
                          </span>
                          <button
                            onClick={() => {
                              setEditingPriceId(product.id);
                              setTempPrice(String(product.price));
                            }}
                            className="opacity-0 group-hover/price:opacity-100 p-1 text-purple-400 hover:text-purple-300 transition-opacity"
                            title="Editar precio rápido"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${product.stock <= 5 ? 'text-rose-400 font-black' : 'text-emerald-400'}`}>
                        {product.stock} un.
                      </span>
                    </td>

                    {/* Estado Activo */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          product.is_active
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                            : 'bg-purple-950/60 text-purple-400/60 border border-purple-900/60'
                        }`}
                      >
                        {product.is_active ? (
                          <>
                            <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
                            Activo
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-3.5 h-3.5 text-purple-400/60" />
                            Pausado
                          </>
                        )}
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-1.5 rounded-lg bg-purple-950/60 text-purple-300 hover:bg-purple-900/80 hover:text-white border border-purple-800/60 transition-colors"
                          title="Editar producto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-1.5 rounded-lg bg-purple-950/60 text-rose-400 hover:bg-rose-950/80 hover:text-rose-300 border border-purple-800/60 transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
