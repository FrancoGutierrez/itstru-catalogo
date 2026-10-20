# 🚀 COTI-PERÚ: Catálogo de Productos y Armador de Proformas

Aplicación web fullstack moderna desarrollada con **Next.js (App Router)**, **Tailwind CSS**, **Supabase (PostgreSQL + Supabase Storage + Auth)** y lista para despliegue gratuito en **Vercel**.

---

## 📋 Características Principales

### 1. Encabezado & Navegación (Navbar)
- **Logo de la empresa** y branding industrial con navegación fluida.
- Enlaces: **Inicio / Novedades**, **Catálogo Completo**, **Armar Proforma** y botón de acceso a **Admin**.
- **Contador flotante en tiempo real**: Muestra la cantidad acumulada de ítems y el monto total en Soles (`S/.`), permitiendo acceder a la cotización con 1 clic.

### 2. Inicio / Novedades (`/`)
- **Hero Banner interactivo** con buscador en tiempo real, efectos de iluminación y propuesta de valor comercial.
- Carrusel de **Categorías dinámicas** con accesos directos filtrados.
- Grilla de **Novedades & Ofertas Destacadas** con selector de pestañas (*Todos*, *Ofertas*, *Novedades*).
- **Flujo en 3 pasos** explicando cómo armar y descargar la proforma formal.

### 3. Catálogo Completo (`/catalogo`)
- **Filtro dinámico por categorías** y barra de búsqueda en tiempo real (por nombre, modelo SKU, categoría o descripción).
- Filtros rápidos por etiquetas: **Solo Ofertas**, **Solo Novedades** y selector de ordenamiento (precio ascendente/descendente, nombre, stock).
- **Tarjetas de Producto**:
  - Fotografía con zoom hover y fallback seguro en caso de imagen no disponible.
  - Badges de estado (*OFERTA*, *NOVEDAD*, *Stock disponible* / *Agotado*).
  - Precio unitario destacado en Soles (`S/.`).
  - Indicador de cuántas unidades de ese producto ya tienes en tu proforma actual.
  - Botón interactivo **"+ Agregar a Proforma"** con animación de confirmación.
  - Modal de **Vista Rápida / Especificaciones técnicas** con selector de cantidades.

### 4. Cotizador / Armador de Proforma (`/proforma`)
- **Lista interactiva de productos seleccionados**:
  - Control de cantidades con botones `[-]` y `[+]`, campo numérico directo y eliminación individual o vaciado completo.
  - Cálculo automático del subtotal por línea de producto.
- **Cálculo económico en tiempo real**:
  - Subtotal bruto.
  - **Selector / Switch de I.G.V. (18%)**: Permite alternar entre precios netos o calcular el 18% reglamentario en Perú.
  - Monto Total Final en Soles (`S/.`).
- **Formulario de datos del cliente**:
  - Nombre o Razón Social (obligatorio).
  - Tipo de documento (RUC, DNI, Carné de Extranjería) y número.
  - Teléfono / WhatsApp de contacto (obligatorio).
  - Dirección de despacho / obra.
  - Observaciones y condiciones especiales.
- **Botón "Enviar por WhatsApp"**:
  - Genera automáticamente un mensaje estructurado con emojis, datos del cliente, desglose de ítems (SKU, nombre, precio, cantidad) y totales, abriendo la conversación directamente con el número de ventas (`wa.me`).
- **Botón "Descargar / Imprimir PDF"**:
  - Genera una **hoja de proforma formal A4** lista para imprimir o guardar como PDF mediante el navegador.
  - Incluye: membrete con logo y RUC de la empresa, correlativo formal de cotización (`COT-2026-XXXX`), fecha de emisión y vencimiento (15 días), tabla limpia de ítems, cuadro de cuentas bancarias (BCP, BBVA, Interbank, Yape/Plin), términos comerciales y pie de firma autorizado.

### 5. Panel de Administración Protegido (`/admin`)
- **Acceso seguro**:
  - Login con **Supabase Auth** (correo y contraseña).
  - Soporte de acceso de respaldo / demostración inmediata con clave maestra (`admin123`).
- **Dashboard con métricas**:
  - Total de productos registrados, productos activos en vitrina, productos pausados y alertas de bajo stock (&le; 5 unids).
- **Tabla CRUD Completa**:
  - Búsqueda y filtrado interno de productos.
  - **Edición rápida de precios** directamente desde la tabla.
  - **Switch de estado (Pausar / Activar)** para ocultar o publicar productos al instante.
  - Botón de edición completa y eliminación con confirmación.
- **Formulario de Creación / Edición**:
  - Registro de nombre, SKU, categoría, precio, stock, descripción y flags (*Oferta*, *Novedad*, *Destacado*).
  - **Subida directa de imágenes desde el dispositivo a Supabase Storage** (bucket `products`) con vista previa inmediata.
- **Pestaña de Configuración Comercial**:
  - Permite actualizar el RUC, razón social, dirección, número de WhatsApp receptor de proformas y cuentas bancarias.

---

## 📂 Estructura del Proyecto

