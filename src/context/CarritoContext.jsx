// Carrito de compras (HU-09): estado global persistido en el navegador.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { leer, guardar } from '../helpers/almacenamiento';
import { IVA } from '../config';

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => leer('avz-carrito', []));

  useEffect(() => guardar('avz-carrito', items), [items]);

  /** Agrega un producto respetando el stock disponible. Devuelve la cantidad realmente agregada. */
  const agregar = (producto, cantidad = 1) => {
    const actual = items.find((i) => i.id === producto.id)?.cantidad || 0;
    const posible = Math.max(0, Math.min(cantidad, producto.stock - actual));
    if (posible === 0) return 0;
    setItems((prev) => {
      const existe = prev.find((i) => i.id === producto.id);
      if (existe) return prev.map((i) => (i.id === producto.id ? { ...i, cantidad: i.cantidad + posible, stock: producto.stock } : i));
      const { id, nombre, precio, imagen, stock, categoria } = producto;
      return [...prev, { id, nombre, precio, imagen, stock, categoria, cantidad: posible }];
    });
    return posible;
  };

  const cambiarCantidad = (id, cantidad) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock)) } : i)));

  const quitar = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const vaciar = () => setItems([]);

  const totales = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const iva = Math.round(subtotal * IVA * 100) / 100;
    return { unidades: items.reduce((s, i) => s + i.cantidad, 0), subtotal, iva, total: subtotal + iva };
  }, [items]);

  return (
    <CarritoContext.Provider value={{ items, agregar, cambiarCantidad, quitar, vaciar, ...totales }}>
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);
