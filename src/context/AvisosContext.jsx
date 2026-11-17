// Mensajes emergentes (toasts) anunciados a lectores de pantalla con aria-live.
import { createContext, useCallback, useContext, useState } from 'react';
import Icon from '../components/Icon';

const AvisosContext = createContext(null);
const ICONO = { success: 'check', danger: 'triangle-exclamation', warning: 'triangle-exclamation', info: 'circle-info' };

export function AvisosProvider({ children }) {
  const [avisos, setAvisos] = useState([]);

  const cerrar = useCallback((id) => setAvisos((a) => a.filter((x) => x.id !== id)), []);
  const avisar = useCallback((mensaje, tipo = 'success') => {
    const id = Date.now() + Math.random();
    setAvisos((a) => [...a, { id, mensaje, tipo }]);
    setTimeout(() => cerrar(id), 5000);
  }, [cerrar]);

  return (
    <AvisosContext.Provider value={avisar}>
      {children}
      <div className="avisos" aria-live="polite" aria-atomic="false">
        {avisos.map((a) => (
          <div key={a.id} className={`alert alert-${a.tipo} shadow d-flex align-items-start gap-2 mb-2`} role={a.tipo === 'danger' ? 'alert' : 'status'}>
            <Icon name={ICONO[a.tipo]} className="mt-1" />
            <span className="flex-grow-1">{a.mensaje}</span>
            <button type="button" className="btn-close" aria-label="Cerrar aviso" onClick={() => cerrar(a.id)} />
          </div>
        ))}
      </div>
    </AvisosContext.Provider>
  );
}

export const useAvisos = () => useContext(AvisosContext);
