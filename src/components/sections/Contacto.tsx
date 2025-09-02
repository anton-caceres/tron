const Contacto = () => (
  <section className="py-8 sm:py-12 px-4">
    <h2 className="text-3xl font-bold text-orange-500 text-center mb-6 sm:mb-8">Contacto</h2>
    <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 space-y-4 text-gray-200 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="c-nombre" className="block text-xs text-gray-400 mb-1">Nombre</label>
          <input id="c-nombre" type="text" placeholder="Nombre" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" />
        </div>
        <div>
          <label htmlFor="c-email" className="block text-xs text-gray-400 mb-1">Email</label>
          <input id="c-email" type="email" placeholder="Email" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" />
        </div>
        <div>
          <label htmlFor="c-whatsapp" className="block text-xs text-gray-400 mb-1">WhatsApp</label>
          <input id="c-whatsapp" type="text" placeholder="WhatsApp" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" />
        </div>
        <div>
          <label htmlFor="c-ciudad" className="block text-xs text-gray-400 mb-1">Ciudad / Provincia</label>
          <input id="c-ciudad" type="text" placeholder="Ciudad / Provincia" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" />
        </div>
      </div>
      <div>
        <label htmlFor="c-mensaje" className="block text-xs text-gray-400 mb-1">Mensaje</label>
        <textarea id="c-mensaje" placeholder="Mensaje" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" rows={4}></textarea>
      </div>
      <button className="w-full sm:w-auto bg-orange-500 text-black px-6 py-2 rounded-2xl hover:scale-105 transition">Enviar</button>
    </div>
  </section>
);
export default Contacto;