```
proforma-catalogo-app/
├── public/                       # Archivos estáticos y favicon
├── supabase/
│   └── schema.sql                # Schema SQL completo con RLS y Storage
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # Login de administración
│   │   │   └── page.tsx          # Dashboard Admin (CRUD, Métricas, Settings)
│   │   ├── catalogo/
│   │   │   └── page.tsx          # Catálogo completo con filtros en tiempo real
│   │   ├── proforma/
│   │   │   └── page.tsx          # Cotizador y Armador de Proformas
│   │   ├── globals.css           # Estilos Tailwind y reglas @media print A4
│   │   ├── layout.tsx            # Root Layout con Navbar, Footer y Provider
│   │   └── page.tsx              # Página de Inicio / Novedades
│   ├── components/
│   │   ├── admin/
│   │   │   ├── ProductForm.tsx   # Formulario con subida de fotos a Storage
│   │   │   ├── ProductTable.tsx  # Tabla CRUD (editar precios, pausar, borrar)
│   │   │   └── SettingsForm.tsx  # Configuración de empresa y cuentas bancarias
│   │   ├── catalog/
│   │   │   ├── CatalogFilters.tsx# Buscador, categorías dinámicas y ordenamiento
│   │   │   ├── ProductCard.tsx   # Tarjeta de producto con precios en S/.
│   │   │   └── ProductModal.tsx  # Vista rápida de especificaciones
│   │   ├── home/
│   │   │   ├── FeaturedGrid.tsx  # Grilla de ofertas y novedades
│   │   │   └── HeroBanner.tsx    # Banner principal con buscador y CTA
│   │   ├── layout/
│   │   │   ├── Footer.tsx        # Pie de página con datos de contacto y medios de pago
│   │   │   └── Navbar.tsx        # Barra de navegación con contador flotante de proforma
│   │   └── proforma/
│   │       ├── ProformaPrintView.tsx # Hoja formal imprimible A4 / Guardar en PDF
│   │       ├── ProformaSummary.tsx   # Formulario de cliente, IGV 18% y WhatsApp
│   │       └── ProformaTable.tsx     # Lista interactiva de productos seleccionados
│   ├── context/
│   │   └── ProformaContext.tsx   # Estado global reactivo sincronizado con localStorage
│   ├── lib/
│   │   ├── supabase/
│   │   │   └── client.ts         # Cliente Supabase, Storage y helpers con fallback
│   │   ├── constants.ts          # Datos iniciales de demostración y categorías
│   │   └── utils.ts              # Formato PEN (S/.), generador WhatsApp y correlativos
│   └── types/
│       └── index.ts              # Interfaces TypeScript del sistema
├── .env.example                  # Plantilla de variables de entorno
├── .env.local                    # Variables de entorno locales
├── next.config.ts                # Configuración de dominios de imágenes remotas
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚡ Guía de Instalación y Ejecución Local

### 1. Clonar o navegar a la carpeta del proyecto
```bash
cd "C:\Users\frgut\.gemini\antigravity-ide\scratch\proforma-catalogo-app"
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

> **Nota:** La aplicación cuenta con un sistema de fallback automático con datos iniciales completos, por lo que funciona al 100% de manera visual e interactiva desde el primer segundo, incluso antes de conectar Supabase.

---

## 🗄️ Configuración de Supabase (Paso a Paso)

### Paso 1: Crear proyecto en Supabase
1. Ingresa a [https://supabase.com](https://supabase.com) y crea una cuenta o inicia sesión.
2. Haz clic en **"New project"**, asígnale un nombre (ej. `coti-peru`) y elige una contraseña para la base de datos.

### Paso 2: Ejecutar el Schema SQL
1. En el panel izquierdo de tu proyecto en Supabase, ve a **SQL Editor**.
2. Abre el archivo `supabase/schema.sql` de este proyecto, copia todo su contenido y pégalo en el editor SQL.
3. Haz clic en **Run**.
4. Esto creará automáticamente:
   - Tablas `categories`, `products`, `company_settings` y `quotes`.
   - Índices de búsqueda optimizados para PostgreSQL.
   - Bucket público de almacenamiento `products` en **Supabase Storage** con límite de 5MB y tipos MIME permitidos.
   - Todas las políticas de seguridad **Row Level Security (RLS)** para lectura pública y mutaciones restringidas a administradores.
   - Datos semilla iniciales con 8 productos reales y 5 categorías industriales.

### Paso 3: Configurar las Variables de Entorno
1. En Supabase, ve a **Project Settings** > **API**.
2. Copia la **Project URL** y la **Project API key** (`anon` / `public`).
3. En tu archivo `.env.local` (o en la configuración de variables de Vercel), coloca:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-aqui
NEXT_PUBLIC_ADMIN_PIN=admin123
```

### Paso 4: Crear tu usuario Administrador
1. En Supabase, ve a **Authentication** > **Users**.
2. Haz clic en **"Add user"** > **"Create user"**.
3. Ingresa tu correo (ej: `admin@cotiperu.com`) y una contraseña segura.
4. ¡Listo! Ya puedes iniciar sesión en `/admin/login` con esas credenciales.

---

## 🚀 Despliegue Gratuito en Vercel

1. Sube este proyecto a tu repositorio de GitHub (o GitLab / Bitbucket).
2. Ve a [https://vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
3. Haz clic en **"Add New..."** > **"Project"** y selecciona tu repositorio.
4. En la sección **Environment Variables**, agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`: Tu URL de Supabase.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase.
   - `NEXT_PUBLIC_ADMIN_PIN`: `admin123` (o la clave maestra que desees).
5. Haz clic en **Deploy**.
6. En menos de 2 minutos tu aplicación estará en línea con dominio SSL gratuito `https://tu-proyecto.vercel.app`.
