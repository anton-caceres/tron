import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import jsPDF from "jspdf";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProductCard from "./components/catalog/ProductCard";

import type { Section, Product, CartItem, Company } from "./types";
import Inicio from "./components/sections/Inicio";
import QuienesSomos from "./components/sections/QuienesSomos";
import Mayoristas from "./components/sections/Mayoristas";
import Contacto from "./components/sections/Contacto";
import useHashSection from "./hooks/useHashSection";

export default function TronWireframes() {
  // Navegación
  const [section, setSection] = useHashSection("inicio");

  // Auth (simulada)
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Recupero (simulada) – dejamos solo isSending; removemos estados no usados
  const [isSending, setIsSending] = useState(false);

  // Utilidades
  const [orderId, setOrderId] = useState(
    `TRON-${Math.floor(Math.random() * 900000) + 100000}`
  );
  const formatARS = (v: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(v || 0);

  // Carrito
  const [cart, setCart] = useState<CartItem[]>([]);
  const addToCart = (item: Product, qty: number = 1) => {
    const q = Math.max(1, qty | 0);
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + q } : p));
      return [...prev, { ...item, qty: q }];
    });
  };
  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((p) => p.id !== id));
  const updateQty = (id: number, qty: number) =>
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty | 0) } : p))
    );
  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const cartSubtotal = cart.reduce((acc, i) => acc + i.qty * (i.precio || 0), 0);

  // ===== Persistencia de carrito (localStorage) =====
  // Cargar al iniciar
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tron_cart");
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch (err) {
      console.error("Error leyendo tron_cart:", err);
    }
  }, []);
  // Guardar en cada cambio
  useEffect(() => {
    try {
      localStorage.setItem("tron_cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Error guardando tron_cart:", err);
    }
  }, [cart]);

  // ===== Persistencia de login (opcional con “Recordarme”) =====
  // Cargar flags al montar
  useEffect(() => {
    try {
      const rawRemember = localStorage.getItem("tron_remember");
      const rawLogged = localStorage.getItem("tron_logged_in");
      if (rawRemember) setRememberMe(rawRemember === "1");
      if (rawLogged === "1") setLoggedIn(true);
    } catch (err) {
      console.error("Error leyendo estado de login:", err);
    }
  }, []);
  // Guardar cuando cambie loggedIn o rememberMe
  useEffect(() => {
    try {
      if (rememberMe && loggedIn) {
        localStorage.setItem("tron_remember", "1");
        localStorage.setItem("tron_logged_in", "1");
      } else {
        // si no quiere recordar o cierra sesión, limpiamos
        localStorage.removeItem("tron_logged_in");
        if (!rememberMe) localStorage.removeItem("tron_remember");
      }
    } catch (err) {
      console.error("Error guardando estado de login:", err);
    }
  }, [rememberMe, loggedIn]);

  // Checkout (controlados)
  const [company, setCompany] = useState<Company>({
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
  const cc =
    <K extends keyof Company>(k: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setCompany((c) => ({ ...c, [k]: e.target.value }));

  // Productos dummy
  const DummyProducts: Product[] = [
    { id: 1, nombre: "Guantes TRON Pro", precio: 15000, categoria: "Artes Marciales" },
    { id: 2, nombre: "Kimono Jiu-Jitsu", precio: 42000, categoria: "Artes Marciales" },
    { id: 3, nombre: "Medball 6kg", precio: 28000, categoria: "Funcional" },
    { id: 4, nombre: "Cinturón Negro", precio: 9000, categoria: "Artes Marciales" },
    { id: 5, nombre: "Banda Elástica", precio: 7000, categoria: "Funcional" },
    { id: 6, nombre: "Bolsa de Boxeo", precio: 85000, categoria: "Impacto" },
  ];

  // PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const marginLeft = 14;

    doc.setFontSize(18);
    doc.text("TRON Equipment - Comprobante de Pedido", marginLeft, 18);
    doc.setFontSize(12);
    doc.text(`Orden: ${orderId}`, marginLeft, 28);
    doc.text(`Fecha: ${new Date().toLocaleString("es-AR")}`, marginLeft, 34);

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
      if (y > 270) { doc.addPage(); y = 20; }
    });

    y += 4; doc.line(marginLeft, y, 196, y); y += 8;
    doc.setFontSize(14);
    doc.text(`Total: ${formatARS(cartSubtotal)}`, marginLeft, y);
    doc.setFontSize(10); y += 10;
    doc.text("Gracias por su compra. Este comprobante no es una factura.", marginLeft, y);
    doc.save(`${orderId}.pdf`);
  };

  /* Detalle / Carrito / Acceso / etc. */
  const DetalleProducto = () => (
    <section className="py-10 px-4 max-w-4xl mx-auto">
      <button onClick={() => setSection("catalogo")} className="text-sm text-orange-400 underline mb-4">
        ← Volver al catálogo
      </button>
      <h2 className="text-2xl font-bold text-orange-500 mb-4">Detalle de Producto</h2>
      <p className="text-gray-300">Detalle (placeholder). Acá después cargamos data real.</p>
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
                      aria-label={`Cantidad para ${item.nombre}`}
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateQty(item.id, parseInt(e.target.value || "1", 10))}
                      className="w-16 p-1 rounded text-black bg-white border border-gray-400"
                    />
                    <span className="text-sm text-gray-300 w-24 sm:w-28 text-right">
                      {formatARS(item.qty * (item.precio || 0))}
                    </span>
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
          </>
        )}
      </div>
    </section>
  );

  const Acceso = () => (
    <section className="py-10 px-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-orange-500 mb-4 text-center">Acceso Mayoristas</h2>
      <div className="bg-gray-900 rounded-2xl p-6 space-y-4 text-gray-200">
        <div>
          <label htmlFor="login-email" className="block text-xs text-gray-400 mb-1">Email</label>
          <input id="login-email" type="email" placeholder="Email" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" />
        </div>
        <div>
          <label htmlFor="login-pass" className="block text-xs text-gray-400 mb-1">Contraseña</label>
          <input id="login-pass" type="password" placeholder="Contraseña" className="w-full p-2 rounded-lg text-black bg-white border border-gray-400" />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          Recordarme
        </label>
        <button
          onClick={() => {
            setIsLoggingIn(true);
            setLoginError("");
            setLoginSuccess(false);
            setTimeout(() => {
              setIsLoggingIn(false);
              setLoggedIn(true);
              setLoginSuccess(true);
              setSection("catalogo");
              setTimeout(() => setLoginSuccess(false), 1000);
            }, 800);
          }}
          disabled={isLoggingIn}
          className={`w-full py-2 rounded-2xl font-semibold transition ${isLoggingIn ? "bg-gray-700 text-gray-300" : "bg-orange-500 text-black hover:scale-105"}`}
        >
          {isLoggingIn ? "Validando..." : "Iniciar Sesión"}
        </button>
        {loginError && <div className="bg-red-700 rounded-xl p-3 text-sm text-white">{loginError}</div>}
        {loginSuccess && <div className="bg-gray-800 rounded-xl p-3 text-sm text-gray-200">Login exitoso.</div>}
      </div>
    </section>
  );

  const Registro = () => <section className="py-10 px-4 text-center"><h2 className="text-2xl font-bold text-orange-500">Registro Mayorista</h2></section>;
  const Recuperar = () => <section className="py-10 px-4 text-center"><h2 className="text-2xl font-bold text-orange-500">Recuperar contraseña</h2></section>;

  const Checkout = () => (
    <section className="py-10 px-4 text-center">
      <h2 className="text-2xl font-bold text-orange-500 mb-2">Checkout</h2>
      <button
        onClick={() => {
          setOrderId(`TRON-${Math.floor(Math.random() * 900000) + 100000}`);
          setSection("orden-ok");
        }}
        className="bg-orange-500 text-black px-4 py-2 rounded-2xl"
      >
        Confirmar pedido
      </button>
    </section>
  );

  const Catalogo = () => (
    <section className="py-8 sm:py-12 px-4">
      <h2 className="text-3xl font-bold text-orange-500 text-center mb-6 sm:mb-8">
        Catálogo
      </h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
        {DummyProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            formatARS={formatARS}
            onAdd={(prod, qty) => addToCart(prod, qty)}
            onView={() => setSection("detalle")}
          />
        ))}
      </div>
    </section>
  );

  const OrdenOK = () => (
    <section className="py-12 sm:py-16 text-center space-y-4 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-orange-500">¡Pedido confirmado!</h2>
      <p className="text-gray-300">
        Tu número de orden es <span className="text-orange-400 font-semibold">{orderId}</span>.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => setSection("catalogo")} className="bg-gray-700 px-4 py-2 rounded-2xl">
          Seguir comprando
        </button>
        <button onClick={generatePDF} className="bg-orange-500 text-black px-4 py-2 rounded-2xl">
          Descargar comprobante (PDF)
        </button>
      </div>
    </section>
  );

  const renderSection = () => {
    switch (section) {
      case "inicio": return <Inicio onNav={setSection} />;
      case "quienes": return <QuienesSomos />;
      case "catalogo": return <Catalogo />;
      case "detalle": return <DetalleProducto />;
      case "mayoristas": return <Mayoristas />;
      case "contacto": return <Contacto />;
      case "carrito": return <Carrito />;
      case "acceso": return <Acceso />;
      case "registro": return <Registro />;
      case "recuperar": return <Recuperar />;
      case "checkout": return <Checkout />;
      case "orden-ok": return <OrdenOK />;
      default: return <Inicio onNav={setSection} />;
    }
  };

  useEffect(() => {
    // debug
    // console.log("App montada");
  }, []);

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      <Header
        cartCount={cartCount}
        loggedIn={loggedIn}
        onLogout={() => setLoggedIn(false)}
        onNav={setSection}
      />
      {renderSection()}
      <Footer />
    </div>
  );
}
