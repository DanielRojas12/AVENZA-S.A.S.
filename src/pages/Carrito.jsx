// Carrito de compras (requisito r / HU-09)
import { useState } from 'react';
import Icon from '../components/Icon';
import Confirmar from '../components/Confirmar';
import { Vacio } from '../components/Estados';
import { useCarrito } from '../context/CarritoContext';
import { moneda } from '../helpers/formato';
import { Link } from '../router/Router';

export default function Carrito() {
  const { items, cambiarCantidad, quitar, vaciar, subtotal, iva, total, unidades } = useCarrito();
  const [confirmarVaciar, setConfirmarVaciar] = useState(false);

  if (!items.length) {
    return (
      <div className="container py-5">
        <h1 className="fw-bold text-avenza">Carrito de compras</h1>
        <Vacio titulo="Tu carrito está vacío" icono="cart-shopping">
          <p>Agrega pasaportes o souvenirs desde la tienda.</p>
          <Link to="/tienda" className="btn btn-success">Ir a la tienda</Link>
        </Vacio>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="fw-bold text-avenza">Carrito de compras</h1>
      <p>{unidades} {unidades === 1 ? 'producto' : 'productos'} en tu carrito.</p>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="table-responsive">
            <table className="table align-middle">
              <caption className="visually-hidden">Productos en el carrito</caption>
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col" className="text-end">Precio</th>
                  <th scope="col" className="text-center">Cantidad</th>
                  <th scope="col" className="text-end">Subtotal</th>
                  <th scope="col"><span className="visually-hidden">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={i.imagen} alt="" width="64" height="43" className="rounded" />
                        <span>{i.nombre}</span>
                      </div>
                    </td>
                    <td className="text-end">{moneda(i.precio)}</td>
                    <td>
                      <div className="input-group input-group-sm justify-content-center flex-nowrap" role="group" aria-label={`Cantidad de ${i.nombre}`}>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => cambiarCantidad(i.id, i.cantidad - 1)}
                          disabled={i.cantidad <= 1} aria-label={`Disminuir cantidad de ${i.nombre}`}><Icon name="minus" /></button>
                        <span className="input-group-text bg-white" aria-live="polite">{i.cantidad}</span>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => cambiarCantidad(i.id, i.cantidad + 1)}
                          disabled={i.cantidad >= i.stock} aria-label={`Aumentar cantidad de ${i.nombre}`}><Icon name="plus" /></button>
                      </div>
                      {i.cantidad >= i.stock && <p className="small text-secondary text-center mb-0">Máximo disponible</p>}
                    </td>
                    <td className="text-end fw-semibold">{moneda(i.precio * i.cantidad)}</td>
                    <td className="text-end">
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => quitar(i.id)} aria-label={`Quitar ${i.nombre} del carrito`}>
                        <Icon name="trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between">
            <Link to="/tienda" className="btn btn-outline-success"><Icon name="arrow-left" /> Seguir comprando</Link>
            <button type="button" className="btn btn-outline-danger" onClick={() => setConfirmarVaciar(true)}>Vaciar carrito</button>
          </div>
        </div>
        <aside className="col-lg-4" aria-labelledby="titulo-resumen">
          <div className="card shadow-sm resumen-compra">
            <div className="card-body">
              <h2 id="titulo-resumen" className="h5">Resumen del pedido</h2>
              <Resumen subtotal={subtotal} iva={iva} total={total} />
              <Link to="/pago" className="btn btn-success btn-lg w-100 mt-3"><Icon name="lock" /> Continuar al pago</Link>
              <p className="small text-secondary mt-2 mb-0">El pago se procesa en la pasarela ficticia AvenzaPay. No se realizan cobros reales.</p>
            </div>
          </div>
        </aside>
      </div>
      <Confirmar abierto={confirmarVaciar} titulo="Vaciar carrito" mensaje="Se quitarán todos los productos del carrito."
        textoConfirmar="Sí, vaciar" alConfirmar={() => { vaciar(); setConfirmarVaciar(false); }} alCancelar={() => setConfirmarVaciar(false)} />
    </div>
  );
}

export function Resumen({ subtotal, iva, total }) {
  return (
    <dl className="resumen mb-0">
      <div><dt>Subtotal</dt><dd>{moneda(subtotal)}</dd></div>
      <div><dt>IVA (19 %)</dt><dd>{moneda(iva)}</dd></div>
      <div className="total"><dt>Total a pagar</dt><dd>{moneda(total)}</dd></div>
    </dl>
  );
}
