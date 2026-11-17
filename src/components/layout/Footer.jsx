import { Link } from '../../router/Router';
import { EMPRESA } from '../../data/empresa';
import RedesSociales from './RedesSociales';
import Icon from '../Icon';

export default function Footer() {
  return (
    <footer className="footer-avenza mt-5">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <img src="/img/logo-claro.svg" alt="AVENZA S.A.S." width="220" height="53" className="mb-3" />
            <p className="mb-2">{EMPRESA.lema}. Plataforma educativa sobre zoológicos, fauna y conservación.</p>
            <RedesSociales />
          </div>
          <div className="col-6 col-md-2">
            <h2 className="h6 text-uppercase">Explora</h2>
            <ul className="list-unstyled">
              <li><Link to="/zoologicos">Zoológicos</Link></li>
              <li><Link to="/especies">Especies</Link></li>
              <li><Link to="/tienda">Tienda</Link></li>
              <li><Link to="/recomendador">Recomendador IA</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="h6 text-uppercase">Ayuda</h2>
            <ul className="list-unstyled">
              <li><Link to="/contacto">Contacto y PQR</Link></li>
              <li><Link to="/datos-personales">Tratamiento de datos personales</Link></li>
              <li><Link to="/desarrolladores">Equipo de desarrollo</Link></li>
              <li><Link to="/admin">Administración</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h2 className="h6 text-uppercase">Contacto</h2>
            <address className="mb-0">
              <p className="mb-1"><Icon name="location-dot" /> {EMPRESA.direccion}</p>
              <p className="mb-1"><Icon name="envelope" /> <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a></p>
              <p className="mb-0"><Icon name="phone" /> <a href={`tel:+57${EMPRESA.celular}`}>+57 {EMPRESA.celular}</a></p>
            </address>
          </div>
        </div>
        <hr />
        <p className="small mb-0 d-flex flex-wrap justify-content-between gap-2">
          <span>© 2026 AVENZA S.A.S. · Proyecto académico — Programación Web, Universidad Libre.</span>
          <span>Íconos: Font Awesome Free (CC BY 4.0).</span>
        </p>
      </div>
    </footer>
  );
}
