import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Product, Category, CompanySettings, Quote } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COMPANY_SETTINGS } from '../constants';

export { supabase, isSupabaseConfigured };

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
      if (error) {
        console.warn('Nota: Usando catálogo inicial debido a error o tabla vacía en Supabase:', error.message);
      }
      return options?.onlyActive ? INITIAL_PRODUCTS.filter((p) => p.is_active) : INITIAL_PRODUCTS;
    }
    return data as Product[];
  } catch (err) {
    console.warn('Error fetching products from Supabase, usando catálogo local:', err);
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
 * Subir imagen al bucket 'product-images' de Supabase Storage
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase no está configurado. Agrega tus credenciales en .env.local');
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${Date.now()}-${cleanName}`;
  const filePath = `products/${fileName}`;

  // Intentar primero con el bucket oficial 'product-images'
  const primaryBucket = 'product-images';
  const { error: uploadError } = await supabase.storage
    .from(primaryBucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  let activeBucket = primaryBucket;

  // Si da error de bucket no encontrado, intentar fallback a 'products'
  if (uploadError) {
    const isBucketNotFound = uploadError.message?.toLowerCase().includes('bucket not found');
    if (isBucketNotFound) {
      const fallbackBucket = 'products';
      const { error: fallbackError } = await supabase.storage
        .from(fallbackBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (fallbackError) {
        throw new Error(`Error al subir la imagen en '${primaryBucket}' y '${fallbackBucket}': ${fallbackError.message}`);
      }
      activeBucket = fallbackBucket;
    } else {
      throw new Error(`Error al subir la imagen a Supabase Storage (${primaryBucket}): ${uploadError.message}`);
    }
  }

  const { data: publicUrlData } = supabase.storage
    .from(activeBucket)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

/**
 * Guardar proforma en base de datos (auditoría / seguimiento opcional)
 */
export async function saveQuoteToSupabase(quote: Quote): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: true };
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
