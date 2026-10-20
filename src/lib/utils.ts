import { CustomerInfo, ProformaItem } from '@/types';

/**
 * Formatear montos a Soles peruanos (S/.)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('PEN', 'S/.');
}

/**
 * Generar correlativo de proforma único
 */
export function generateQuoteNumber(prefix: string = 'COT'): string {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
}

/**
 * Construir el mensaje formateado para enviar la proforma por WhatsApp
 */
export function buildWhatsAppMessage(params: {
  quoteNumber: string;
  customer: CustomerInfo;
  items: ProformaItem[];
  subtotal: number;
  includeIgv: boolean;
  igv: number;
  total: number;
  companyName: string;
}): string {
  const { quoteNumber, customer, items, subtotal, includeIgv, igv, total, companyName } = params;

  let message = `📋 *SOLICITUD DE PROFORMA - ${companyName}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🔖 *N° Cotización:* ${quoteNumber}\n`;
  message += `📅 *Fecha:* ${new Date().toLocaleDateString('es-PE')}\n\n`;

  message += `👤 *DATOS DEL CLIENTE*\n`;
  message += `• *Nombre / Razón Social:* ${customer.name || 'No especificado'}\n`;
  if (customer.docNumber) {
    message += `• *${customer.docType}:* ${customer.docNumber}\n`;
  }
  message += `• *Teléfono:* ${customer.phone || 'No especificado'}\n`;
  if (customer.address) {
    message += `• *Dirección:* ${customer.address}\n`;
  }
  if (customer.notes) {
    message += `• *Observaciones:* ${customer.notes}\n`;
  }

  message += `\n📦 *DETALLE DE PRODUCTOS*\n`;
  items.forEach((item, index) => {
    message += `\n${index + 1}. *${item.product.name}*\n`;
    message += `   Código/SKU: ${item.product.sku}\n`;
    message += `   Cant: ${item.quantity}  ×  ${formatCurrency(item.unitPrice)} = *${formatCurrency(item.subtotal)}*\n`;
  });

  message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📊 *RESUMEN ECONÓMICO*\n`;
  message += `• Subtotal: ${formatCurrency(subtotal)}\n`;
  if (includeIgv) {
    message += `• I.G.V. (18%): ${formatCurrency(igv)}\n`;
  } else {
    message += `• I.G.V.: No incluido (Precios Netos)\n`;
  }
  message += `💰 *TOTAL FINAL:* *${formatCurrency(total)}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `_Hola, por favor deseo confirmar la disponibilidad, tiempo de entrega y medios de pago para esta cotización._`;

  return message;
}

/**
 * Crear enlace directo a WhatsApp (wa.me)
 */
export function getWhatsAppUrl(phone: string, text: string): string {
  // Limpiar caracteres no numéricos del teléfono
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
