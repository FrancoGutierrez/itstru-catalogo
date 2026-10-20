export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  category_id?: string | null;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_offer: boolean;
  is_new: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProformaItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CustomerInfo {
  name: string;
  docType: 'RUC' | 'DNI' | 'CE';
  docNumber: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

export interface CompanySettings {
  id: string;
  company_name: string;
  company_ruc: string;
  company_phone: string;
  company_email: string;
  company_address: string;
  whatsapp_number: string;
  quote_prefix: string;
  quote_validity_days: number;
  bank_accounts: string;
  terms_conditions: string;
  logo_url?: string;
}

export interface Quote {
  id?: string;
  quote_number: string;
  client_name: string;
  client_doc_type: string;
  client_doc_number?: string;
  client_phone: string;
  client_email?: string;
  client_address?: string;
  items: ProformaItem[];
  subtotal: number;
  include_igv: boolean;
  igv: number;
  total: number;
  notes?: string;
  status?: 'emitida' | 'contactada' | 'aprobada' | 'rechazada';
  created_at?: string;
}
