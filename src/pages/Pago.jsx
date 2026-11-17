// Pasarela de pago ficticia "AvenzaPay" y facturación (requisito s / HU-10).
import { useState } from 'react';
import Icon from '../components/Icon';
import Campo from '../components/Campo';
import { Resumen } from './Carrito';
import { useCarrito } from '../context/CarritoContext';
import { useAvisos } from '../context/AvisosContext';
import { api } from '../helpers/api';
import { moneda } from '../helpers/formato';
import { REGEX, luhn, validarFormulario, vencimientoVigente } from '../helpers/validaciones';
import { Link, useNavigate } from '../router/Router';

const METODOS = [
  { id: 'TARJETA', texto: 'Tarjeta de crédito o débito', icono: 'credit-card' },
  { id: 'PSE', texto: 'PSE', icono: 'building-columns' },
  { id: 'NEQUI', texto: 'Nequi', icono: 'wallet' },
];
const BANCOS = ['Bancolombia', 'Banco de Bogotá', 'Davivienda', 'BBVA Colombia', 'Banco Popular', 'Banco Caja Social'];

const REGLAS_CLIENTE = {
  nombres: { requerido: true, regex: 'nombre' },
  documento: { requerido: true, regex: 'documento' },
  email: { requerido: true, regex: 'email' },
  celular: { requerido: true, regex: 'celular' },
  direccion: { maxLength: 150 },
  acepta: { requerido: true, mensajeRequerido: 'Debe aceptar la política de tratamiento de datos para continuar' },
};
const REGLAS_PAGO = {
  TARJETA: {
    tarjeta: { requerido: true, custom: (v) => (!REGEX.tarjeta.test(v.replace(/\s/g, '')) ? 'El número debe tener 16 dígitos' : !luhn(v) ? 'Número de tarjeta inválido (no supera la verificación Luhn)' : null) },
    titular: { requerido: true, regex: 'nombre', mensaje: 'Escriba el nombre como aparece en la tarjeta' },
    vence: { requerido: true, custom: (v) => (!REGEX.vencimiento.test(v) ? 'Use el formato MM/AA' : !vencimientoVigente(v) ? 'La tarjeta está vencida' : null) },
    cvv: { requerido: true, custom: (v) => (!REGEX.cvv.test(v) ? 'El CVV tiene 3 o 4 dígitos' : null) },
  },
  PSE: { banco: { requerido: true }, tipoPersona: { requerido: true } },
  NEQUI: { celularNequi: { requerido: true, regex: 'celular' } },
};

