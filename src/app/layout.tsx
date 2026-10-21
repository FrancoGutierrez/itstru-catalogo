import type { Metadata } from 'next';
import './globals.css';
import { ProformaProvider } from '@/context/ProformaContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

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
      <body className="min-h-full flex flex-col bg-[#0b071a] text-slate-100 selection:bg-purple-600 selection:text-white">
        <ProformaProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </ProformaProvider>
      </body>
    </html>
  );
}
