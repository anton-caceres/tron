import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function TronWireframes() {
  // ===== Navegación =====
  const [section, setSection] = useState("inicio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ===== Auth (simulada) =====
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // ===== Recuperar contraseña (simulada) =====
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [recoveryError, setRecoveryError] = useState("");

  // ===== Utilidades =====
  const [orderId, setOrderId] = useState(`TRON-${Math.floor(Math.random() * 900000) + 100000}`);
  const formatARS = (v) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(v || 0);

  // ===== Carrito =====
  const [cart, setCart] = useState([]); // [{id, nombre, precio, qty}]
  const addToCart = (item, qty = 1) => {
    const q = Math.max(1, qty | 0);
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + q } : p));
      return [...prev, { ...item, qty: q }];
    });
  };
  const removeFromCart = (id) => setCart((prev) => prev.filter((p) => p.id !== id));
  const updateQty = (id, qty) => setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty | 0) } : p)));
  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const cartSubtotal = cart.reduce((acc, i) => acc + i.qty * (i.precio || 0), 0);

  // ===== Datos de Checkout (controlados) =====
  const [company, setCompany] = useState({
    razon: "",
    cuit: "",
    iva: "",
    address: "",
    city: "",
    province: "",
    cp: "",
    shipping: "",
    payment: "",
  });
  const cc = (k) => ({ target }) => setCompany((c) => ({ ...c, [k]: target.value }));

  // ===== Productos dummy =====
  const DummyProducts = [
    { id: 1, nombre: "Guantes TRON Pro", precio: 15000, categoria: "Artes Marciales" },
    { id: 2, nombre: "Kimono Jiu-Jitsu", precio: 42000, categoria: "Artes Marciales" },
    { id: 3, nombre: "Medball 6kg", precio: 28000, categoria: "Funcional" },
    { id: 4, nombre: "Cinturón Negro", precio: 9000, categoria: "Artes Marciales" },
    { id: 5, nombre: "Banda Elástica", precio: 7000, categoria: "Funcional" },
    { id: 6, nombre: "Bolsa de Boxeo", precio: 85000, categoria: "Impacto" },
  ];

  // ===== Acciones simuladas =====
  const handleLogin = () => {
    setIsLoggingIn(true);
    setLoginError("");
    setLoginSuccess(false);
    setTimeout(() => {
      setIsLoggingIn(false);
      if (Math.random() > 0.5) {
        setLoginSuccess(true);
        setLoggedIn(true);
        setTimeout(() => {
          setSection("catalogo");
          setLoginSuccess(false);
        }, 1200);
      } else {
        setLoginError("Email o contraseña inválidos.");
      }
    }, 900);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setRememberMe(false);
    setLoginError("");
    setLoginSuccess(false);
    setSection("inicio");
  };

  const handleRecovery = () => {
    setIsSending(true);
    setRecoveryError("");
    setTimeout(() => {
      setIsSending(false);
      if (Math.random() > 0.3) setSent(true);
      else setRecoveryError("Este email no está registrado en el sistema.");
    }, 1200);
  };

  // ===== Helpers =====
  const WHATSAPP_PHONE = "5493584348768";
  const buildWhatsAppMessage = (cartItems, total, header = "Solicitud de compra mayorista TRON") => {
    const items = cartItems
      .map((i) => `• ${i.nombre} x${i.qty} = ${formatARS(i.qty * (i.precio || 0))}`)
      .join("\n");
    return `${header}\n\n${items}\n\nTotal: ${formatARS(total)}`;
  };

  // ===== PDF =====
  const generatePDF = () => {
    const doc = new jsPDF();
    const marginLeft = 14;

    doc.setFontSize(18);
    doc.text("TRON Equipment - Comprobante de Pedido", marginLeft, 18);

    doc.setFontSize(12);
    doc.text(`Orden: ${orderId}`, marginLeft, 28);
    doc.text(`Fecha: ${new Date().toLocaleString("es-AR")}`, marginLeft, 34);

    // Datos de empresa
    const rz = company.razon || "—";
    const cuit = company.cuit || "—";
    const iva = company.iva || "—";
    const addr = company.address || "—";
    const loc = `${company.city || "—"} / ${company.province || "—"} (${company.cp || "—"})`;
    const ship = company.shipping || "—";
    const pay = company.payment || "—";

    doc.text(`Razón social: ${rz}`, marginLeft, 44);
    doc.text(`CUIT: ${cuit}    IVA: ${iva}`, marginLeft, 50);
    doc.text(`Dirección: ${addr}`, marginLeft, 56);
    doc.text(`Localidad: ${loc}`, marginLeft, 62);
    doc.text(`Envío: ${ship}`, marginLeft, 68);
    doc.text(`Pago: ${pay}`, marginLeft, 74);

    let y = 86;
    doc.text("Producto", marginLeft, y);
    doc.text("Cant.", 150, y);
    doc.text("Subtotal", 196, y, { align: "right" });
    y += 6;

    cart.forEach((i) => {
      doc.text(i.nombre, marginLeft, y);
      doc.text(String(i.qty), 155, y);
      doc.text(formatARS(i.qty * (i.precio || 0)), 196, y, { align: "right" });
      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    y += 4;
    doc.line(marginLeft, y, 196, y);
    y += 8;
    doc.setFontSize(14);
    doc.text(`Total: ${formatARS(cartSubtotal)}`, marginLeft, y);

    doc.setFontSize(10);
    y += 10;
    doc.text("Gracias por su compra. Este comprobante no es una factura.", marginLeft, y);

    doc.save(`${orderId}.pdf`);
  };

  // ===== WhatsApp (desde Carrito) =====
  const openWhatsApp = () => {
    const body = buildWhatsAppMessage(cart, cartSubtotal);
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(body)}`;
    try {
      window.open(url, "_blank");
    } catch (e) {
      /* noop */
    }
  };

  // ===== Secciones =====
  const Inicio = () => (
    <section className="text-center py-8 sm:py-12 space-y-6 px-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-orange-500">TRON Mayoristas</h2>
      <p className="text-lg sm:text-xl text-gray-200">“Acompañamos tu crecimiento”</p>
      <div className="bg-gray-900 rounded-2xl p-6 sm:p-10 flex flex-col items-center space-y-6">
        <div className="bg-gray-700 w-full h-36 sm:h-48 flex items-center justify-center rounded-lg">Slider / Imagen destacada</div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button onClick={() => setSection("catalogo")} className="w-full sm:w-auto bg-orange-500 text-black px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition">
            Ver Catálogo
          </button>
          <button onClick={() => setSection("mayoristas")} className="w-full sm:w-auto bg-gray-800 px-6 py-3 rounded-2xl hover:scale-105 transition">
            Beneficios Mayoristas
          </button>
        </div>
      </div>
    </section>
  );

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

  const [showFilters, setShowFilters] = useState(false);
  const Catalogo = () => (
    <section className="py-8 sm:py-12 px-4">
      <h2 className="text-3xl font-bold text-orange-500 text-center mb-6 sm:mb-8">Catálogo</h2>

      {/* Toggle filtros en mobile */}
      <div className="md:hidden mb-4">
        <button onClick={() => setShowFilters((v) => !v)} className="w-full bg-gray-800 rounded-xl p-3 text-left flex items-center justify-between">
          <span className="text-orange-400 font-semibold">Categorías y filtros</span>
          <span>{showFilters ? "▲" : "▼"}</span>
        </button>
        {showFilters && (
          <aside className="mt-3 bg-gray-900 p-4 rounded-2xl space-y-4">
            <input type="text" placeholder="Buscar productos..." className="w-full p-2 rounded border border-gray-400 text-black bg-white" />
            <Categorias />
          </aside>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar categorías desktop */}
        <aside className="hidden md:block w-full md:w-1/4 bg-gray-900 p-4 rounded-2xl space-y-4 h-max">
          <input type="text" placeholder="Buscar productos..." className="w-full p-2 rounded border border-gray-400 text-black bg-white" />
          <Categorias />
        </aside>

        {/* Grilla productos */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
          {DummyProducts.map((p) => (
            <div key={p.id} className="bg-gray-900 p-4 sm:p-6 rounded-2xl flex flex-col items-center space-y-3">
              <div className="w-full h-28 sm:h-32 bg-gray-700 flex items-center justify-center rounded">Img</div>
              <p className="text-white font-semibold text-center text-sm sm:text-base">{p.nombre}</p>
              <p className="text-gray-400 text-xs sm:text-sm">{formatARS(p.precio)}</p>
              <div className="flex items-center gap-2 w-full justify-center">
                <input type="number" min={1} defaultValue={1} id={`qty-${p.id}`} className="w-16 sm:w-20 p-1 rounded border border-gray-400 text-black bg-white" />
                <button
                  onClick={() => {
                    const el = document.getElementById(`qty-${p.id}`);
                    const qty = parseInt(el?.value ?? 1, 10) || 1;
                    addToCart(p, qty);
                  }}
                  className="bg-orange-500 text-black px-3 py-1 rounded-lg hover:scale-105 transition"
                >
                  Agregar
                </button>
              </div>
              <button onClick={() => setSection("detalle")} className="text-xs text-orange-400 underline">
                Ver detalle
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Categorias = () => (
    <>
      <p className="font-semibold text-orange-400">Categorías</p>
      <ul className="space-y-2 text-gray-300 text-sm">
        <li>
          Accesorios y Entrenamiento Funcional
          <ul className="ml-4 list-disc text-gray-400 text-xs space-y-1">
            <li>Protecciones y combate</li>
            <li>Bolsas e impacto</li>
            <li>Entrenamiento funcional</li>
            <li>Medballs y fuerza</li>
            <li>Pesas y barras</li>
            <li>Equipamiento de gimnasio</li>
          </ul>
        </li>
        <li>
          Artes Marciales
          <ul className="ml-4 list-disc text-gray-400 text-xs space-y-1">
            <li>Kimonos</li>
            <li>Cinturones</li>
            <li>Protectores</li>
            <li>Guantes</li>
            <li>Ropa</li>
            <li>Bolsos y mochilas</li>
          </ul>
        </li>
      </ul>
    </>
  );

  const DetalleProducto = () => (
    <section className="py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto mb-4">
        <button onClick={() => setSection("catalogo")} className="text-sm text-orange-400 underline">
          ← Volver al catálogo
        </button>
      </div>
      <h2 className="text-3xl font-bold text-orange-500 text-center mb-6 sm:mb-8">Detalle de Producto</h2>
      <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
        <div className="w-full md:w-1/2 bg-gray-700 h-56 sm:h-64 flex items-center justify-center rounded">Foto grande</div>
        <div className="w-full md:w-1/2 space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold">Producto demo</h3>
          <p className="text-gray-300 text-sm sm:text-base">Descripción detallada del producto con beneficios y características.</p>
          <div className="flex items-center gap-3">
            <input type="number" min={1} defaultValue={1} id="qty-detalle" className="w-16 sm:w-20 p-1 rounded border border-gray-400 text-black bg-white" />
            <button
              className="bg-orange-500 text-black px-5 sm:px-6 py-2 rounded-2xl hover:scale-105 transition"
              onClick={() => {
                const el = document.getElementById("qty-detalle");
                const qty = parseInt(el?.value ?? 1, 10) || 1;
                addToCart({ id: 99, nombre: "Producto demo", precio: 12345 }, qty);
              }}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </section>
  );

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

  const Contacto = () => (
    <section className="py-8 sm:py-12 px-4">
      <h2 className="text-3xl font-bold text-orange-500 text-center mb-6 sm:mb-8">Contacto</h2>
      <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 space-y-4 text-gray-200 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="text" placeholder="Nombre" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" />
          <input type="email" placeholder="Email" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" />
          <input type="text" placeholder="WhatsApp" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" />
          <input type="text" placeholder="Ciudad / Provincia" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" />
        </div>
        <textarea placeholder="Mensaje" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" rows={4}></textarea>
        <button className="w-full sm:w-auto bg-orange-500 text-black px-6 py-2 rounded-2xl hover:scale-105 transition">Enviar</button>
      </div>
    </section>
  );

  const Acceso = () => (
    <section className="py-8 sm:py-12 px-4">
      <h2 className="text-3xl font-bold text-orange-500 text-center mb-6 sm:mb-8">Acceso Mayoristas</h2>
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-auto space-y-4 text-gray-200">
        <input type="email" placeholder="Email" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" />
        <input type="password" placeholder="Contraseña" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" />
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          Recordarme
        </label>
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className={`w-full py-2 rounded-2xl font-semibold transition ${isLoggingIn ? "bg-gray-700 text-gray-300" : "bg-orange-500 text-black hover:scale-105"}`}
        >
          {isLoggingIn ? "Validando..." : "Iniciar Sesión"}
        </button>
        {loginError && <div className="bg-red-700 rounded-xl p-3 text-sm text-white">{loginError}</div>}
        {loginSuccess && <div className="bg-gray-800 rounded-xl p-3 text-sm text-gray-200">Login exitoso. Redirigiendo…</div>}
        <button
          onClick={() => {
            setSection("recuperar");
            setSent(false);
            setIsSending(false);
            setRecoveryError("");
          }}
          className="text-sm text-orange-400 w-full text-center hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
        <div className="text-center text-sm text-gray-400">¿No tenés cuenta?</div>
        <button onClick={() => setSection("registro")} className="w-full bg-gray-700 py-2 rounded-2xl hover:scale-105 transition">
          Registrarse como Mayorista
        </button>
      </div>
    </section>
  );

  const Registro = () => (
    <section className="py-8 sm:py-12 px-4">
      <h2 className="text-3xl font-bold text-orange-500 text-center mb-6 sm:mb-8">Registro Mayorista</h2>
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-xl mx-auto space-y-4 text-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="p-2 rounded text-black bg-white border border-gray-400" placeholder="Email" />
          <input className="p-2 rounded text-black bg-white border border-gray-400" placeholder="Contraseña" />
          <input className="p-2 rounded text-black bg-white border border-gray-400" placeholder="Razón social" />
          <input className="p-2 rounded text-black bg-white border border-gray-400" placeholder="CUIT" />
          <input className="p-2 rounded text-black bg-white border border-gray-400" placeholder="WhatsApp" />
          <input className="p-2 rounded text-black bg-white border border-gray-400" placeholder="Ciudad / Provincia" />
        </div>
        <button className="w-full bg-orange-500 text-black py-2 rounded-2xl">Crear cuenta</button>
        <button onClick={() => setSection("acceso")} className="w-full text-orange-400 text-sm underline">
          Ya tengo cuenta
        </button>
      </div>
    </section>
  );

  const Recuperar = () => (
    <section className="py-8 sm:py-12 px-4">
      <h2 className="text-3xl font-bold text-orange-500 text-center mb-6 sm:mb-8">Recuperar contraseña</h2>
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-auto space-y-4 text-gray-200">
        {!sent && (
          <>
            <p className="text-sm text-gray-300">Ingresá tu email y te enviaremos un enlace para restablecer la contraseña.</p>
            <input type="email" placeholder="Email" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" />
            <button
              disabled={isSending}
              onClick={handleRecovery}
              className={`w-full py-2 rounded-2xl font-semibold transition ${isSending ? "bg-gray-700 text-gray-300" : "bg-orange-500 text-black hover:scale-105"}`}
            >
              {isSending ? "Enviando..." : "Enviar enlace"}
            </button>
          </>
        )}
        {isSending && <div className="text-center text-sm text-gray-400">Procesando solicitud...</div>}
        {recoveryError && <div className="bg-red-700 rounded-xl p-4 text-sm text-white">{recoveryError}</div>}
        {sent && <div className="bg-gray-800 rounded-xl p-4 text-sm text-gray-200">Si la cuenta existe, te enviamos un mail con instrucciones.</div>}
        <button
          onClick={() => {
            setSection("acceso");
            setSent(false);
            setIsSending(false);
            setRecoveryError("");
          }}
          className="text-sm text-orange-400 w-full text-center hover:underline"
        >
          Volver a Acceso Mayoristas
        </button>
      </div>
    </section>
  );

  const Carrito = () => (
    <section className="py-8 sm:py-12 px-4">
      <h2 className="text-3xl font-bold text-orange-500 text-center mb-6 sm:mb-8">Carrito</h2>
      <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 space-y-4 text-gray-200 max-w-3xl mx-auto">
        {cart.length === 0 ? (
          <div className="text-center text-gray-400">Tu carrito está vacío.</div>
        ) : (
          <>
            <ul className="divide-y divide-gray-800">
              {cart.map((item) => (
                <li key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold text-sm sm:text-base">{item.nombre}</p>
                    <p className="text-xs sm:text-sm text-gray-400">{formatARS(item.precio)} c/u</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateQty(item.id, parseInt(e.target.value || "1", 10))}
                      className="w-16 p-1 rounded text-black bg-white border border-gray-400"
                    />
                    <span className="text-sm text-gray-300 w-24 sm:w-28 text-right">{formatARS(item.qty * (item.precio || 0))}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-sm bg-gray-700 px-3 py-1 rounded-lg">
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <p className="text-base sm:text-lg">Subtotal</p>
              <p className="text-lg sm:text-xl font-bold text-orange-400">{formatARS(cartSubtotal)}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button onClick={() => setSection("catalogo")} className="w-full sm:w-auto bg-gray-700 px-4 py-2 rounded-lg">
                Seguir comprando
              </button>
              <button onClick={() => setSection("checkout")} className="w-full sm:w-auto bg-orange-500 text-black px-4 py-2 rounded-lg">
                Iniciar checkout
              </button>
              <button onClick={openWhatsApp} className="w-full sm:w-auto bg-green-500 text-black px-4 py-2 rounded-lg">
                Confirmar compra por WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );

  const Checkout = () => (
    <section className="py-8 sm:py-12 px-4">
      <h2 className="text-3xl font-bold text-orange-500 text-center mb-6 sm:mb-8">Checkout Mayorista</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 space-y-3">
            <p className="font-semibold text-orange-400">1) Datos de empresa</p>
            <input className="w-full p-2 rounded text-black bg-white border border-gray-400" placeholder="Razón social" value={company.razon} onChange={cc("razon")} />
            <input className="w-full p-2 rounded text-black bg-white border border-gray-400" placeholder="CUIT" value={company.cuit} onChange={cc("cuit")} />
            <select className="w-full p-2 rounded text-black bg-white border border-gray-400" value={company.iva} onChange={cc("iva")}>
              <option value="">Condición IVA</option>
              <option>Responsable Inscripto</option>
              <option>Monotributo</option>
              <option>Exento</option>
            </select>
          </div>
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 space-y-3">
            <p className="font-semibold text-orange-400">2) Envío</p>
            <input className="w-full p-2 rounded text-black bg-white border border-gray-400" placeholder="Dirección" value={company.address} onChange={cc("address")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="p-2 rounded text-black bg-white border border-gray-400" placeholder="Ciudad" value={company.city} onChange={cc("city")} />
              <input className="p-2 rounded text-black bg-white border border-gray-400" placeholder="Provincia" value={company.province} onChange={cc("province")} />
            </div>
            <input className="w-full p-2 rounded text-black bg-white border border-gray-400" placeholder="Código Postal" value={company.cp} onChange={cc("cp")} />
            <select className="w-full p-2 rounded text-black bg-white border border-gray-400" value={company.shipping} onChange={cc("shipping")}>
              <option value="">Método de envío</option>
              <option>Transporte a cargo del cliente</option>
              <option>OCA / Correo</option>
              <option>Retiro en local</option>
            </select>
          </div>
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 space-y-3">
            <p className="font-semibold text-orange-400">3) Pago</p>
            <select className="w-full p-2 rounded text-black bg-white border border-gray-400" value={company.payment} onChange={cc("payment")}>
              <option value="">Medio de pago</option>
              <option>Transferencia bancaria</option>
              <option>Cuenta corriente (aprobada)</option>
              <option>Tarjeta (link de pago)</option>
            </select>
          </div>
        </div>
        <aside className="bg-gray-900 rounded-2xl p-4 sm:p-6 space-y-4">
          <p className="font-semibold text-orange-400">Resumen del pedido</p>
          {cart.length === 0 ? (
            <p className="text-sm text-gray-400">No hay productos.</p>
          ) : (
            <ul className="text-sm space-y-2">
              {cart.map((i) => (
                <li key={i.id} className="flex justify-between">
                  <span>
                    {i.nombre} x{i.qty}
                  </span>
                  <span>{formatARS(i.qty * (i.precio || 0))}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between border-t border-gray-800 pt-2">
            <span>Total estimado</span>
            <span className="font-bold text-orange-400">{formatARS(cartSubtotal)}</span>
          </div>
          <button
            onClick={() => {
              setOrderId(`TRON-${Math.floor(Math.random() * 900000) + 100000}`);
              setSection("orden-ok");
            }}
            className="w-full bg-orange-500 text-black py-2 rounded-2xl"
          >
            Confirmar pedido
          </button>
          <button className="w-full bg-gray-700 py-2 rounded-2xl">Solicitar cotización por WhatsApp</button>
          <button onClick={() => setSection("carrito")} className="w-full text-orange-400 text-sm underline">
            Volver al carrito
          </button>
        </aside>
      </div>
    </section>
  );

  const OrdenOK = () => (
    <section className="py-12 sm:py-16 text-center space-y-4 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-orange-500">¡Pedido confirmado!</h2>
      <p className="text-gray-300">
        Tu número de orden es <span className="text-orange-400 font-semibold">{orderId}</span>.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => setSection("catalogo")} className="w-full sm:w-auto bg-gray-700 px-4 py-2 rounded-2xl">
          Seguir comprando
        </button>
        <button onClick={generatePDF} className="w-full sm:w-auto bg-orange-500 text-black px-4 py-2 rounded-2xl">
          Descargar comprobante (PDF)
        </button>
      </div>
    </section>
  );

  const renderSection = () => {
    switch (section) {
      case "inicio":
        return <Inicio />;
      case "quienes":
        return <QuienesSomos />;
      case "catalogo":
        return <Catalogo />;
      case "detalle":
        return <DetalleProducto />;
      case "mayoristas":
        return <Mayoristas />;
      case "contacto":
        return <Contacto />;
      case "acceso":
        return <Acceso />;
      case "registro":
        return <Registro />;
      case "recuperar":
        return <Recuperar />;
      case "carrito":
        return <Carrito />;
      case "checkout":
        return <Checkout />;
      case "orden-ok":
        return <OrdenOK />;
      default:
        return <Inicio />;
    }
  };

  // ===== Dev tests (ligeros) =====
  const runDebugTests = () => {
    try {
      const msg1 = buildWhatsAppMessage([{ nombre: "A", qty: 2, precio: 1000 }], 2000);
      console.assert(msg1.includes("• A x2"), "WhatsApp msg debe incluir bullet y cantidad");
      const lines = msg1.split("\n");
      console.assert(lines.length >= 4, "WhatsApp msg debe tener saltos de línea");
      const m = formatARS(12345);
      console.assert(typeof m === "string" && m.length > 1, "formatARS debe devolver string");
    } catch (e) {
      console.error("Debug tests failed", e);
    }
  };

  useEffect(() => {
    runDebugTests();
  }, []);

  // ===== Layout =====
  return (
    <div className="bg-black min-h-screen text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900 p-3 sm:p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="text-xl sm:text-2xl font-extrabold text-orange-500">LOGO TRON</div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 text-gray-200">
            <button onClick={() => setSection("inicio")} className="hover:text-orange-400">Inicio</button>
            <button onClick={() => setSection("quienes")} className="hover:text-orange-400">Quiénes Somos</button>
            <button onClick={() => setSection("catalogo")} className="hover:text-orange-400">Catálogo</button>
            <button onClick={() => setSection("mayoristas")} className="hover:text-orange-400">Mayoristas</button>
            <button onClick={() => setSection("contacto")} className="hover:text-orange-400">Contacto</button>
            <button onClick={() => setSection("carrito")} className="relative bg-gray-800 px-3 py-1 rounded-lg">🛒 {cartCount}</button>
            {loggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-orange-400 font-semibold">Bienvenido, Mayorista</span>
                <button onClick={handleLogout} className="bg-gray-700 px-3 py-1 rounded-lg">Cerrar sesión</button>
              </div>
            ) : (
              <button onClick={() => setSection("acceso")} className="bg-orange-500 text-black px-3 py-1 rounded-lg">Acceso Mayoristas</button>
            )}
          </nav>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setSection("carrito")} className="bg-gray-800 px-3 py-2 rounded-lg">🛒 {cartCount}</button>
            <button onClick={() => setMobileMenuOpen(true)} className="bg-gray-800 px-3 py-2 rounded-lg">☰</button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="absolute right-0 top-0 h-full w-72 bg-gray-900 p-4 space-y-3 shadow-xl">
              <div className="flex justify-between items-center">
                <span className="text-orange-400 font-bold">Menú</span>
                <button onClick={() => setMobileMenuOpen(false)} className="bg-gray-800 px-3 py-1 rounded-lg">✕</button>
              </div>
              <button onClick={() => { setSection('inicio'); setMobileMenuOpen(false); }} className="w-full text-left hover:text-orange-400">Inicio</button>
              <button onClick={() => { setSection('quienes'); setMobileMenuOpen(false); }} className="w-full text-left hover:text-orange-400">Quiénes Somos</button>
              <button onClick={() => { setSection('catalogo'); setMobileMenuOpen(false); }} className="w-full text-left hover:text-orange-400">Catálogo</button>
              <button onClick={() => { setSection('mayoristas'); setMobileMenuOpen(false); }} className="w-full text-left hover:text-orange-400">Mayoristas</button>
              <button onClick={() => { setSection('contacto'); setMobileMenuOpen(false); }} className="w-full text-left hover:text-orange-400">Contacto</button>
              {loggedIn ? (
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left">Cerrar sesión</button>
              ) : (
                <button onClick={() => { setSection('acceso'); setMobileMenuOpen(false); }} className="w-full text-left">Acceso Mayoristas</button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Contenido */}
      {renderSection()}

      {/* Mobile bottom bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-gray-900 border-t border-gray-800 p-2 flex items-center justify-around">
        <button onClick={() => setSection('inicio')} className="text-sm">Inicio</button>
        <button onClick={() => setSection('catalogo')} className="text-sm">Catálogo</button>
        <button onClick={() => setSection('carrito')} className="text-sm">🛒 {cartCount}</button>
        <button onClick={() => setSection('acceso')} className="text-sm">Acceso</button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 p-6 pb-16 md:pb-6 text-center text-gray-400 text-sm space-y-2 mt-8">
        <p>© 2025 TRON Equipment – Todos los derechos reservados</p>
        <p>Links rápidos: Inicio | Catálogo | Mayoristas | Contacto</p>
        <p className="hidden sm:flex justify-center gap-4">
          <span>📞</span>
          <span>📸</span>
          <span>🌍</span>
        </p>
      </footer>
    </div>
  );
}
