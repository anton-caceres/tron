import { useState, type FC } from "react";
import type { Section } from "../../types";

type Props = {
  cartCount: number;
  loggedIn: boolean;
  onLogout: () => void;
  onNav: (section: Section) => void;
};

const Header: FC<Props> = ({ cartCount, loggedIn, onLogout, onNav }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const items: { key: Section; label: string }[] = [
    { key: "inicio", label: "Inicio" },
    { key: "quienes", label: "Quiénes Somos" },
    { key: "catalogo", label: "Catálogo" },
    { key: "mayoristas", label: "Mayoristas" },
    { key: "contacto", label: "Contacto" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-900 p-3 sm:p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <button
          onClick={() => onNav("inicio")}
          className="text-xl sm:text-2xl font-extrabold text-orange-500"
          aria-label="Ir a inicio"
          title="TRON"
        >
          LOGO TRON
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4 text-gray-200">
          {items.map(({ key, label }) => (
            <button key={key} onClick={() => onNav(key)} className="hover:text-orange-400">
              {label}
            </button>
          ))}
          <button onClick={() => onNav("carrito")} className="relative bg-gray-800 px-3 py-1 rounded-lg">
            🛒 {cartCount}
          </button>
          {loggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-orange-400 font-semibold">Bienvenido, Mayorista</span>
              <button onClick={onLogout} className="bg-gray-700 px-3 py-1 rounded-lg">Cerrar sesión</button>
            </div>
          ) : (
            <button onClick={() => onNav("acceso")} className="bg-orange-500 text-black px-3 py-1 rounded-lg">
              Acceso Mayoristas
            </button>
          )}
        </nav>

        {/* Mobile actions */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => onNav("carrito")} className="bg-gray-800 px-3 py-2 rounded-lg">🛒 {cartCount}</button>
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
            {items.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { onNav(key); setMobileMenuOpen(false); }}
                className="w-full text-left hover:text-orange-400"
              >
                {label}
              </button>
            ))}
            {loggedIn ? (
              <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="w-full text-left">Cerrar sesión</button>
            ) : (
              <button onClick={() => { onNav("acceso"); setMobileMenuOpen(false); }} className="w-full text-left">Acceso Mayoristas</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
