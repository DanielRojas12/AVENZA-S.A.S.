// Ubicación con Google Maps, redes sociales (HU-12) y formulario de PQR (requisito i / HU-13).
import { useState } from 'react';
import Icon from '../components/Icon';
import Campo from '../components/Campo';
import RedesSociales from '../components/layout/RedesSociales';
import { api } from '../helpers/api';
import { fecha } from '../helpers/formato';
import { validarFormulario } from '../helpers/validaciones';
import { useAvisos } from '../context/AvisosContext';
import { EMPRESA } from '../data/empresa';
import { Link } from '../router/Router';

const VACIO = { tipo: '', nombre: '', documento: '', email: '', celular: '', asunto: '', mensaje: '', acepta_politica: false };
const REGLAS = {
  tipo: { requerido: true },
  nombre: { requerido: true, regex: 'nombre' },
  documento: { requerido: true, regex: 'documento' },
  email: { requerido: true, regex: 'email' },
  celular: { requerido: true, regex: 'celular' },
  asunto: { requerido: true, minLength: 5, maxLength: 120 },
  mensaje: { requerido: true, minLength: 20, maxLength: 2000 },
  acepta_politica: { requerido: true, mensajeRequerido: 'Debe aceptar la política de tratamiento de datos personales' },
};

export default function Contacto() {
  return (
    <div className="container py-4">
      <h1 className="fw-bold text-avenza">Contacto y PQR</h1>
      <p className="lead">Encuéntranos, escríbenos por nuestras redes o radica una petición, queja, reclamo o sugerencia.</p>
      <div className="row g-4 mb-5">
        <div className="col-lg-7">
          <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm mapa">
            <iframe src={EMPRESA.mapaEmbed} title="Mapa de Google Maps con la ubicación de AVENZA S.A.S." loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
          <a href={EMPRESA.mapaEnlace} target="_blank" rel="noopener noreferrer" className="small d-inline-block mt-2">
            Abrir ubicación en Google Maps (nueva pestaña)
          </a>
        </div>
        <div className="col-lg-5">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="h5">Datos de contacto</h2>
              <address>
                <p className="mb-2"><Icon name="location-dot" /> {EMPRESA.direccion}</p>
                <p className="mb-2"><Icon name="circle-info" /> {EMPRESA.horario}</p>
                <p className="mb-2"><Icon name="envelope" /> <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a></p>
                <p className="mb-0"><Icon name="phone" /> <a href={`tel:+57${EMPRESA.celular}`}>+57 {EMPRESA.celular}</a></p>
              </address>
              <h2 className="h5 mt-4">Síguenos</h2>
              <RedesSociales grande />
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-lg-8"><FormularioPQR /></div>
        <div className="col-lg-4"><ConsultaRadicado /></div>
      </div>
    </div>
  );
}