/** Detecta la franquicia por los primeros dígitos (solo informativo). */
function franquicia(numero) {
  const n = numero.replace(/\s/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard';
  return '';
}

export default function Pago() {
  const { items, subtotal, iva, total, vaciar } = useCarrito();
  const avisar = useAvisos();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({ nombres: '', documento: '', email: '', celular: '', direccion: '', acepta: false });
  const [metodo, setMetodo] = useState('TARJETA');
  const [pago, setPago] = useState({ tarjeta: '', titular: '', vence: '', cvv: '', banco: '', tipoPersona: '', celularNequi: '' });
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState('formulario'); // formulario | procesando | rechazado
  const [mensajeRechazo, setMensajeRechazo] = useState('');

  if (!items.length && estado !== 'procesando') {
    return (
      <div className="container py-5 text-center">
        <h1 className="h2">No hay productos para pagar</h1>
        <Link to="/tienda" className="btn btn-success mt-3">Ir a la tienda</Link>
      </div>
    );
  }

  const cambiarCliente = (e) => {
    const { name, value, type, checked } = e.target;
    setCliente((c) => ({ ...c, [name]: type === 'checkbox' ? checked : value }));
    setErrores((er) => ({ ...er, [name]: undefined }));
  };
  const cambiarPago = (e) => {
    let { name, value } = e.target;
    if (name === 'tarjeta') value = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    if (name === 'vence') value = value.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4);
    setPago((p) => ({ ...p, [name]: value }));
    setErrores((er) => ({ ...er, [name]: undefined }));
  };

  const pagar = async (e) => {
    e.preventDefault();
    const errs = { ...validarFormulario(cliente, REGLAS_CLIENTE), ...validarFormulario(pago, REGLAS_PAGO[metodo]) };
    setErrores(errs);
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus();
      avisar('Revise los campos marcados en rojo.', 'danger');
      return;
    }

    // 1. Simulación de la pasarela (autorización)
    setEstado('procesando');
    await new Promise((r) => setTimeout(r, 1800));
    const numero = pago.tarjeta.replace(/\s/g, '');
    if (metodo === 'TARJETA' && numero.endsWith('0002')) {
      setMensajeRechazo('Transacción rechazada por la entidad financiera: fondos insuficientes. Intente con otra tarjeta o método de pago.');
      setEstado('rechazado');
      return;
    }
    const referencia = `AVP-${Date.now().toString(36).toUpperCase()}${metodo === 'TARJETA' ? `-${numero.slice(-4)}` : ''}`;

    // 2. Facturación en el backend (descuenta stock en la base de datos)
    try {
      const factura = await api.post('/facturas', {
        cliente: { nombres: cliente.nombres, documento: cliente.documento, email: cliente.email, celular: cliente.celular, direccion: cliente.direccion },
        items: items.map((i) => ({ producto_id: i.id, cantidad: i.cantidad })),
        pago: { metodo, referencia },
      });
      vaciar();
      avisar(`¡Pago aprobado! Factura ${factura.numero} generada.`);
      navigate(`/factura/${factura.id}`);
    } catch (err) {
      setMensajeRechazo(err.statusText + (err.errores ? ' ' + Object.values(err.errores).join(' ') : ''));
      setEstado('rechazado');
    }
  };

  return (
    <div className="container py-4">
      <h1 className="fw-bold text-avenza">Pago seguro</h1>
      <ol className="pasos list-unstyled d-flex flex-wrap gap-3 mb-4" aria-label="Pasos de la compra">
        <li className="hecho"><Icon name="check" /> 1. Carrito</li>
        <li className="actual" aria-current="step">2. Datos y pago</li>
        <li>3. Factura</li>
      </ol>

      {estado === 'rechazado' && (
        <div className="alert alert-danger d-flex gap-2 align-items-start" role="alert">
          <Icon name="triangle-exclamation" className="mt-1" />
          <div className="flex-grow-1">{mensajeRechazo}</div>
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setEstado('formulario')} />
        </div>
      )}

      <form onSubmit={pagar} noValidate>
        <div className="row g-4">
          <div className="col-lg-8">
            <fieldset className="card card-body shadow-sm mb-4">
              <legend className="h5">Datos del comprador (para la factura)</legend>
              <div className="row g-3">
                <Campo id="nombres" label="Nombre completo" value={cliente.nombres} onChange={cambiarCliente} error={errores.nombres} required autoComplete="name" />
                <Campo id="documento" label="Cédula" value={cliente.documento} onChange={cambiarCliente} error={errores.documento} required inputMode="numeric" ayuda="Solo números, sin puntos" />
                <Campo id="email" label="Correo electrónico" tipo="email" value={cliente.email} onChange={cambiarCliente} error={errores.email} required autoComplete="email" ayuda="Aquí enviaremos la factura" />
                <Campo id="celular" label="Celular" tipo="tel" value={cliente.celular} onChange={cambiarCliente} error={errores.celular} required inputMode="numeric" ayuda="10 dígitos, ej. 3001234567" autoComplete="tel-national" />
                <Campo id="direccion" label="Dirección (opcional)" value={cliente.direccion} onChange={cambiarCliente} error={errores.direccion} className="col-12" autoComplete="street-address" />
              </div>
            </fieldset>

            <fieldset className="card card-body shadow-sm mb-4">
              <legend className="h5">Método de pago</legend>
              <div className="d-flex flex-wrap gap-2 mb-3" role="radiogroup" aria-label="Método de pago">
                {METODOS.map((m) => (
                  <div key={m.id}>
                    <input type="radio" className="btn-check" name="metodo" id={`metodo-${m.id}`} value={m.id} checked={metodo === m.id}
                      onChange={() => { setMetodo(m.id); setErrores({}); }} />
                    <label className="btn btn-outline-success" htmlFor={`metodo-${m.id}`}><Icon name={m.icono} /> {m.texto}</label>
                  </div>
                ))}
              </div>

              {metodo === 'TARJETA' && (
                <div className="row g-3">
                  <Campo id="tarjeta" label={`Número de tarjeta ${franquicia(pago.tarjeta) ? `(${franquicia(pago.tarjeta)})` : ''}`} value={pago.tarjeta} onChange={cambiarPago}
                    error={errores.tarjeta} required inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" className="col-md-7" />
                  <Campo id="titular" label="Nombre del titular" value={pago.titular} onChange={cambiarPago} error={errores.titular} required autoComplete="cc-name" className="col-md-5" />
                  <Campo id="vence" label="Vencimiento" value={pago.vence} onChange={cambiarPago} error={errores.vence} required placeholder="MM/AA" inputMode="numeric" autoComplete="cc-exp" className="col-6 col-md-3" />
                  <Campo id="cvv" label="CVV" tipo="password" value={pago.cvv} onChange={cambiarPago} error={errores.cvv} required inputMode="numeric" autoComplete="cc-csc" className="col-6 col-md-3" />
                  <div className="col-md-6">
                    <div className="alert alert-info small mb-0" role="note">
                      <strong>Tarjetas de prueba:</strong><br />4111 1111 1111 1111 → aprobada<br />4000 0000 0000 0002 → rechazada
                    </div>
                  </div>
                </div>
              )}
              {metodo === 'PSE' && (
                <div className="row g-3">
                  <Campo id="banco" label="Banco" as="select" opciones={BANCOS} value={pago.banco} onChange={cambiarPago} error={errores.banco} required />
                  <Campo id="tipoPersona" label="Tipo de persona" as="select" opciones={['Natural', 'Jurídica']} value={pago.tipoPersona} onChange={cambiarPago} error={errores.tipoPersona} required />
                </div>
              )}
              {metodo === 'NEQUI' && (
                <div className="row g-3">
                  <Campo id="celularNequi" label="Celular registrado en Nequi" tipo="tel" value={pago.celularNequi} onChange={cambiarPago} error={errores.celularNequi} required inputMode="numeric" ayuda="Recibirás una notificación simulada para aprobar el pago" />
                </div>
              )}
            </fieldset>

            <div className="form-check mb-3">
              <input className={`form-check-input ${errores.acepta ? 'is-invalid' : ''}`} type="checkbox" id="acepta" name="acepta" checked={cliente.acepta}
                onChange={cambiarCliente} aria-describedby={errores.acepta ? 'acepta-error' : undefined} aria-invalid={errores.acepta ? true : undefined} />
              <label className="form-check-label" htmlFor="acepta">
                Autorizo el tratamiento de mis datos personales según la <Link to="/datos-personales" target="_blank">política de datos personales</Link> (Ley 1581 de 2012).
              </label>
              {errores.acepta && <div id="acepta-error" className="invalid-feedback d-block">{errores.acepta}</div>}
            </div>
          </div>

          <aside className="col-lg-4" aria-labelledby="titulo-resumen-pago">
            <div className="card shadow-sm resumen-compra">
              <div className="card-body">
                <h2 id="titulo-resumen-pago" className="h5">Tu pedido</h2>
                <ul className="list-unstyled small">
                  {items.map((i) => (
                    <li key={i.id} className="d-flex justify-content-between gap-2 border-bottom py-1">
                      <span>{i.cantidad} × {i.nombre}</span><span>{moneda(i.precio * i.cantidad)}</span>
                    </li>
                  ))}
                </ul>
                <Resumen subtotal={subtotal} iva={iva} total={total} />
                <button type="submit" className="btn btn-success btn-lg w-100 mt-3" disabled={estado === 'procesando'}>
                  <Icon name="lock" /> Pagar {moneda(total)}
                </button>
                <Link to="/carrito" className="btn btn-link w-100">Volver al carrito</Link>
              </div>
            </div>
          </aside>
        </div>
      </form>

      {estado === 'procesando' && (
        <>
          <div className="modal d-block" role="dialog" aria-modal="true" aria-labelledby="procesando-titulo">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content text-center p-4">
                <div className="spinner-border text-success mx-auto mb-3" aria-hidden="true" />
                <h2 id="procesando-titulo" className="h5">Procesando pago con AvenzaPay…</h2>
                <p className="mb-0" role="status">No cierre ni recargue esta ventana.</p>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}
    </div>
  );
}
