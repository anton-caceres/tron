import type { FC } from "react";
import type { Section } from "../../types";

type Props = { onNav?: (s: Section) => void };

const Inicio: FC<Props> = ({ onNav }) => (
  <section className="text-center py-8 sm:py-12 space-y-6 px-4">
    <h2 className="text-3xl sm:text-4xl font-bold text-orange-500">TRON Mayoristas</h2>
    <p className="text-lg sm:text-xl text-gray-200">“Acompañamos tu crecimiento”</p>
    <div className="bg-gray-900 rounded-2xl p-6 sm:p-10 flex flex-col items-center space-y-6">
      <div className="bg-gray-700 w-full h-36 sm:h-48 flex items-center justify-center rounded-lg">Slider / Imagen destacada</div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button onClick={() => onNav?.("catalogo")} className="w-full sm:w-auto bg-orange-500 text-black px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition">
          Ver Catálogo
        </button>
        <button onClick={() => onNav?.("mayoristas")} className="w-full sm:w-auto bg-gray-800 px-6 py-3 rounded-2xl hover:scale-105 transition">
          Beneficios Mayoristas
        </button>
      </div>
    </div>
  </section>
);

export default Inicio;
