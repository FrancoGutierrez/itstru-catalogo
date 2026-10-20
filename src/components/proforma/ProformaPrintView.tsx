'use client';

import React from 'react';
import Image from 'next/image';
import { useProforma } from '@/context/ProformaContext';
import { formatCurrency, generateQuoteNumber } from '@/lib/utils';
import { INITIAL_COMPANY_SETTINGS } from '@/lib/constants';
import { Printer, ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react';

interface ProformaPrintViewProps {
  onBack: () => void;
}

export function ProformaPrintView({ onBack }: ProformaPrintViewProps) {
  const { items, subtotal, includeIgv, igv, total, customer } = useProforma();
  const company = INITIAL_COMPANY_SETTINGS;
  const quoteNumber = React.useMemo(() => generateQuoteNumber(company.quote_prefix || 'TRU'), [company.quote_prefix]);
  const today = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const validUntil = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Barra de control en pantalla (Oculta al imprimir) */}
      <div className="no-print bg-[#130b29] border border-purple-900/60 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 text-purple-200 text-xs font-bold transition-colors border border-purple-800/60"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400" />
            Volver al Editor
          </button>
          <div>
            <h3 className="text-sm font-bold text-purple-300">
              Vista Previa de la Proforma para Impresión / Guardar PDF
            </h3>
            <p className="text-xs text-purple-300/60">
              Usa el botón de imprimir y elige &quot;Guardar como PDF&quot; en tu navegador.
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4" />
          Imprimir / Guardar como PDF
        </button>
      </div>

      {/* DOCUMENTO FORMAL DE PROFORMA (Se imprime en hoja A4 blanca) */}
      <div className="print-container bg-white text-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl max-w-4xl mx-auto font-sans">
        {/* Encabezado con datos de la empresa y N° de proforma */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b-2 border-slate-900 pb-6">
          {/* Datos Empresa y Logo */}
          <div className="space-y-1.5 max-w-md">
            <div className="flex items-center gap-3.5 mb-2">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-1 ring-slate-300 bg-black flex items-center justify-center shrink-0">
                <Image
                  src="/images/itstru-logo.jpg"
                  alt="its tru"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-slate-900 block leading-tight lowercase">
                  {company.company_name}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Hardware Gamer
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-600 space-y-0.5">
              <p><strong>R.U.C.:</strong> {company.company_ruc}</p>
              <p><strong>Dirección:</strong> {company.company_address}</p>
              <p><strong>Teléfono / WhatsApp:</strong> {company.company_phone}</p>
              <p><strong>Email:</strong> {company.company_email}</p>
            </div>
          </div>

          {/* Cuadro de Cotización */}
          <div className="sm:text-right border-2 border-slate-900 rounded-2xl p-4 bg-slate-50 min-w-[240px]">
            <span className="text-xs uppercase font-extrabold tracking-widest text-purple-700 block">
              COTIZACIÓN FORMAL
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {quoteNumber}
            </div>
            <div className="mt-3 text-xs text-slate-600 space-y-1">
              <p><strong>Fecha de Emisión:</strong> {today}</p>
              <p><strong>Válida hasta:</strong> {validUntil}</p>
              <p><strong>Moneda:</strong> Nuevos Soles (PEN)</p>
            </div>
          </div>
        </div>

        {/* Sección: Datos del Cliente */}
        <div className="my-6 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Cliente / Razón Social:</p>
              <p className="text-sm font-black text-slate-900 mt-0.5">{customer.name || 'CLIENTE GENERAL'}</p>
              {customer.docNumber && (
                <p className="text-slate-600 mt-1">
                  <strong>{customer.docType}:</strong> {customer.docNumber}
                </p>
              )}
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Contacto & Entrega:</p>
              <p className="text-slate-800 font-semibold mt-0.5">
                <strong>Teléfono:</strong> {customer.phone || 'No registrado'}
              </p>
              {customer.address && (
                <p className="text-slate-600 mt-0.5">
                  <strong>Dirección:</strong> {customer.address}
                </p>
              )}
              {customer.notes && (
                <p className="text-slate-500 italic mt-1">
                  &quot;{customer.notes}&quot;
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabla Formal de Ítems */}
        <div className="overflow-x-auto my-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3 rounded-l-lg text-center w-12">Ítem</th>
                <th className="py-2.5 px-3 w-28">Código/SKU</th>
                <th className="py-2.5 px-3">Descripción del Producto</th>
                <th className="py-2.5 px-3 text-center w-16">Cant.</th>
                <th className="py-2.5 px-3 text-right w-24">P. Unit.</th>
                <th className="py-2.5 px-3 rounded-r-lg text-right w-28">Total (S/.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item, index) => (
                <tr key={item.product.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3 text-center font-bold text-slate-500">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">
                    {item.product.sku}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900">{item.product.name}</p>
                    {item.product.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.product.description}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-900">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-700">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-slate-900">
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bloque Inferior: Cuentas Bancarias + Totales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t-2 border-slate-200">
          {/* Cuentas Bancarias */}
          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                Cuentas Bancarias para Depósito / Transferencia:
              </span>
              <pre className="text-[11px] font-mono text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed">
                {company.bank_accounts}
              </pre>
            </div>

            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                Condiciones Comerciales:
              </span>
              <p className="text-[11px] text-slate-600 whitespace-pre-wrap leading-relaxed">
                {company.terms_conditions}
              </p>
            </div>
          </div>

          {/* Liquidación Económica */}
          <div className="flex flex-col justify-between">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Neto:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>I.G.V. (18%):</span>
                <span className="font-mono font-bold text-slate-900">
                  {includeIgv ? formatCurrency(igv) : 'S/. 0.00 (Neto)'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline text-sm">
                <span className="font-extrabold text-slate-900 uppercase">Total a Liquidar:</span>
                <span className="text-xl font-black text-slate-950 font-mono">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Garantía Oficial its tru</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Comprobante electrónico emitido según normativas de SUNAT.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
