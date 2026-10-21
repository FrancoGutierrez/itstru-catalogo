'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  Layers,
  KeyRound,
} from 'lucide-react';

export default function RestrictedLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Limpiar cualquier token legacy al cargar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cotiperu_admin_session');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setErrorMessage('Ingresa tus credenciales autorizadas.');
      setIsLoading(false);
      return;
    }

    try {
      // Autenticación estricta con Supabase Auth (solo usuarios creados previamente)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        router.push('/panel-privado-x72');
        return;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error de autenticación';
      if (msg.includes('Invalid login credentials')) {
        setErrorMessage('Acceso denegado: Correo o contraseña incorrectos.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#130b29]/95 backdrop-blur-xl rounded-3xl border border-purple-800/80 p-8 shadow-2xl shadow-purple-950/60 space-y-6 text-white">
        {/* Cabecera de Seguridad */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#090417] text-purple-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-950/50 border border-purple-800/80">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Acceso Restringido
          </h2>
          <p className="text-xs text-purple-300/60">
            Autenticación de personal autorizado its tru
          </p>
        </div>

        {/* Mensaje de Error */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulario de Login Estricto (Sin registro público) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">
              Correo Institucional
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@itstruvan.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Verificando con Supabase...' : 'Ingresar al Panel'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-purple-900/50">
          <Link href="/" className="text-xs text-purple-300/60 hover:text-purple-200 flex items-center justify-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Volver a la Tienda Oficial
          </Link>
        </div>
      </div>
    </div>
  );
}
