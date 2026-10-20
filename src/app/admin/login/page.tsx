'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Layers, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // 1. Si Supabase está conectado, intentar Supabase Auth
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          // Si falla en Supabase pero coincide con la clave maestra local, permitir acceso
          if (password === 'admin123' || password === process.env.NEXT_PUBLIC_ADMIN_PIN) {
            localStorage.setItem('cotiperu_admin_session', 'master_token');
            router.push('/admin');
            return;
          }
          throw error;
        }

        if (data.session) {
          localStorage.setItem('cotiperu_admin_session', data.session.access_token);
          router.push('/admin');
          return;
        }
      } catch (err: unknown) {
        setErrorMessage((err as Error).message || 'Credenciales incorrectas');
        setIsLoading(false);
        return;
      }
    } else {
      // 2. Modo demostración / local: Acceso con credencial maestra
      if (password === 'admin123' || password === 'admin') {
        localStorage.setItem('cotiperu_admin_session', 'demo_master_token');
        router.push('/admin');
        return;
      } else {
        setErrorMessage('Contraseña incorrecta. (Prueba con "admin123" para acceso demo)');
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Panel de Administración
          </h2>
          <p className="text-xs text-slate-500">
            Acceso seguro para gestión del catálogo de productos y proformas
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Correo Electrónico (Supabase Auth o Demo)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cotiperu.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            Entrar directamente al Panel (Sin Clave)
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-800">
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}
