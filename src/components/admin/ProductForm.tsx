'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Category, Product } from '@/types';
import { uploadProductImage, supabase } from '@/lib/supabase/client';
import {
  Upload,
  X,
  Package,
  Check,
  AlertCircle,
  Plus,
  Loader2,
  Tag,
  Sparkles,
} from 'lucide-react';

interface ProductFormProps {
  categories: Category[];
  initialProduct?: Product | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function ProductForm({
  categories,
  initialProduct,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const isEditing = Boolean(initialProduct);

  const [sku, setSku] = useState(initialProduct?.sku || '');
  const [name, setName] = useState(initialProduct?.name || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [price, setPrice] = useState(initialProduct ? String(initialProduct.price) : '');
  const [category, setCategory] = useState(initialProduct?.category || (categories[0]?.name || 'Mobiliario & Sillas Gamer'));
  const [stock, setStock] = useState(initialProduct ? String(initialProduct.stock) : '10');
  const [imageUrl, setImageUrl] = useState(initialProduct?.image_url || '');

  const [isOffer, setIsOffer] = useState(initialProduct?.is_offer || false);
  const [isNew, setIsNew] = useState(initialProduct?.is_new || false);
  const [isFeatured, setIsFeatured] = useState(initialProduct?.is_featured || false);
  const [isActive, setIsActive] = useState(initialProduct ? initialProduct.is_active : true);

  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialProduct?.image_url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('La imagen no debe superar los 5MB.');
        return;
      }
      setFileToUpload(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const numPrice = parseFloat(price);
    const numStock = parseInt(stock, 10);

    if (isNaN(numPrice) || numPrice < 0) {
      setErrorMessage('Por favor ingresa un precio válido en Soles.');
      return;
    }

    if (isNaN(numStock) || numStock < 0) {
      setErrorMessage('Por favor ingresa un stock válido.');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = imageUrl;

      // 1. Subida de imagen al bucket 'product-images' de Supabase Storage
      if (fileToUpload) {
        try {
          finalImageUrl = await uploadProductImage(fileToUpload);
        } catch (uploadErr: unknown) {
          console.error('Error al subir imagen a Supabase Storage:', uploadErr);
          throw new Error(`Error en Storage: ${uploadErr instanceof Error ? uploadErr.message : 'No se pudo subir la imagen al bucket product-images'}`);
        }
      }

      // Buscar el category_id correspondiente
      const foundCategory = categories.find((c) => c.name === category);
      const categoryId = foundCategory?.id || null;

      // Si no se especificó SKU, generar uno automáticamente
      const finalSku = sku.trim().toUpperCase() || `TRU-${Date.now().toString().slice(-6)}`;

      const productPayload = {
        sku: finalSku,
        name: name.trim(),
        description: description.trim() || null,
        price: numPrice,
        category,
        category_id: categoryId,
        stock: numStock,
        image_url: finalImageUrl || null,
        is_offer: isOffer,
        is_new: isNew,
        is_featured: isFeatured,
        is_active: isActive,
      };

      if (supabase) {
        if (isEditing && initialProduct) {
          const { error } = await supabase
            .from('products')
            .update(productPayload)
            .eq('id', initialProduct.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('products')
            .insert([productPayload]);
          if (error) throw error;
        }
      } else {
        console.log('Modo local: Guardando producto simulado:', productPayload);
      }

      setSuccessMessage(isEditing ? '¡Producto actualizado con éxito!' : '¡Producto creado con éxito!');
      setTimeout(() => {
        onSuccess();
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el producto.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#130b29]/95 rounded-3xl border border-purple-900/60 p-6 sm:p-8 shadow-xl shadow-purple-950/40 space-y-6 text-white backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-purple-900/40 pb-4">
        <div>
          <h3 className="text-lg font-black text-white">
            {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto en its tru'}
          </h3>
          <p className="text-xs text-purple-300/60 mt-0.5">
            Ingresa la información técnica, precios en Soles e imagen para el catálogo oficial
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-purple-400 hover:text-white rounded-xl hover:bg-purple-950/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna Izquierda: Datos Principales */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">
              Nombre Comercial del Producto <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Silla Gaming GamePro GP1001 / Tarjeta RTX 4060 Ti"
              className="w-full px-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">
                Código / SKU <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SIL-GPR-1001"
                className="w-full px-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-sm uppercase font-mono focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">
                Categoría <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-400 font-semibold text-white cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id || c.name} value={c.name} className="bg-[#0e0720]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">
                Precio Unitario (S/.) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="389.00"
                className="w-full px-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">
                Stock Disponible <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="7"
                className="w-full px-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">
              Descripción Técnica y Características
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalla las especificaciones técnicas, materiales, reclinación, iluminación RGB, etc..."
              className="w-full px-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300/40"
            />
          </div>
        </div>

        {/* Columna Derecha: Imagen y Etiquetas */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">
              Imagen del Producto
            </label>

            <div className="border-2 border-dashed border-purple-900/80 hover:border-purple-500/70 rounded-2xl p-4 text-center bg-[#090417] transition-colors">
              {previewUrl ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3 bg-[#0e0720] flex items-center justify-center p-2">
                  <Image
                    src={previewUrl}
                    alt="Vista previa"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFileToUpload(null);
                      setPreviewUrl('');
                      setImageUrl('');
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/80 text-white rounded-full flex items-center justify-center hover:bg-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center">
                  <Upload className="w-8 h-8 text-purple-400 mb-2" />
                  <p className="text-xs font-semibold text-purple-200">
                    Sube una foto desde tu dispositivo
                  </p>
                  <p className="text-[11px] text-purple-300/40 mt-0.5">
                    JPG, PNG o WebP hasta 5MB
                  </p>
                </div>
              )}

              <input
                type="file"
                id="product-image-file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="product-image-file"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:from-purple-500 hover:to-indigo-500 cursor-pointer shadow-md shadow-purple-600/30 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                {previewUrl ? 'Cambiar Imagen' : 'Seleccionar Archivo'}
              </label>
            </div>

            {/* O bien ingresar URL directa */}
            <div className="mt-2">
              <span className="text-[10px] text-purple-300/50 block mb-0.5">
                O ingresa una URL web directa:
              </span>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
                placeholder="https://ejemplo.com/foto-producto.jpg"
                className="w-full px-3 py-1.5 bg-[#090417] border border-purple-900/80 rounded-xl text-xs font-mono text-white placeholder-purple-300/40"
              />
            </div>
          </div>

          {/* Opciones y Estados (Destacado, Oferta, Novedad, Activo) */}
          <div className="bg-[#090417] p-4 rounded-2xl border border-purple-900/80 space-y-2.5">
            <span className="text-xs font-bold text-purple-200 block mb-2">
              Etiquetas y Visibilidad:
            </span>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="flag-offer"
                  checked={isOffer}
                  onChange={(e) => setIsOffer(e.target.checked)}
                  className="w-4 h-4 text-fuchsia-600 rounded focus:ring-fuchsia-500 cursor-pointer accent-fuchsia-600"
                />
                <label htmlFor="flag-offer" className="text-xs text-purple-200 font-semibold cursor-pointer select-none">
                  Marcar como Oferta Destacada
                </label>
              </div>
              <Tag className="w-3.5 h-3.5 text-fuchsia-400" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="flag-new"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 text-purple-500 rounded focus:ring-purple-400 cursor-pointer accent-purple-500"
                />
                <label htmlFor="flag-new" className="text-xs text-purple-200 font-semibold cursor-pointer select-none">
                  Marcar como Novedad
                </label>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="flag-featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-indigo-500 rounded focus:ring-indigo-400 cursor-pointer accent-indigo-500"
                />
                <label htmlFor="flag-featured" className="text-xs text-purple-200 font-semibold cursor-pointer select-none">
                  Destacar en Portada
                </label>
              </div>
              <Package className="w-3.5 h-3.5 text-indigo-400" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-purple-900/60">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="flag-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400 cursor-pointer accent-emerald-500"
                />
                <label htmlFor="flag-active" className="text-xs font-bold text-white cursor-pointer select-none">
                  Producto Activo para Venta (Visible al público)
                </label>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-purple-950 text-purple-400 border border-purple-900'}`}>
                {isActive ? 'Activo' : 'Pausado'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Envío */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-900/50">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-purple-800/80 text-xs font-bold text-purple-300 hover:bg-purple-950/60 transition-colors"
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : isEditing ? (
            <>
              <Check className="w-4 h-4" />
              Actualizar Producto
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Publicar Producto
            </>
          )}
        </button>
      </div>
    </form>
  );
}
