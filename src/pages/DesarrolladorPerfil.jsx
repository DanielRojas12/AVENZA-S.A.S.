// Enlace individual de cada desarrollador: perfil, foto y celular (requisito l).
import { useCallback, useEffect, useState } from 'react';
import Icon from '../components/Icon';
import { Cargando, ErrorCarga } from '../components/Estados';
import { apiDevs } from '../helpers/api';
import { Link, useParams } from '../router/Router';

export default function DesarrolladorPerfil() {
  const { id } = useParams();
  const [dev, setDev] = useState(null);
  const [error, setError] = useState(null);
  const cargar = useCallback(async () => {
    setError(null);
    try { setDev(await apiDevs.get(`/desarrolladores/${id}`)); } catch (e) { setError(e); }
  }, [id]);
  useEffect(() => { cargar(); }, [cargar]);

  if (error) return <div className="container py-4"><ErrorCarga error={error.status === 404 ? { statusText: 'Ese desarrollador no existe.' } : error} alReintentar={cargar} /></div>;
  if (!dev) return <Cargando />;

  const whatsapp = `https://wa.me/57${dev.celular}`;
  return (
    <div className="container py-5">
      <article className="card shadow perfil-dev mx-auto">
        <div className="row g-0 align-items-center">
          <div className="col-md-4 text-center p-4 perfil-dev-foto">
            <img src={dev.foto} alt={`Foto de ${dev.nombre}`} width="220" height="220" className="rounded-circle img-fluid" />
          </div>
          <div className="col-md-8">
            <div className="card-body p-4">
              <h1 className="h2 fw-bold mb-0">{dev.nombre}</h1>
              <p className="fs-5 text-secondary">{dev.rol}</p>
              <p>{dev.perfil}</p>
              <ul className="list-unstyled">
                <li className="mb-2"><Icon name="mobile-screen" /> Celular: <a href={`tel:+57${dev.celular}`}>{dev.celular}</a></li>
                <li className="mb-2"><Icon name="envelope" /> <a href={`mailto:${dev.email}`}>{dev.email}</a></li>
              </ul>
              <div className="d-flex flex-wrap gap-2">
                <a className="btn-red whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`Escribir por WhatsApp a ${dev.nombre}`}><Icon name="whatsapp" /> WhatsApp</a>
                {dev.linkedin && <a className="btn-red linkedin" href={dev.linkedin} target="_blank" rel="noopener noreferrer"><Icon name="linkedin" /> LinkedIn</a>}
                {dev.github && <a className="btn-red github" href={dev.github} target="_blank" rel="noopener noreferrer"><Icon name="github" /> GitHub</a>}
              </div>
            </div>
          </div>
        </div>
      </article>
      <p className="text-center mt-4"><Link to="/desarrolladores"><Icon name="arrow-left" /> Volver al equipo</Link></p>
    </div>
  );
}
