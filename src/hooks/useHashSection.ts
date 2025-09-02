import { useEffect, useMemo, useState } from "react";
import type { Section } from "../types";

const allowed: Section[] = [
  "inicio","quienes","catalogo","detalle",
  "mayoristas","contacto","carrito",
  "acceso","registro","recuperar",
  "checkout","orden-ok"
];

function parseHash(): Section | null {
  const h = (typeof window !== "undefined" ? window.location.hash : "").replace(/^#/, "");
  return allowed.includes(h as Section) ? (h as Section) : null;
}

/** Mantiene `section` sincronizada con location.hash */
export default function useHashSection(defaultSection: Section = "inicio") {
  const initial = useMemo<Section>(() => parseHash() ?? defaultSection, []);
  const [section, setSection] = useState<Section>(initial);

  // Cambios del hash (atrás/adelante o edición manual)
  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHash();
      if (parsed && parsed !== section) setSection(parsed);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [section]);

  // Empuja el hash cuando cambia la sección
  useEffect(() => {
    const target = `#${section}`;
    if (typeof window !== "undefined" && window.location.hash !== target) {
      history.pushState(null, "", target);
    }
  }, [section]);

  return [section, setSection] as const;
}
