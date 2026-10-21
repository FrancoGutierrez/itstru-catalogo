'use client';

import React from 'react';
import { INITIAL_COMPANY_SETTINGS } from '@/lib/constants';

export function WhatsAppButton() {
  const cleanPhone = INITIAL_COMPANY_SETTINGS.whatsapp_number.replace(/\D/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hola its tru, deseo consultar sobre sus productos y catálogo.')}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-950/60 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
    >
      {/* WhatsApp SVG Icon */}
      <svg
        className="w-6 h-6 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.676.15-.2.301-.776.979-.952 1.18-.176.2-.351.226-.652.075-.3-.151-1.27-.468-2.42-1.493-.894-.798-1.498-1.784-1.674-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.3-.502.1-.2.05-.376-.025-.527-.075-.15-.676-1.631-.927-2.232-.244-.585-.492-.506-.676-.515-.175-.009-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.229 3.109.15.2 2.122 3.24 5.141 4.544.718.31 1.279.495 1.716.634.721.23 1.377.197 1.895.12.578-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.351zM12.042 21.84a9.78 9.78 0 0 1-4.99-1.37l-.358-.213-3.71.973.99-3.616-.233-.371a9.788 9.788 0 0 1-1.5-5.203c0-5.419 4.41-9.829 9.83-9.829 2.625 0 5.093 1.023 6.949 2.879a9.78 9.78 0 0 1 2.876 6.946c0 5.42-4.41 9.833-9.854 9.833zm0-17.84c-4.43 0-8.033 3.604-8.033 8.033 0 1.416.368 2.8 1.067 4.024l.164.288-.636 2.327 2.383-.625.279.165a8.006 8.006 0 0 0 4.776 1.448c4.43 0 8.033-3.604 8.033-8.033 0-2.146-.836-4.164-2.353-5.681A7.99 7.99 0 0 0 12.042 4z" />
      </svg>
      <span className="hidden sm:inline font-bold text-xs tracking-wide">
        WhatsApp Ventas
      </span>
      {/* Indicador de estado en línea */}
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-[#0b071a]"></span>
      </span>
    </a>
  );
}
