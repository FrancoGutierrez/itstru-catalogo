import { createClient } from '@supabase/supabase-js';
import { Product, Category, CompanySettings, Quote } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COMPANY_SETTINGS } from '../constants';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
};

// Cliente de Supabase para el navegador
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Obtener productos (con fallback a productos iniciales si no hay conexión a Supabase)
 */
export async function getProducts(options?: { onlyActive?: boolean }): Promise<Product[]> {
  if (!supabase) {
    if (options?.onlyActive) {
      return INITIAL_PRODUCTS.filter((p) => p.is_active);
    }
    return INITIAL_PRODUCTS;
  }

  try {
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });
    if (options?.onlyActive) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      console.warn('Usando catálogo inicial por error o tabla vacía en Supabase:', error?.message);
      return options?.onlyActive ? INITIAL_PRODUCTS.filter((p) => p.is_active) : INITIAL_PRODUCTS;
    }
    return data as Product[];
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
    return INITIAL_PRODUCTS;
  }
}

/**
 * Obtener categorías
 */
export async function getCategories(): Promise<Category[]> {
  if (!supabase) {
    return INITIAL_CATEGORIES;
  }

  try {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error || !data || data.length === 0) {
      return INITIAL_CATEGORIES;
    }
    return data as Category[];
  } catch {
    return INITIAL_CATEGORIES;
  }
}

/**
 * Obtener configuración de la empresa (para proforma y WhatsApp)
 */
export async function getCompanySettings(): Promise<CompanySettings> {
  if (!supabase) {
    return INITIAL_COMPANY_SETTINGS;
  }

  try {
    const { data, error } = await supabase.from('company_settings').select('*').eq('id', 'main').single();
    if (error || !data) {
      return INITIAL_COMPANY_SETTINGS;
    }
    return data as CompanySettings;
  } catch {
    return INITIAL_COMPANY_SETTINGS;
  }
}

/**
 * Subir imagen al bucket 'products' de Supabase Storage
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase no está configurado. Agrega tus credenciales en .env.local');
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `catalog/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('products')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Error al subir la imagen: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('products')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

/**
 * Guardar proforma en base de datos (auditoría / seguimiento opcional)
 */
export async function saveQuoteToSupabase(quote: Quote): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: true }; // En modo local simula éxito
  }

  try {
    const { error } = await supabase.from('quotes').insert([
      {
        quote_number: quote.quote_number,
        client_name: quote.client_name,
        client_doc_type: quote.client_doc_type,
        client_doc_number: quote.client_doc_number,
        client_phone: quote.client_phone,
        client_email: quote.client_email,
        client_address: quote.client_address,
        items: quote.items,
        subtotal: quote.subtotal,
        include_igv: quote.include_igv,
        igv: quote.igv,
        total: quote.total,
        notes: quote.notes,
        status: 'emitida',
      },
    ]);

    if (error) {
      console.warn('Error al guardar proforma en Supabase:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return { success: false, error: message };
  }
}
