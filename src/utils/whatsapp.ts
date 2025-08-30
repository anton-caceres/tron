import type { CartItem } from "../types/shop";
import { formatARS } from "./formatCurrency";

export const getPhone = () => import.meta.env.VITE_WA_PHONE ?? "5493584348768";

export function buildWhatsAppMessage(cartItems: CartItem[], total: number, header = "Solicitud de compra mayorista TRON") {
  const items = cartItems.map(i => `• ${i.nombre} x${i.qty} = ${formatARS(i.qty * (i.precio || 0))}`).join("\n");
  return `${header}\n\n${items}\n\nTotal: ${formatARS(total)}`;
}

export function openWhatsApp(cartItems: CartItem[], total: number) {
  const url = `https://wa.me/${getPhone()}?text=${encodeURIComponent(buildWhatsAppMessage(cartItems, total))}`;
  window.open(url, "_blank");
}
