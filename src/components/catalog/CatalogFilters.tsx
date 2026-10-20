'use client';

import React from 'react';
import { Category } from '@/types';
import { Search, X, Tag, Sparkles } from 'lucide-react';

interface CatalogFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onlyOffers: boolean;
  onToggleOffers: () => void;
  onlyNew: boolean;
  onToggleNew: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalFiltered: number;
}

export function CatalogFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onlyOffers,
  onToggleOffers,
  onlyNew,
  onToggleNew,
  sortBy,
  onSortChange,
  totalFiltered,
}: CatalogFiltersProps) {
  return (
    <div className="bg-[#130b29]/95 rounded-2xl border border-purple-900/60 p-4 sm:p-5 shadow-xl shadow-purple-950/40 space-y-4 backdrop-blur-sm">
      {/* Barra de Búsqueda y Ordenamiento */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Input de Búsqueda */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, código SKU o descripción..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all text-slate-100 placeholder-purple-300/40"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtros rápidos: Ofertas, Novedades y Orden */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={onToggleOffers}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap border ${
              onlyOffers
                ? 'bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white border-fuchsia-400 shadow-md shadow-fuchsia-950/50'
                : 'bg-purple-950/40 text-purple-300 border-purple-900/60 hover:bg-purple-900/40'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Ofertas
          </button>

          <button
            onClick={onToggleNew}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap border ${
              onlyNew
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md shadow-purple-950/50'
                : 'bg-purple-950/40 text-purple-300 border-purple-900/60 hover:bg-purple-900/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Novedades
          </button>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 bg-[#090417] border border-purple-900/80 rounded-xl text-xs font-medium text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
          >
            <option value="featured" className="bg-[#0e0720]">Destacados</option>
            <option value="price-asc" className="bg-[#0e0720]">Precio: Menor a Mayor</option>
            <option value="price-desc" className="bg-[#0e0720]">Precio: Mayor a Menor</option>
            <option value="name-asc" className="bg-[#0e0720]">Nombre (A - Z)</option>
            <option value="stock-desc" className="bg-[#0e0720]">Mayor Stock Disponible</option>
          </select>
        </div>
      </div>

      {/* Chips de Categorías */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/60 shadow-md shadow-purple-600/30'
              : 'bg-purple-950/40 text-purple-300/80 border-purple-900/50 hover:bg-purple-900/40 hover:text-white'
          }`}
        >
          Todas las Categorías
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.id || cat.slug}
              onClick={() => onSelectCategory(cat.name)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/60 shadow-md shadow-purple-600/30'
                  : 'bg-purple-950/40 text-purple-300/80 border-purple-900/50 hover:bg-purple-900/40 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between text-xs text-purple-300/60 pt-2 border-t border-purple-900/40">
        <span>
          Mostrando <strong className="text-purple-200 font-extrabold">{totalFiltered}</strong> productos disponibles
        </span>

        {(selectedCategory !== 'all' || searchQuery || onlyOffers || onlyNew) && (
          <button
            onClick={() => {
              onSelectCategory('all');
              onSearchChange('');
              if (onlyOffers) onToggleOffers();
              if (onlyNew) onToggleNew();
            }}
            className="text-purple-400 hover:text-purple-300 font-bold transition-colors"
          >
            Limpiar todos los filtros
          </button>
        )}
      </div>
    </div>
  );
}
