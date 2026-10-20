'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export function HeroBanner() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/catalogo');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-2">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos por nombre, marca o modelo (ej. Silla Gamer, Mesa RGB, RTX 4060...)"
            className="w-full pl-12 pr-10 py-3.5 bg-[#130b29] border border-purple-800/70 rounded-2xl text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm shadow-lg transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
              title="Borrar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-bold rounded-2xl text-sm transition-all shadow-md shadow-purple-950/40 shrink-0"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
