import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ProformaProvider } from '@/context/ProformaContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'its tru | Hardware Gamer',
  description:
    'Catálogo oficial its tru: sillas gamer ergonómicas GamePro, mesas gaming RGB, tarjetas de video ASUS ROG Strix y bases refrigerantes en Lima, Perú. Cotizador formal en PDF y WhatsApp.',
  keywords: [
    'its tru',
    'itstru',
    'sillas gaming lima',
    'mesa gamer rgb peru',
    'rtx 4060 ti peru',
    'gamepro gp1001',
    'base refrigerante laptop gamer rgb',
    'proforma pdf hardware',
  ],
  authors: [{ name: 'its tru' }],
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#0b071a] text-slate-100 selection:bg-purple-600 selection:text-white max-w-[100vw] overflow-x-hidden">
        <ProformaProvider>
          <div className="w-full max-w-[100vw] overflow-x-hidden flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </ProformaProvider>
      </body>
    </html>
  );
}
