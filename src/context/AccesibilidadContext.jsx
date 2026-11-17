// Accesibilidad (HU-15): tamaño de letra y alto contraste, recordados entre visitas.
import { createContext, useContext, useEffect, useState } from 'react';
import { leer, guardar } from '../helpers/almacenamiento';

const AccesibilidadContext = createContext(null);
const MIN = 0.875;
const MAX = 1.5;
const PASO = 0.125;

export function AccesibilidadProvider({ children }) {
  const [escala, setEscala] = useState(() => leer('avz-escala', 1));
  const [contraste, setContraste] = useState(() => leer('avz-contraste', false));

  useEffect(() => {
    document.documentElement.style.fontSize = `${escala * 100}%`;
    guardar('avz-escala', escala);
  }, [escala]);

  useEffect(() => {
    document.body.classList.toggle('alto-contraste', contraste);
    guardar('avz-contraste', contraste);
  }, [contraste]);

  const valor = {
    escala,
    contraste,
    aumentar: () => setEscala((e) => Math.min(MAX, e + PASO)),
    disminuir: () => setEscala((e) => Math.max(MIN, e - PASO)),
    alternarContraste: () => setContraste((c) => !c),
    restablecer: () => { setEscala(1); setContraste(false); },
    puedeAumentar: escala < MAX,
    puedeDisminuir: escala > MIN,
  };
  return <AccesibilidadContext.Provider value={valor}>{children}</AccesibilidadContext.Provider>;
}

export const useAccesibilidad = () => useContext(AccesibilidadContext);
