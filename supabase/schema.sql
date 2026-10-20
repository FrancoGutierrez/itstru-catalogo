-- ==============================================================================
-- SCHEMA SQL COMPLETO PARA SUPABASE
-- PROYECTO: CATÁLOGO DE PRODUCTOS Y COTIZADOR / ARMADOR DE PROFORMAS
-- ==============================================================================

-- 1. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLA: CATEGORÍAS
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT DEFAULT 'Package',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABLA: PRODUCTOS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_offer BOOLEAN NOT NULL DEFAULT false,
    is_new BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Índices para búsqueda rápida en catálogo
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_offer ON public.products(is_offer);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products USING gin (to_tsvector('spanish', name));

-- 4. TABLA: CONFIGURACIÓN DE LA EMPRESA (DATOS PARA PROFORMA Y WHATSAPP)
CREATE TABLE IF NOT EXISTS public.company_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    company_name TEXT NOT NULL DEFAULT 'ITS TRUE VAN',
    company_ruc TEXT NOT NULL DEFAULT '20609876543',
    company_phone TEXT NOT NULL DEFAULT '+51 987 654 321',
    company_email TEXT NOT NULL DEFAULT 'ventas@itstruevan.com',
    company_address TEXT NOT NULL DEFAULT 'Av. Garcilaso de la Vega 1348 (Compuplaza), Lima - Perú',
    whatsapp_number TEXT NOT NULL DEFAULT '51987654321',
    quote_prefix TEXT NOT NULL DEFAULT 'ITV',
    quote_validity_days INTEGER NOT NULL DEFAULT 15,
    bank_accounts TEXT NOT NULL DEFAULT 'BCP Soles: 191-3456789-0-88 (CCI: 00219100345678908851)
BBVA Soles: 0011-0145-0100056789 (CCI: 00110145010005678933)
Interbank: 200-3004567891
Yape / Plin: 987 654 321 (ITS TRUE VAN)',
    terms_conditions TEXT NOT NULL DEFAULT '1. Precios expresados en Nuevos Soles (S/.) con o sin I.G.V. según requerimiento.
2. Garantía de hardware: 12 a 36 meses directo por fabricante según marca (Asus, Lenovo, Kingston, MSI, Samsung).
3. Servicios técnicos: 90 días de garantía sobre mano de obra e instalación.
4. Tiempo de entrega: Entrega inmediata en tienda / Envío mismo día en Lima Metropolitana / 24-48 hrs a provincias vía Shalom o Marvisur.
5. Emisión de Factura y Boleta de Venta electrónica autorizada por SUNAT.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TABLA: HISTORIAL DE COTIZACIONES (OPCIONAL PERO RECOMENDADA PARA AUDITORÍA)
CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number TEXT NOT NULL UNIQUE,
    client_name TEXT NOT NULL,
    client_doc_type TEXT DEFAULT 'RUC',
    client_doc_number TEXT,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    client_address TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12, 2) NOT NULL,
    include_igv BOOLEAN NOT NULL DEFAULT true,
    igv NUMERIC(12, 2) NOT NULL,
    total NUMERIC(12, 2) NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'emitida' CHECK (status IN ('emitida', 'contactada', 'aprobada', 'rechazada')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. TRIGGER PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_company_settings_updated_at ON public.company_settings;
CREATE TRIGGER trigger_company_settings_updated_at
    BEFORE UPDATE ON public.company_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 7. SEGURIDAD: ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- 7.1 Políticas para CATEGORIES
-- Cualquiera (público / anónimo) puede leer categorías
CREATE POLICY "Categorías son públicas para lectura"
    ON public.categories
    FOR SELECT
    USING (true);

-- Solo administradores autenticados pueden crear, modificar o eliminar categorías
CREATE POLICY "Admins pueden gestionar categorías"
    ON public.categories
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7.2 Políticas para PRODUCTS
-- Público puede leer solo productos activos (y administradores pueden ver todos)
CREATE POLICY "Público ve productos activos y Admins ven todos"
    ON public.products
    FOR SELECT
    USING (is_active = true OR auth.role() = 'authenticated');

-- Solo administradores autenticados pueden crear, modificar o eliminar productos
CREATE POLICY "Solo admins pueden insertar productos"
    ON public.products
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Solo admins pueden actualizar productos"
    ON public.products
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Solo admins pueden eliminar productos"
    ON public.products
    FOR DELETE
    TO authenticated
    USING (true);

-- 7.3 Políticas para COMPANY_SETTINGS
-- Público puede leer la configuración de la empresa (para encabezados, pie de proforma y WhatsApp)
CREATE POLICY "Público puede leer configuración de empresa"
    ON public.company_settings
    FOR SELECT
    USING (true);

-- Solo administradores autenticados pueden actualizar la configuración
CREATE POLICY "Solo admins pueden actualizar configuración de empresa"
    ON public.company_settings
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7.4 Políticas para QUOTES
-- Los clientes pueden registrar cotizaciones (anónimo)
CREATE POLICY "Clientes pueden insertar cotizaciones"
    ON public.quotes
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Administradores autenticados pueden ver y gestionar todas las cotizaciones
CREATE POLICY "Solo admins pueden leer y gestionar cotizaciones"
    ON public.quotes
    FOR SELECT
    TO authenticated
    USING (true);

-- ==============================================================================
-- 8. STORAGE BUCKET PARA IMÁGENES DE PRODUCTOS
-- ==============================================================================

-- Crear el bucket 'products' como público si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'products',
    'products',
    true,
    5242880, -- 5MB límite
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Políticas de Storage para el bucket 'products'
-- Permitir lectura pública de imágenes
CREATE POLICY "Acceso público de lectura para imágenes de productos"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'products');

