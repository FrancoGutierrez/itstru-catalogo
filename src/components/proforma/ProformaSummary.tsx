'use client';

import React, { useState } from 'react';
import { useProforma } from '@/context/ProformaContext';
import { formatCurrency, buildWhatsAppMessage, getWhatsAppUrl, generateQuoteNumber } from '@/lib/utils';
import { INITIAL_COMPANY_SETTINGS } from '@/lib/constants';
import { saveQuoteToSupabase } from '@/lib/supabase/client';
import {
  MessageCircle,
  Printer,
  Phone,
  MapPin,
  FileText,
  User,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ProformaSummaryProps {
  onTriggerPrint: () => void;
}

export function ProformaSummary({ onTriggerPrint }: ProformaSummaryProps) {
  const {
    items,
    subtotal,
    includeIgv,
    setIncludeIgv,
    igv,
    total,
    customer,
    updateCustomer,
  } = useProforma();

  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});
  const [, setQuoteSaved] = useState(false);

  const validate = () => {
    const errors: { name?: string; phone?: string } = {};
    if (!customer.name.trim()) {
      errors.name = 'Ingresa el nombre o razón social del cliente';
    }
    if (!customer.phone.trim()) {
      errors.phone = 'Ingresa un número telefónico o WhatsApp para contacto';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleWhatsAppSend = async () => {
    if (!validate()) {
      alert('Por favor completa al menos el Nombre y Teléfono del cliente antes de enviar.');
      return;
    }

    const company = INITIAL_COMPANY_SETTINGS;
    const quoteNumber = generateQuoteNumber(company.quote_prefix || 'TRU');

    // Guardar proforma en Supabase si está disponible (asíncrono, no bloquea)
    saveQuoteToSupabase({
      quote_number: quoteNumber,
      client_name: customer.name,
      client_doc_type: customer.docType,
      client_doc_number: customer.docNumber,
      client_phone: customer.phone,
      client_email: customer.email,
      client_address: customer.address,
      items,
      subtotal,
      include_igv: includeIgv,
      igv,
      total,
      notes: customer.notes,
    });

    const text = buildWhatsAppMessage({
      quoteNumber,
      customer,
      items,
      subtotal,
      includeIgv,
      igv,
      total,
      companyName: company.company_name,
    });

    const targetUrl = getWhatsAppUrl(company.whatsapp_number, text);
    window.open(targetUrl, '_blank');
    setQuoteSaved(true);
  };

  const handlePrintClick = () => {
    if (!validate()) {
      alert('Por favor ingresa los datos del cliente para que figuren en la proforma impresa.');
      return;
    }
    onTriggerPrint();
  };

  const isCartEmpty = items.length === 0;

  return (
    <div className="space-y-6">
      {/* 1. Formulario de Datos del Cliente */}
      <div className="bg-[#130b29]/95 rounded-3xl border border-purple-900/60 p-6 shadow-xl shadow-purple-950/40 space-y-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-purple-900/40 pb-3">
          <User className="w-5 h-5 text-purple-400" />
          <h3 className="font-extrabold text-white text-base">
            Datos del Cliente / Empresa
          </h3>
        </div>

        <div className="space-y-3">
          {/* Nombre / Razón Social */}
          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">
              Nombre o Razón Social <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={customer.name}
              onChange={(e) => {
                updateCustomer({ name: e.target.value });
                if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
              }}
              placeholder="Ej: Innova Gaming Club / Juan Pérez"
              className={`w-full px-3.5 py-2.5 bg-[#090417] border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all text-white placeholder-purple-300/40 ${
                formErrors.name
                  ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-purple-900/80 focus:ring-purple-400/30 focus:border-purple-400'
              }`}
            />
            {formErrors.name && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.name}
              </p>
            )}
          </div>

          {/* RUC / DNI */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Doc.</label>
              <select
                value={customer.docType}
                onChange={(e) => updateCustomer({ docType: e.target.value as 'RUC' | 'DNI' | 'CE' })}
                className="w-full px-3 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-400 font-semibold text-white cursor-pointer"
              >
                <option value="RUC" className="bg-[#0e0720]">RUC</option>
                <option value="DNI" className="bg-[#0e0720]">DNI</option>
                <option value="CE" className="bg-[#0e0720]">C.E.</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-purple-200 mb-1">
                N° de Documento
              </label>
              <input
                type="text"
                value={customer.docNumber}
                onChange={(e) => updateCustomer({ docNumber: e.target.value })}
                placeholder="20XXXXXXXXX / 4XXXXXXX"
                className="w-full px-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 text-white placeholder-purple-300/40"
              />
            </div>
          </div>

          {/* Teléfono / WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">
              Teléfono / WhatsApp <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={customer.phone}
                onChange={(e) => {
                  updateCustomer({ phone: e.target.value });
                  if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                }}
                placeholder="999 888 777"
                className={`w-full pl-9 pr-3.5 py-2.5 bg-[#090417] border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all text-white placeholder-purple-300/40 ${
                  formErrors.phone
                    ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                    : 'border-purple-900/80 focus:ring-purple-400/30 focus:border-purple-400'
                }`}
              />
            </div>
            {formErrors.phone && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.phone}
              </p>
            )}
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">
              Dirección de Despacho (Opcional)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customer.address}
                onChange={(e) => updateCustomer({ address: e.target.value })}
                placeholder="Av. Principal 456, Lima / Dpto."
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 text-white placeholder-purple-300/40"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">
              Observaciones / Especificaciones (Opcional)
            </label>
            <textarea
              rows={2}
              value={customer.notes}
              onChange={(e) => updateCustomer({ notes: e.target.value })}
              placeholder="Ej: Armado de PC gamer o entrega inmediata en tienda..."
              className="w-full px-3.5 py-2 bg-[#090417] border border-purple-900/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 text-white placeholder-purple-300/40"
            />
          </div>
        </div>
      </div>

      {/* 2. Resumen Económico */}
      <div className="bg-gradient-to-br from-[#160d33] via-[#0f0824] to-[#0a0518] text-white rounded-3xl p-6 shadow-2xl shadow-purple-950/60 border border-purple-800/80 space-y-5">
        <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Resumen de la Proforma
          </h3>
          <span className="text-xs text-purple-400 font-mono font-bold">
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        {/* Desglose de cálculos */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-purple-200/70">
            <span>Subtotal Bruto</span>
            <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
          </div>

          {/* Toggle IGV 18% */}
          <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="toggle-igv"
                checked={includeIgv}
                onChange={(e) => setIncludeIgv(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-[#090417] border-purple-700 rounded focus:ring-purple-400 cursor-pointer accent-purple-600"
              />
              <label htmlFor="toggle-igv" className="text-xs font-semibold text-purple-200 cursor-pointer select-none">
                Aplicar I.G.V. (18%)
              </label>
            </div>
            <span className={`text-xs font-bold ${includeIgv ? 'text-purple-300' : 'text-purple-400/40'}`}>
              {includeIgv ? formatCurrency(igv) : 'S/. 0.00'}
            </span>
          </div>

          {/* Total Final */}
          <div className="pt-2 border-t border-purple-900/50 flex items-baseline justify-between">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-purple-300/70 block">
                Total a Pagar
              </span>
              <span className="text-[10px] text-purple-300/50">
                {includeIgv ? '(Incluye IGV 18%)' : '(No incluye IGV - Precios Netos)'}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-cyan-300 tracking-tight">
              {formatCurrency(total)}
            </div>
          </div>
        </div>

        {/* 3. Botones de Acción */}
        <div className="space-y-3 pt-2">
          {/* Botón WhatsApp */}
          <button
            onClick={handleWhatsAppSend}
            disabled={isCartEmpty}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg ${
              isCartEmpty
                ? 'bg-purple-950/30 text-purple-400/40 cursor-not-allowed border border-purple-950/40'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            Enviar Proforma por WhatsApp
          </button>

          {/* Botón PDF / Imprimir */}
          <button
            onClick={handlePrintClick}
            disabled={isCartEmpty}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all border ${
              isCartEmpty
                ? 'bg-purple-950/30 text-purple-400/40 cursor-not-allowed border-purple-950/40'
                : 'bg-[#1b1038] hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-white border-purple-800/80 hover:border-purple-500 shadow-md shadow-purple-950/50'
            }`}
          >
            <Printer className="w-4 h-4 text-purple-400" />
            Descargar / Imprimir PDF
          </button>
        </div>

        {/* Garantías y notas rápidas */}
        <div className="pt-3 border-t border-purple-900/50 text-[11px] text-purple-300/70 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Validez de la oferta: 15 días calendario</span>
          </div>
          <p className="text-purple-400/50 text-[10px]">
            Emitimos Factura Electrónica y Boleta de Venta. Cuentas bancarias autorizadas a nombre de its tru.
          </p>
        </div>
      </div>
    </div>
  );
}
