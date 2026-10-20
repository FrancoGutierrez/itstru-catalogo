'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useProforma } from '@/context/ProformaContext';
import { formatCurrency } from '@/lib/utils';
import {
  FileText,
  Package,
  Home,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, total } = useProforma();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Inicio / Novedades', icon: Home },
    { href: '/catalogo', label: 'Catálogo Gaming & TI', icon: Package },
    { href: '/proforma', label: 'Cotizador / Proforma', icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0e0a24]/95 backdrop-blur-md border-b border-purple-900/50 text-white no-print shadow-xl shadow-purple-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Oficial its tru */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/30 group-hover:ring-purple-400 group-hover:scale-105 transition-all duration-300 bg-black flex items-center justify-center shrink-0">
              <Image
                src="/images/itstru-logo.jpg"
                alt="its tru Logo"
                width={48}
                height={48}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div>
              <span className="font-black text-2xl tracking-wider text-white group-hover:text-purple-300 transition-colors lowercase">
                its tru
              </span>
              <p className="text-[11px] text-purple-200/70 hidden sm:block tracking-wide">
                Hardware Gamer
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${active
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-purple-400' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Proforma Floating Counter + Admin Button */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Contador flotante de la proforma actual */}
            <Link
              href="/proforma"
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border transition-all duration-200 ${totalItems > 0
                  ? 'bg-gradient-to-r from-purple-900/50 via-purple-800/40 to-indigo-900/50 border-purple-500/50 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20'
                  : 'bg-purple-950/30 border-purple-900/40 hover:bg-purple-950/50'
                }`}
              title="Ver Proforma actual"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-600/30">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-fuchsia-600 text-white rounded-full text-xs font-black flex items-center justify-center animate-pulse shadow">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
              <div className="text-left">
                <div className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                  Proforma
                  {totalItems > 0 && <Sparkles className="w-3 h-3 text-purple-400" />}
                </div>
                <div className="text-sm font-extrabold text-purple-300">
                  {formatCurrency(total)}
                </div>
              </div>
            </Link>

            {/* Botón Admin */}
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-purple-300/80 bg-purple-950/30 hover:bg-purple-900/50 hover:text-white border border-purple-900/40 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/proforma"
              className="relative p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/60"
            >
              <FileText className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-fuchsia-600 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-950/50 focus:outline-none border border-purple-900/40"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0922] border-b border-purple-900/60 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${active
                      ? 'bg-purple-600/25 text-purple-300 font-semibold border border-purple-500/30'
                      : 'text-slate-300 hover:bg-purple-950/50'
                    }`}
                >
                  <Icon className="w-5 h-5 text-purple-400" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-purple-900/50 flex flex-col gap-2">
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-900/60 flex justify-between items-center">
              <div>
                <span className="text-xs text-purple-300/80">Total Proforma ({totalItems} ítems):</span>
                <p className="text-base font-extrabold text-purple-300">{formatCurrency(total)}</p>
              </div>
              <Link
                href="/proforma"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-600/30"
              >
                Ver Proforma
              </Link>
            </div>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-purple-300 bg-purple-950/30 hover:bg-purple-900/50 border border-purple-900/50"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Panel de Administración
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