function FormularioPQR() {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [radicado, setRadicado] = useState(null);
  const avisar = useAvisos();

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos({ ...datos, [name]: type === 'checkbox' ? checked : value });
    setErrores({ ...errores, [name]: undefined });
  };

  const enviar = async (e) => {
    e.preventDefault();
    const errs = validarFormulario(datos, REGLAS);
    setErrores(errs);
    if (Object.keys(errs).length) { document.getElementById(Object.keys(errs)[0])?.focus(); return; }
    setEnviando(true);
    try {
      const r = await api.post('/pqr', datos);
      setRadicado(r);
      setDatos(VACIO);
      avisar(`Tu solicitud quedó radicada con el número ${r.radicado}.`);
    } catch (err) {
      setErrores(err.errores || {});
      avisar(err.statusText, 'danger');
    } finally { setEnviando(false); }
  };

  if (radicado) {
    return (
      <div className="card card-body shadow-sm text-center" role="status">
        <Icon name="check" size="3em" className="text-success mx-auto mb-2" />
        <h2 className="h4">¡Solicitud radicada!</h2>
        <p className="mb-1">Número de radicado:</p>
        <p className="fs-3 fw-bold text-avenza">{radicado.radicado}</p>
        <p>Guárdalo para consultar el estado. Responderemos en un máximo de 15 días hábiles.</p>
        <button type="button" className="btn btn-outline-success mx-auto" onClick={() => setRadicado(null)}>Radicar otra solicitud</button>
      </div>
    );
  }

  const len = datos.mensaje.trim().length;
  return (
    <form className="card card-body shadow-sm" onSubmit={enviar} noValidate aria-labelledby="titulo-pqr">
      <h2 id="titulo-pqr" className="h4">Formulario de PQR</h2>
      <p className="small">Los campos marcados con <span className="text-danger">*</span> son obligatorios.</p>
      <div className="row g-3">
        <Campo id="tipo" label="Tipo de solicitud" as="select" required opciones={['Petición', 'Queja', 'Reclamo', 'Sugerencia']} value={datos.tipo} onChange={cambiar} error={errores.tipo} />
        <Campo id="nombre" label="Nombre completo" required value={datos.nombre} onChange={cambiar} error={errores.nombre} autoComplete="name" />
        <Campo id="documento" label="Número de documento" required inputMode="numeric" value={datos.documento} onChange={cambiar} error={errores.documento} ayuda="6 a 10 dígitos" />
        <Campo id="email" label="Correo electrónico" tipo="email" required value={datos.email} onChange={cambiar} error={errores.email} autoComplete="email" />
        <Campo id="celular" label="Celular" tipo="tel" required inputMode="numeric" value={datos.celular} onChange={cambiar} error={errores.celular} ayuda="Ej. 3001234567" autoComplete="tel-national" />
        <Campo id="asunto" label="Asunto" required maxLength={120} value={datos.asunto} onChange={cambiar} error={errores.asunto} />
        <Campo id="mensaje" label="Descripción" as="textarea" required className="col-12" maxLength={2000} value={datos.mensaje} onChange={cambiar} error={errores.mensaje}
          ayuda={`${len}/2000 caracteres (mínimo 20)`} />
        <div className="col-12">
          <div className="form-check">
            <input className={`form-check-input ${errores.acepta_politica ? 'is-invalid' : ''}`} type="checkbox" id="acepta_politica" name="acepta_politica"
              checked={datos.acepta_politica} onChange={cambiar} aria-invalid={errores.acepta_politica ? true : undefined}
              aria-describedby={errores.acepta_politica ? 'acepta_politica-error' : undefined} />
            <label className="form-check-label" htmlFor="acepta_politica">
              Acepto la <Link to="/datos-personales">política de tratamiento de datos personales</Link>. <span className="text-danger" aria-hidden="true">*</span>
            </label>
            {errores.acepta_politica && <div id="acepta_politica-error" className="invalid-feedback d-block">{errores.acepta_politica}</div>}
          </div>
        </div>
      </div>
      <div className="d-flex gap-2 mt-3">
        <button type="submit" className="btn btn-success" disabled={enviando}><Icon name="envelope" /> {enviando ? 'Enviando…' : 'Radicar solicitud'}</button>
        <button type="reset" className="btn btn-outline-secondary" onClick={() => { setDatos(VACIO); setErrores({}); }}>Limpiar</button>
      </div>
    </form>
  );
}

function ConsultaRadicado() {
  const [radicado, setRadicado] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const consultar = async (e) => {
    e.preventDefault();
    setResultado(null);
    if (!/^PQR-\d{4}-\d{6}$/i.test(radicado.trim())) { setError('Formato: PQR-2026-000001'); return; }
    setError('');
    try { setResultado(await api.get(`/pqr/radicado/${radicado.trim()}`)); } catch (err) { setError(err.statusText); }
  };

  return (
    <form className="card card-body shadow-sm" onSubmit={consultar} noValidate aria-labelledby="titulo-consulta">
      <h2 id="titulo-consulta" className="h5">Consultar estado de mi PQR</h2>
      <label htmlFor="radicado" className="form-label">Número de radicado</label>
      <input id="radicado" className={`form-control ${error ? 'is-invalid' : ''}`} placeholder="PQR-2026-000001" value={radicado}
        onChange={(e) => setRadicado(e.target.value)} aria-describedby={error ? 'radicado-error' : undefined} />
      {error && <div id="radicado-error" className="invalid-feedback d-block">{error}</div>}
      <button type="submit" className="btn btn-outline-success mt-2"><Icon name="magnifying-glass" /> Consultar</button>
      {resultado && (
        <div className="mt-3" role="status">
          <p className="mb-1"><strong>{resultado.radicado}</strong> · {resultado.tipo}</p>
          <p className="mb-1">{resultado.asunto}</p>
          <p className="mb-1">Estado: <span className="badge text-bg-info">{resultado.estado}</span></p>
          <p className="small text-secondary mb-1">Radicada: {fecha(resultado.fecha)}</p>
          {resultado.respuesta && <p className="mb-0"><strong>Respuesta:</strong> {resultado.respuesta}</p>}
        </div>
      )}
    </form>
  );
}
