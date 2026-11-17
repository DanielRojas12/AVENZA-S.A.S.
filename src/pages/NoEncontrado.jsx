// Página 404 (HU-01): aviso claro cuando la dirección no existe.
import Icon from '../components/Icon';
import { Link, useRouter } from '../router/Router';

export default function NoEncontrado() {
  const { pathname } = useRouter();
  return (
    <div className="container py-5 text-center">
      <Icon name="binoculars" size="5em" className="text-avenza mb-3" />
      <h1 className="display-5 fw-bold">Error 404: página no encontrada</h1>
      <p className="lead">Buscamos por toda la selva, pero la dirección <code>{pathname}</code> no existe en AVENZA.</p>
      <p>Revise que la dirección esté bien escrita o use uno de estos accesos:</p>
      <div className="d-flex flex-wrap justify-content-center gap-2">
        <Link to="/" className="btn btn-success"><Icon name="house" /> Ir al inicio</Link>
        <Link to="/especies" className="btn btn-outline-success">Ver especies</Link>
        <Link to="/tienda" className="btn btn-outline-success">Ir a la tienda</Link>
      </div>
    </div>
  );
}
