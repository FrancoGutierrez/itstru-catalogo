'use client';

import React, { useState } from 'react';
import { useProforma } from '@/context/ProformaContext';
import { ProformaTable } from '@/components/proforma/ProformaTable';
import { ProformaSummary } from '@/components/proforma/ProformaSummary';
import { ProformaPrintView } from '@/components/proforma/ProformaPrintView';
import { FileText, ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';

export default function ProformaPage() {
  const { items } = useProforma();
  const [isPrintView, setIsPrintView] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Si el usuario activó la vista de impresión/PDF */}
      {isPrintView ? (
        <ProformaPrintView onBack={() => setIsPrintView(false)} />
      ) : (
        <div className="space-y-8">
          {/* Encabezado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-900/40 pb-5">
            <div>
              <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-widest mb-1">
                <FileText className="w-4 h-4" />
                <span className="lowercase">Módulo Cotizador its tru</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Armador de Proforma Digital
              </h1>
              <p className="text-xs sm:text-sm text-purple-200/60 mt-1">
                Ajusta cantidades, añade tus datos comerciales y descarga tu proforma formal o envíala a WhatsApp
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-800/60 bg-[#140b2a] text-purple-200 hover:text-white hover:bg-purple-900/40 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-purple-400" />
                + Seguir Agregando Productos
              </Link>

              {items.length > 0 && (
                <button
                  onClick={() => setIsPrintView(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-purple-600/30"
                >
                  <Printer className="w-4 h-4" />
                  Vista Previa PDF
                </button>
              )}
            </div>
          </div>

          {/* Layout Principal: 2 Columnas (Lista de Items a la izquierda, Resumen y Datos a la derecha) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Columna Izquierda: Tabla interactiva */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <ProformaTable />
            </div>

            {/* Columna Derecha: Formulario de Cliente + Cálculos + Botones WhatsApp y PDF */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-28">
              <ProformaSummary onTriggerPrint={() => setIsPrintView(true)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
