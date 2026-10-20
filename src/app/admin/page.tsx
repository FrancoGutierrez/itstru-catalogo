'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category, CompanySettings, Product } from '@/types';
import { getProducts, getCategories, getCompanySettings, supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { ProductTable } from '@/components/admin/ProductTable';
import { ProductForm } from '@/components/admin/ProductForm';
import { SettingsForm } from '@/components/admin/SettingsForm';
import {
  Plus,
  Package,
  Settings,
  LogOut,
  ShieldCheck,
  Database,
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [activeTab, setActiveTab] = useState<'products' | 'create' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Permitir acceso directo al panel para demostración
  useEffect(() => {
    setIsAuthenticated(true);
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats, settings] = await Promise.all([
        getProducts({ onlyActive: false }),
        getCategories(),
        getCompanySettings(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setCompanySettings(settings);
    } catch (e) {
      console.error('Error cargando datos de admin:', e);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-purple-300 uppercase tracking-wider">
          Cargando Panel its tru...
        </p>
      </div>
    );
  }

  // Métricas rápidas
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_active).length;
  const pausedProducts = products.filter((p) => !p.is_active).length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const hasSupabase = isSupabaseConfigured();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Barra Superior de Admin */}
      <div className="bg-gradient-to-br from-[#160d33] via-[#0f0824] to-[#0a0518] text-white rounded-3xl p-6 sm:p-8 border border-purple-800/80 shadow-2xl shadow-purple-950/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Sesión Activa
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${hasSupabase ? 'bg-indigo-950 text-indigo-300 border-indigo-800' : 'bg-purple-950/60 text-purple-300 border-purple-800/60'}`}>
              <Database className="w-3 h-3 inline mr-1 text-purple-400" />
              {hasSupabase ? 'Supabase PostgreSQL' : 'Catálogo Activo Local'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Panel de Administración its tru
          </h1>
          <p className="text-xs text-purple-300/60">
            Administra los productos oficiales, sillas gamer, hardware y configura los datos de proforma
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setEditingProduct(null);
              setActiveTab('create');
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Nuevo Producto
          </button>

          <button
            onClick={() => router.push('/')}
            className="px-4 py-2.5 rounded-xl bg-[#140b2a] hover:bg-purple-950/60 text-purple-200 font-semibold text-xs flex items-center gap-2 border border-purple-800/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Ir a la Tienda
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#130b29]/95 p-5 rounded-2xl border border-purple-900/60 shadow-lg shadow-purple-950/40">
          <span className="text-xs font-bold text-purple-300/60 uppercase tracking-wider block">
            Total Productos
          </span>
          <div className="text-2xl font-black text-white mt-1">{totalProducts}</div>
          <span className="text-[11px] text-purple-300/40 mt-0.5 block">En la base de datos</span>
        </div>

        <div className="bg-[#130b29]/95 p-5 rounded-2xl border border-purple-900/60 shadow-lg shadow-purple-950/40">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
            Productos Activos
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{activeProducts}</div>
          <span className="text-[11px] text-purple-300/40 mt-0.5 block">Disponibles en el catálogo</span>
        </div>

        <div className="bg-[#130b29]/95 p-5 rounded-2xl border border-purple-900/60 shadow-lg shadow-purple-950/40">
          <span className="text-xs font-bold text-purple-400/60 uppercase tracking-wider block">
            Productos Pausados
          </span>
          <div className="text-2xl font-black text-purple-300/60 mt-1">{pausedProducts}</div>
          <span className="text-[11px] text-purple-300/40 mt-0.5 block">Ocultos para clientes</span>
        </div>

        <div className="bg-[#130b29]/95 p-5 rounded-2xl border border-purple-900/60 shadow-lg shadow-purple-950/40">
          <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider block">
            Stock Bajo (&le; 5)
          </span>
          <div className="text-2xl font-black text-fuchsia-400 mt-1">{lowStockCount}</div>
          <span className="text-[11px] text-purple-300/40 mt-0.5 block">Requieren reposición</span>
        </div>
      </div>

      {/* Tabs de Navegación del Panel */}
      <div className="flex border-b border-purple-900/50 gap-2">
        <button
          onClick={() => {
            setEditingProduct(null);
            setActiveTab('products');
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'products'
              ? 'border-purple-400 text-purple-300'
              : 'border-transparent text-purple-300/50 hover:text-purple-200'
          }`}
        >
          <Package className="w-4 h-4" />
          Listado & CRUD de Productos
        </button>

        <button
          onClick={() => {
            setEditingProduct(null);
            setActiveTab('create');
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'create'
              ? 'border-purple-400 text-purple-300'
              : 'border-transparent text-purple-300/50 hover:text-purple-200'
          }`}
        >
          <Plus className="w-4 h-4" />
          {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </button>

        <button
          onClick={() => {
            setEditingProduct(null);
            setActiveTab('settings');
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'border-purple-400 text-purple-300'
              : 'border-transparent text-purple-300/50 hover:text-purple-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          Configuración Empresa & WhatsApp
        </button>
      </div>

      {/* Contenido Dinámico por Pestaña */}
      {activeTab === 'products' && (
        <ProductTable
          products={products}
          onEdit={(product) => {
            setEditingProduct(product);
            setActiveTab('create');
          }}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'create' && (
        <ProductForm
          categories={categories}
          initialProduct={editingProduct}
          onSuccess={() => {
            setEditingProduct(null);
            setActiveTab('products');
            loadData();
          }}
          onCancel={() => {
            setEditingProduct(null);
            setActiveTab('products');
          }}
        />
      )}

      {activeTab === 'settings' && companySettings && (
        <SettingsForm initialSettings={companySettings} />
      )}
    </div>
  );
}
