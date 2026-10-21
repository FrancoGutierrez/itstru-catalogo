import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { INITIAL_COMPANY_SETTINGS } from '@/lib/constants';

export function Footer() {
  const company = INITIAL_COMPANY_SETTINGS;

  return (
    <footer className="bg-[#090417] text-purple-200/60 border-t border-purple-900/50 no-print mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          {/* Columna 1: Info Empresa */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-black flex items-center justify-center shrink-0 ring-1 ring-purple-500/40">
                <Image
                  src="/images/itstru-logo.jpg"
                  alt="its tru"
                  width={28}
                  height={28}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="font-black text-sm text-white tracking-wider lowercase">
                its tru
              </span>
            </div>
            <p className="text-[11px] text-purple-200/50 leading-relaxed">
              Hardware gamer, sillas ergonómicas, componentes y soporte técnico con envíos a todo el Perú.
            </p>
            <div className="text-[10px] text-purple-300/40 font-mono">
              RUC: <span className="text-purple-200/80 font-semibold">{company.company_ruc}</span>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-200/80 mb-2">
              Navegación
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/" className="hover:text-purple-300 transition-colors">
                  Inicio / Novedades
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-purple-300 transition-colors">
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link href="/proforma" className="hover:text-purple-300 transition-colors">
                  Armador de Proforma
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Medios de Pago & Envíos */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-200/80 mb-2">
              Pagos & Envíos
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-700/60 text-[9px] font-bold">
                  Yape / Plin
                </span>
                <span className="text-[10px] text-purple-200/70">{company.whatsapp_number}</span>
              </div>
              <p className="text-[10px] text-purple-200/50">
                Factura y Boleta de venta electrónica SUNAT.
              </p>
              <div className="text-[10px] text-purple-300/60">
                🚚 Envíos vía Shalom, Marvisur y Olva.
              </div>
            </div>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-200/80 mb-2">
              Atención Comercial
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-purple-400 shrink-0" />
                <span>{company.company_phone}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-purple-400 shrink-0" />
                <span>{company.company_email}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{company.company_address}</span>
              </li>
              <li className="pt-1">
                <a
                  href={`https://wa.me/${company.whatsapp_number.replace(/\D/g, '')}?text=Hola%20its%20tru,%20solicito%20informaci%C3%B3n`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[10px] transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3 h-3" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-purple-900/30 text-[10px] text-purple-300/40 flex flex-col sm:flex-row items-center justify-between gap-1">
          <p>© {new Date().getFullYear()} {company.company_name} - Todos los derechos reservados.</p>
          <p className="text-purple-300/40">
            Lima, Perú
          </p>
        </div>
      </div>
    </footer>
  );
}