-- Permitir subir imágenes solo a administradores autenticados
CREATE POLICY "Solo admins pueden subir imágenes al bucket products"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'products');

-- Permitir modificar imágenes solo a administradores autenticados
CREATE POLICY "Solo admins pueden actualizar imágenes en bucket products"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'products');

-- Permitir eliminar imágenes solo a administradores autenticados
CREATE POLICY "Solo admins pueden borrar imágenes del bucket products"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'products');

-- ==============================================================================
-- 9. DATOS SEMILLA (SEED DATA) - its tru
-- ==============================================================================

-- Insertar configuración inicial
INSERT INTO public.company_settings (
    id, company_name, company_ruc, company_phone, company_email, 
    company_address, whatsapp_number, quote_prefix, quote_validity_days,
    bank_accounts, terms_conditions
)
VALUES (
    'main', 
    'its tru', 
    '20609876543', 
    '+51 987 654 321', 
    'ventas@itstru.com', 
    'Av. Garcilaso de la Vega 1348 (Compuplaza), Lima - Perú', 
    '51987654321',
    'TRU',
    15,
    'BCP Soles: 191-3456789-0-88 (CCI: 00219100345678908851)
BBVA Soles: 0011-0145-0100056789 (CCI: 00110145010005678933)
Interbank: 200-3004567891
Yape / Plin: 987 654 321 (its tru)',
    '1. Precios expresados en Nuevos Soles (S/.) con o sin I.G.V. según requerimiento.
2. Garantía de hardware: 12 a 36 meses directo por fabricante según marca (ASUS, GamePro, its tru).
3. Tiempo de entrega: Entrega inmediata en tienda / Envío mismo día en Lima Metropolitana / 24-48 hrs a provincias vía Shalom o Marvisur.
4. Emisión de Factura y Boleta de Venta electrónica autorizada por SUNAT.'
)
ON CONFLICT (id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    company_ruc = EXCLUDED.company_ruc,
    company_phone = EXCLUDED.company_phone,
    company_email = EXCLUDED.company_email,
    company_address = EXCLUDED.company_address,
    whatsapp_number = EXCLUDED.whatsapp_number,
    quote_prefix = EXCLUDED.quote_prefix,
    quote_validity_days = EXCLUDED.quote_validity_days,
    bank_accounts = EXCLUDED.bank_accounts,
    terms_conditions = EXCLUDED.terms_conditions;

-- Insertar Categorías
INSERT INTO public.categories (id, name, slug, description, icon) VALUES
('66666666-6666-6666-6666-666666666666', 'Mobiliario & Sillas Gamer', 'mobiliario-sillas-gamer', 'Sillas ergonómicas gamer, escritorios y mesas con iluminación RGB', 'Armchair'),
('33333333-3333-3333-3333-333333333333', 'Componentes & Hardware', 'componentes-hardware', 'Tarjetas de video, refrigeración y hardware gamer de alto rendimiento', 'Cpu'),
('44444444-4444-4444-4444-444444444444', 'Accesorios & Periféricos', 'accesorios-perifericos', 'Bases refrigerantes RGB, soportes de aluminio y accesorios gaming', 'Monitor')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon;

-- Insertar los 4 Productos oficiales
INSERT INTO public.products (sku, name, description, price, category, category_id, stock, image_url, is_active, is_featured, is_offer, is_new) VALUES
(
    'SIL-GPR-1001',
    'Silla Gaming GamePro GP1001 Ergonómica con Reposapiés Reclinable 135°',
    'Diseño ergonómico para máxima comodidad, reclinación hasta 135°, cojines lumbar y cervical incluidos, base metálica ultra resistente, soporta hasta 160 KG. Garantía de 1 año y 100% original its tru.',
    389.00,
    'Mobiliario & Sillas Gamer',
    '66666666-6666-6666-6666-666666666666',
    7,
    '/images/products/silla-gaming-gp1001.jpg',
    true, true, true, true
),
(
    'MES-GPR-001',
    'Mesa Gaming Game Pro GP-001 RGB con Control Remoto y Fibra de Carbono 120x60cm',
    'Iluminación RGB con control remoto, amplio tablero de 120 × 60 cm con acabado tipo fibra de carbono, estructura de acero de alta resistencia que soporta hasta 100 KG, incluye portavasos y gancho para audífonos, diseño de patas en Z para mayor estabilidad.',
    269.00,
    'Mobiliario & Sillas Gamer',
    '66666666-6666-6666-6666-666666666666',
    12,
    '/images/products/mesa-gaming-gp001-rgb.jpg',
    true, true, true, true
),
(
    'ACC-LPT-RGB360',
    'Base Refrigerante para Laptop Gamer de Aluminio con Ventilador RGB y Rotación 360°',
    'Soporte ergonómico plegable fabricado en aleación de aluminio con ventilador central de alta disipación y luz RGB multicolor. Base giratoria 360°, doble brazo articulado con ajuste milimétrico de altura e inclinación, puertos USB y topes antideslizantes.',
    119.00,
    'Accesorios & Periféricos',
    '44444444-4444-4444-4444-444444444444',
    24,
    '/images/products/base-laptop-gamer-rgb.png',
    true, true, false, true
),
(
    'GPU-ASU-4060TI',
    'Tarjeta de Video ASUS ROG Strix GeForce RTX 4060 Ti OC Edition 8GB GDDR6',
    'Modelo ROG-STRIX-RTX4060TI-O8G-GAMING con triple ventilador Axial-tech, memoria 8GB GDDR6 128-bit, iluminación Aura Sync ARGB, arquitectura Ada Lovelace con DLSS 3 y Ray Tracing de 3ra generación. Placa trasera ventilada de metal y BIOS dual.',
    2499.00,
    'Componentes & Hardware',
    '33333333-3333-3333-3333-333333333333',
    6,
    '/images/products/asus-rog-strix-rtx4060ti.png',
    true, true, true, true
)
ON CONFLICT (sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category = EXCLUDED.category,
    category_id = EXCLUDED.category_id,
    stock = EXCLUDED.stock,
    image_url = EXCLUDED.image_url,
    is_active = EXCLUDED.is_active,
    is_featured = EXCLUDED.is_featured,
    is_offer = EXCLUDED.is_offer,
    is_new = EXCLUDED.is_new;
