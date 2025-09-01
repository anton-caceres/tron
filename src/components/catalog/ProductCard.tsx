import type { FC } from "react";

export type Product = {
  id: number;
  nombre: string;
  precio: number;
  categoria?: string;
};

type Props = {
  product: Product;
  formatARS: (v: number) => string;
  onAdd: (p: Product, qty: number) => void;
  onView: () => void;
};

const ProductCard: FC<Props> = ({ product, formatARS, onAdd, onView }) => {
  const inputId = `qty-${product.id}`;

  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-2xl flex flex-col items-center space-y-3">
      <div className="w-full h-28 sm:h-32 bg-gray-700 flex items-center justify-center rounded">
        Img
      </div>
      <p className="text-white font-semibold text-center text-sm sm:text-base">
        {product.nombre}
      </p>
      <p className="text-gray-400 text-xs sm:text-sm">{formatARS(product.precio)}</p>

      <div className="flex items-center gap-2 w-full justify-center">
        <input
          type="number"
          min={1}
          defaultValue={1}
          id={inputId}
          className="w-16 sm:w-20 p-1 rounded border border-gray-400 text-black bg-white"
        />
        <button
          onClick={() => {
            const el = document.getElementById(inputId) as HTMLInputElement | null;
            const qty = parseInt(el?.value ?? "1", 10) || 1;
            onAdd(product, qty);
          }}
          className="bg-orange-500 text-black px-3 py-1 rounded-lg hover:scale-105 transition"
        >
          Agregar
        </button>
      </div>

      <button onClick={onView} className="text-xs text-orange-400 underline">
        Ver detalle
      </button>
    </div>
  );
};

export default ProductCard;
