// Diálogo de confirmación accesible para acciones destructivas (Nielsen #5: prevención de errores).
import { useEffect, useRef } from 'react';

export default function Confirmar({ abierto, titulo, mensaje, textoConfirmar = 'Sí, eliminar', variante = 'danger', alConfirmar, alCancelar }) {
  const cancelarRef = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    cancelarRef.current?.focus();
    const esc = (e) => e.key === 'Escape' && alCancelar();
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [abierto, alCancelar]);

  if (!abierto) return null;
  return (
    <>
      <div className="modal d-block" role="dialog" aria-modal="true" aria-labelledby="confirmar-titulo" aria-describedby="confirmar-msg">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="confirmar-titulo">{titulo}</h2>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={alCancelar} />
            </div>
            <div className="modal-body" id="confirmar-msg">{mensaje}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" ref={cancelarRef} onClick={alCancelar}>Cancelar</button>
              <button type="button" className={`btn btn-${variante}`} onClick={alConfirmar}>{textoConfirmar}</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}
