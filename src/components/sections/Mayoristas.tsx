const Mayoristas = () => (
  <section className="py-8 sm:py-12 px-4">
    <h2 className="text-3xl font-bold text-orange-500 text-center mb-6 sm:mb-8">Mayoristas</h2>
    <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 space-y-4 text-gray-200 max-w-4xl mx-auto">
      <p className="font-semibold">Beneficios</p>
      <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
        <li>Descuentos por volumen</li>
        <li>Envíos a todo el país</li>
        <li>Catálogo siempre actualizado</li>
        <li>Atención personalizada para negocios</li>
      </ul>
      <div className="bg-gray-800 rounded-xl p-4">
        <p className="font-semibold text-orange-400 mb-2">Preguntas Frecuentes</p>
        <p className="text-gray-400 text-sm">Ejemplo de pregunta frecuente con respuesta breve.</p>
      </div>
    </div>
  </section>
);
export default Mayoristas;
