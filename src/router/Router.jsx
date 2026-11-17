// Enrutador SPA propio basado en la History API del navegador.
// Cambia de "página" sin recargar el documento (HU-01).
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const RouterContext = createContext(null);

const ubicacionActual = () => ({ pathname: window.location.pathname, search: window.location.search });

export function RouterProvider({ children }) {
  const [ubicacion, setUbicacion] = useState(ubicacionActual);

  // Botones Atrás / Adelante del navegador
  useEffect(() => {
    const alVolver = () => setUbicacion(ubicacionActual());
    window.addEventListener('popstate', alVolver);
    return () => window.removeEventListener('popstate', alVolver);
  }, []);

  const navigate = useCallback((destino, { replace = false } = {}) => {
    const url = new URL(destino, window.location.origin);
    if (replace) window.history.replaceState({}, '', url);
    else window.history.pushState({}, '', url);
    setUbicacion({ pathname: url.pathname, search: url.search });
    window.scrollTo({ top: 0 });
  }, []);

  const valor = useMemo(() => ({ ...ubicacion, navigate }), [ubicacion, navigate]);
  return <RouterContext.Provider value={valor}>{children}</RouterContext.Provider>;
}

export const useRouter = () => useContext(RouterContext);
export const useNavigate = () => useContext(RouterContext).navigate;
export const useQuery = () => new URLSearchParams(useContext(RouterContext).search);

/** Compara un patrón como "/especies/:slug" con una ruta y extrae parámetros. */
export function matchPath(patron, ruta) {
  const a = patron.split('/').filter(Boolean);
  const b = ruta.split('/').filter(Boolean);
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

const ParamsContext = createContext({});
export const useParams = () => useContext(ParamsContext);

/**
 * <Routes rutas={[{ path, element: Componente, title }]} noEncontrado={Componente} />
 * Renderiza la primera ruta que coincida; si ninguna coincide, muestra la página 404.
 */
export function Routes({ rutas, noEncontrado: NoEncontrado }) {
  const { pathname } = useRouter();
  let encontrada = null;
  let params = {};
  for (const ruta of rutas) {
    const p = matchPath(ruta.path, pathname);
    if (p) { encontrada = ruta; params = p; break; }
  }
  const titulo = encontrada ? encontrada.title : 'Página no encontrada';

  // Título de la pestaña según la sección (heurística de Nielsen: visibilidad del estado)
  useEffect(() => { document.title = `${titulo} | AVENZA S.A.S.`; }, [titulo]);

  if (!encontrada) return <NoEncontrado />;
  const Elemento = encontrada.element;
  return (
    <ParamsContext.Provider value={params}>
      <Elemento key={pathname} />
    </ParamsContext.Provider>
  );
}

/** Enlace que navega sin recargar la página. */
export function Link({ to, children, onClick, ...props }) {
  const navigate = useNavigate();
  const manejar = (e) => {
    onClick?.(e);
    // Respetar Ctrl/Cmd + clic (abrir en otra pestaña) y enlaces externos
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || props.target) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={manejar} {...props}>{children}</a>;
}

/** Igual que Link pero marca la sección activa (aria-current) para orientar al usuario. */
export function NavLink({ to, className = '', exacto = false, children, ...props }) {
  const { pathname } = useRouter();
  const activo = exacto ? pathname === to : pathname === to || pathname.startsWith(to + '/');
  return (
    <Link to={to} className={`${className} ${activo ? 'active' : ''}`} aria-current={activo ? 'page' : undefined} {...props}>
      {children}
    </Link>
  );
}
