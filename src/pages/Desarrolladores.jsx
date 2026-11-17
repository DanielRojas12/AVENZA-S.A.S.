// Perfiles de los desarrolladores guardados en una API virtual (json-server) con CRUD (requisito l / HU-07).
import { useCallback, useEffect, useState } from 'react';
import Icon from '../components/Icon';
import Campo from '../components/Campo';
import Confirmar from '../components/Confirmar';
import { Cargando, ErrorCarga, Vacio } from '../components/Estados';
import { apiDevs } from '../helpers/api';
import { validarFormulario } from '../helpers/validaciones';
import { useAvisos } from '../context/AvisosContext';
import { Link } from '../router/Router';
import { DEVS_URL } from '../config';

const VACIO = { nombre: '', rol: '', celular: '', email: '', foto: '', linkedin: '', github: '', perfil: '' };
const REGLAS = {
  nombre: { requerido: true, regex: 'nombre' },
  rol: { requerido: true, maxLength: 60 },
  celular: { requerido: true, regex: 'celular' },
  email: { requerido: true, regex: 'email' },
  foto: { requerido: true, regex: 'url' },
  linkedin: { regex: 'url' },
  github: { regex: 'url' },
  perfil: { requerido: true, minLength: 20, maxLength: 400 },
};

export default function Desarrolladores() {
  const [devs, setDevs] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null); // null = cerrado; objeto = creando/editando
  const [errores, setErrores] = useState({});
  const [aEliminar, setAEliminar] = useState(null);
  const avisar = useAvisos();

  const cargar = useCallback(async () => {
    setError(null);
    try { setDevs(await apiDevs.get('/desarrolladores')); } catch (e) { setError(e); }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  const cambiar = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErrores({ ...errores, [e.target.name]: undefined }); };

  const guardar = async (e) => {
    e.preventDefault();
    const errs = validarFormulario(form, REGLAS);
    setErrores(errs);
    if (Object.keys(errs).length) { document.getElementById(Object.keys(errs)[0])?.focus(); return; }
    try {
      if (form.id) {
        const act = await apiDevs.put(`/desarrolladores/${form.id}`, form);
        setDevs((d) => d.map((x) => (x.id === form.id ? act : x)));
        avisar('Perfil actualizado en la API virtual.');
      } else {
        const nuevo = await apiDevs.post('/desarrolladores', form);
        setDevs((d) => [...d, nuevo]);
        avisar('Perfil creado en la API virtual.');
      }
      setForm(null);
    } catch (err) { avisar(err.statusText, 'danger'); }
  };

  const eliminar = async () => {
    try {
      await apiDevs.del(`/desarrolladores/${aEliminar.id}`);
      setDevs((d) => d.filter((x) => x.id !== aEliminar.id));
      avisar('Perfil eliminado.');
    } catch (err) { avisar(err.statusText, 'danger'); } finally { setAEliminar(null); }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h1 className="fw-bold text-avenza mb-1">Equipo de desarrollo</h1>
          <p className="mb-0">Datos servidos por la API virtual <code>{DEVS_URL}/desarrolladores</code> (json-server).</p>
        </div>
        {!form && <button type="button" className="btn btn-success" onClick={() => { setForm(VACIO); setErrores({}); }}><Icon name="plus" /> Agregar desarrollador</button>}
      </div>

      {form && (
        <form className="card card-body shadow-sm mb-4" onSubmit={guardar} noValidate aria-labelledby="titulo-form-dev">
          <h2 id="titulo-form-dev" className="h5">{form.id ? `Editar perfil de ${form.nombre}` : 'Nuevo desarrollador'}</h2>
          <div className="row g-3">
            <Campo id="nombre" label="Nombre completo" required value={form.nombre} onChange={cambiar} error={errores.nombre} />
            <Campo id="rol" label="Rol en el proyecto" required value={form.rol} onChange={cambiar} error={errores.rol} />
            <Campo id="celular" label="Celular" tipo="tel" required inputMode="numeric" value={form.celular} onChange={cambiar} error={errores.celular} ayuda="10 dígitos, inicia en 3" className="col-md-4" />
            <Campo id="email" label="Correo" tipo="email" required value={form.email} onChange={cambiar} error={errores.email} className="col-md-4" />
            <Campo id="foto" label="URL de la foto" required value={form.foto} onChange={cambiar} error={errores.foto} ayuda="https://… o /img/devs/archivo.jpg" className="col-md-4" />
            <Campo id="linkedin" label="LinkedIn (opcional)" value={form.linkedin} onChange={cambiar} error={errores.linkedin} />
            <Campo id="github" label="GitHub (opcional)" value={form.github} onChange={cambiar} error={errores.github} />
            <Campo id="perfil" label="Perfil profesional" as="textarea" required value={form.perfil} onChange={cambiar} error={errores.perfil} className="col-12" ayuda={`${form.perfil.length}/400 caracteres`} />
          </div>
          <div className="d-flex gap-2 mt-3">
            <button type="submit" className="btn btn-success"><Icon name="check" /> Guardar</button>
            <button type="button" className="btn btn-secondary" onClick={() => setForm(null)}>Cancelar</button>
          </div>
        </form>
      )}

      {error ? <ErrorCarga error={error} alReintentar={cargar} /> : !devs ? <Cargando /> : devs.length === 0 ? <Vacio titulo="No hay desarrolladores registrados" /> : (
        <div className="row g-4">
          {devs.map((d) => (
            <div className="col-md-6 col-lg-4" key={d.id}>
              <article className="card h-100 shadow-sm text-center tarjeta-dev">
                <div className="card-body">
                  <img src={d.foto} alt={`Foto de ${d.nombre}`} width="140" height="140" className="rounded-circle mb-3 foto-dev" />
                  <h2 className="h5 mb-0">{d.nombre}</h2>
                  <p className="text-secondary">{d.rol}</p>
                  <p className="mb-1"><Icon name="mobile-screen" /> <a href={`tel:+57${d.celular}`}>{d.celular}</a></p>
                  <p className="small text-break"><Icon name="envelope" /> <a href={`mailto:${d.email}`}>{d.email}</a></p>
                  <Link to={`/desarrolladores/${d.id}`} className="btn btn-success btn-sm">Ver perfil completo</Link>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-center gap-2">
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => { setForm({ ...VACIO, ...d }); setErrores({}); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    <Icon name="pen" /> Editar
                  </button>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setAEliminar(d)}><Icon name="trash" /> Eliminar</button>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
      <Confirmar abierto={!!aEliminar} titulo="Eliminar desarrollador" mensaje={<>¿Eliminar el perfil de <strong>{aEliminar?.nombre}</strong>?</>}
        alConfirmar={eliminar} alCancelar={() => setAEliminar(null)} />
    </div>
  );
}
