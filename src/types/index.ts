export type Section =
  | "inicio"
  | "quienes"
  | "catalogo"
  | "detalle"
  | "mayoristas"
  | "contacto"
  | "carrito"
  | "acceso"
  | "registro"
  | "recuperar"
  | "checkout"
  | "orden-ok";

export type Product = {
  id: number;
  nombre: string;
  precio: number;
  categoria?: string;
};

export type CartItem = Product & { qty: number };

export type Company = {
  razon: string;
  cuit: string;
  iva: string;
  address: string;
  city: string;
  province: string;
  cp: string;
  shipping: string;
  payment: string;
};
