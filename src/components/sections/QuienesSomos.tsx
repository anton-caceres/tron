const QuienesSomos = () => (
  <section className="py-8 sm:py-12 px-4">
    <h2 className="text-3xl font-bold text-orange-500 text-center mb-6 sm:mb-8">Quiénes Somos</h2>
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <div className="bg-gray-900 rounded-2xl p-6 text-center space-y-3">
        <div className="text-4xl">🏢</div>
        <p className="font-semibold text-orange-400">Nuestra historia</p>
        <p className="text-gray-400 text-sm">Marca argentina de accesorios y equipamiento deportivo. Calidad + precio mayorista.</p>
      </div>
      <div className="bg-gray-900 rounded-2xl p-6 text-center space-y-3">
        <div className="text-4xl">🎯</div>
        <p className="font-semibold text-orange-400">Misión</p>
        <p className="text-gray-400 text-sm">Facilitar a negocios y profesores el acceso a equipamiento confiable.</p>
      </div>
      <div className="bg-gray-900 rounded-2xl p-6 text-center space-y-3">
        <div className="text-4xl">🌍</div>
        <p className="font-semibold text-orange-400">Visión</p>
        <p className="text-gray-400 text-sm">Ser referentes nacionales en distribución deportiva.</p>
      </div>
    </div>
  </section>
);
export default QuienesSomos;
