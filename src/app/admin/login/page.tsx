'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  LogIn,
  Layers,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        // 1. Iniciar sesión mediante Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          // Fallback a clave maestra demo si las credenciales de Supabase no están creadas
          if (password === 'admin123' || password === process.env.NEXT_PUBLIC_ADMIN_PIN) {
            localStorage.setItem('cotiperu_admin_session', 'demo_master_token');
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
      } else {
        // 2. Registro de nuevo administrador en Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { role: 'admin' },
          },
        });

        if (error) throw error;

        if (data.session) {
          localStorage.setItem('cotiperu_admin_session', data.session.access_token);
          setSuccessMessage('¡Cuenta creada e inicio de sesión exitoso! Redirigiendo...');
          setTimeout(() => {
            router.push('/admin');
          }, 1000);
          return;
        } else if (data.user) {
          setSuccessMessage('Usuario registrado con éxito en Supabase Auth. Ya puedes iniciar sesión con tu contraseña.');
          setMode('login');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error de autenticación';
      // Traducción amigable de errores comunes de Supabase
      if (msg.includes('Invalid login credentials')) {
        setErrorMessage('Credenciales incorrectas. Verifica tu correo y contraseña, o regístrate.');
      } else if (msg.includes('Email not confirmed')) {
        setErrorMessage('El correo no ha sido confirmado en Supabase. Si confirmación de correo está activada, revisa tu bandeja.');
      } else if (msg.includes('User already registered')) {
        setErrorMessage('Este correo ya está registrado en Supabase. Por favor inicia sesión.');
        setMode('login');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    localStorage.setItem('cotiperu_admin_session', 'demo_master_token');
    router.push('/admin');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#130b29]/95 backdrop-blur-xl rounded-3xl border border-purple-800/80 p-8 shadow-2xl shadow-purple-950/60 space-y-6 text-white">
        {/* Cabecera con Logo e Icono */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-900/50 border border-purple-400/40">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Panel de Administración its tru
          </h2>
          <p className="text-xs text-purple-300/60">
            {mode === 'login'
              ? 'Acceso protegido mediante Supabase Auth'
              : 'Crear cuenta de administrador en Supabase'}
          </p>
        </div>

        {/* Toggle Modo: Iniciar Sesión vs Registrar Admin */}
        <div className="grid grid-cols-2 p-1 bg-[#090417] rounded-xl border border-purple-900/60">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Registrar Admin
          </button>
        </div>

        {/* Notificaciones */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@itstruvan.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">
              Contraseña {mode === 'register' && <span className="text-purple-400/70 font-normal">(mínimo 6 caracteres)</span>}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
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
            {isLoading
              ? 'Verificando con Supabase...'
              : mode === 'login'
              ? 'Iniciar Sesión'
              : 'Crear Usuario Administrador'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleDemoAccess}
            className="w-full py-2.5 rounded-xl bg-[#0e0720] hover:bg-purple-950/60 text-purple-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-purple-900/60 transition-all"
          >
            Entrar en Modo Local / Demo
          </button>
        </form>

        <div className="text-center pt-2 border-t border-purple-900/50">
          <Link href="/" className="text-xs text-purple-300/60 hover:text-purple-200 flex items-center justify-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Volver a la Tienda & Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
