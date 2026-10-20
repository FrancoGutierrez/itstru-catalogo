'use client';

import React, { useState } from 'react';
import { CompanySettings } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface SettingsFormProps {
  initialSettings: CompanySettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState<CompanySettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setSavedSuccess(false);

    if (supabase) {
      try {
        const { error } = await supabase
          .from('company_settings')
          .upsert({
            id: 'main',
            company_name: settings.company_name,
            company_ruc: settings.company_ruc,
            company_phone: settings.company_phone,
            company_email: settings.company_email,
            company_address: settings.company_address,
            whatsapp_number: settings.whatsapp_number,
            bank_accounts: settings.bank_accounts,
            terms_conditions: settings.terms_conditions,
          });

        if (error) throw error;
        setSavedSuccess(true);
      } catch (err: unknown) {
        setErrorMsg((err as Error).message);
      } finally {
        setIsSaving(false);
      }
    } else {
      setSavedSuccess(true);
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#130b29]/95 rounded-3xl border border-purple-900/60 p-6 sm:p-8 shadow-xl shadow-purple-950/40 space-y-6 text-white backdrop-blur-sm">
      <div className="border-b border-purple-900/40 pb-4">
        <h3 className="text-lg font-black text-white">
          Configuración Comercial its tru
        </h3>
        <p className="text-xs text-purple-300/60 mt-0.5">
          Estos datos se imprimen en el encabezado de las proformas oficiales y determinan el WhatsApp de ventas
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>¡Datos de la empresa actualizados correctamente!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-purple-200 mb-1">
            Nombre / Razón Social
          </label>
          <input
            type="text"
            value={settings.company_name}
            onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-purple-200 mb-1">
            R.U.C.
          </label>
          <input
            type="text"
            value={settings.company_ruc}
            onChange={(e) => setSettings({ ...settings, company_ruc: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-purple-200 mb-1">
            Número WhatsApp para recibir Proformas (Código de país sin signos)
          </label>
          <input
            type="text"
            value={settings.whatsapp_number}
            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
            placeholder="51987654321"
            className="w-full px-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-sm font-mono text-emerald-400 font-bold focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <span className="text-[10px] text-purple-300/40 mt-1 block">
            Ejemplo Perú: 51987654321 (51 + número celular de 9 dígitos)
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-purple-200 mb-1">
            Teléfono de Oficina / Central
          </label>
          <input
            type="text"
            value={settings.company_phone}
            onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-purple-200 mb-1">
            Correo de Ventas
          </label>
          <input
            type="email"
            value={settings.company_email}
            onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-purple-200 mb-1">
            Dirección Fiscal / Tienda
          </label>
          <input
            type="text"
            value={settings.company_address}
            onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div>
          <label className="block text-xs font-bold text-purple-200 mb-1">
            Cuentas Bancarias (Impresas en Proforma)
          </label>
          <textarea
            rows={4}
            value={settings.bank_accounts}
            onChange={(e) => setSettings({ ...settings, bank_accounts: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-xs font-mono text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-purple-200 mb-1">
            Condiciones y Términos de la Cotización
          </label>
          <textarea
            rows={4}
            value={settings.terms_conditions}
            onChange={(e) => setSettings({ ...settings, terms_conditions: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#090417] border border-purple-900/80 rounded-xl text-xs text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-purple-900/40">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Guardar Configuración
            </>
          )}
        </button>
      </div>
    </form>
  );
}
