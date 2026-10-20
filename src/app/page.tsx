import React from 'react';
import Link from 'next/link';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedGrid } from '@/components/home/FeaturedGrid';
import { getProducts, getCategories } from '@/lib/supabase/client';
import {
  FileCheck2,
  MessageCircle,
  Truck,
  ShieldCheck,
  ArrowRight,
  Layers,
  Wrench,
  Laptop,
  Monitor,
  Cpu,
  Keyboard,
  Armchair,
} from 'lucide-react';

export const revalidate = 60; // Regenerar cada 60s si se usa ISR

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts({ onlyActive: true }),
    getCategories(),
  ]);

  const iconMap: Record<string, React.ReactNode> = {
    Armchair: <Armchair className="w-6 h-6 text-purple-400" />,
    Laptop: <Laptop className="w-6 h-6 text-cyan-400" />,
    Monitor: <Monitor className="w-6 h-6 text-indigo-400" />,
    Cpu: <Cpu className="w-6 h-6 text-fuchsia-400" />,
    Keyboard: <Keyboard className="w-6 h-6 text-purple-300" />,
    Wrench: <Wrench className="w-6 h-6 text-emerald-400" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* 1. Buscador Normal */}
      <HeroBanner />

      {/* 2. Categorías Principales */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Explorar por Categoría
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/60">
              Encuentra sillas gamer ergonómicas, componentes y soluciones informáticas
            </p>
          </div>

          <Link
            href="/catalogo"
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 group"
          >
            Ver todas
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              href={`/catalogo?categoria=${encodeURIComponent(cat.name)}`}
              className="p-5 rounded-2xl bg-[#130b29]/95 border border-purple-900/60 shadow-lg shadow-purple-950/40 hover:border-purple-500/70 hover:shadow-xl hover:shadow-purple-900/30 transition-all flex flex-col items-center text-center group backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-950/50 group-hover:bg-purple-900/60 border border-purple-800/40 group-hover:border-purple-500/60 flex items-center justify-center transition-all mb-3 group-hover:scale-110">
                {iconMap[cat.icon || 'Hammer'] || <Layers className="w-6 h-6 text-purple-400" />}
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-100 group-hover:text-purple-300 transition-colors">
                {cat.name}
              </h3>
              {cat.description && (
                <p className="text-[11px] text-purple-200/50 line-clamp-1 mt-1">
                  {cat.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Grilla de Novedades y Ofertas */}
      <FeaturedGrid products={products} />

      {/* 4. Garantías Comerciales */}
      <section className="bg-[#100824] text-white rounded-2xl p-5 sm:p-6 border border-purple-900/50 shadow-lg shadow-purple-950/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-950/20 border border-purple-900/40">
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Garantía Directa</h4>
              <p className="text-[11px] text-purple-200/60 mt-0.5 leading-snug">
                Productos 100% originales con respaldo de fábrica.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-950/20 border border-purple-900/40">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Envíos a Todo el Perú</h4>
              <p className="text-[11px] text-purple-200/60 mt-0.5 leading-snug">
                Despachos rápidos por Shalom, Marvisur y Olva.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-950/20 border border-purple-900/40">
            <div className="w-9 h-9 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center shrink-0 border border-fuchsia-500/30">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Facturación SUNAT</h4>
              <p className="text-[11px] text-purple-200/60 mt-0.5 leading-snug">
                Factura o Boleta con R.U.C. y desglose de IGV.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-950/20 border border-purple-900/40">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Soporte Técnico</h4>
              <p className="text-[11px] text-purple-200/60 mt-0.5 leading-snug">
                Atención comercial y asesoría en hardware its tru.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
