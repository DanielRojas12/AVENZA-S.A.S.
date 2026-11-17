// Acceso seguro a localStorage (puede fallar en modo privado o estar deshabilitado).
export function leer(clave, porDefecto) {
  try {
    const v = window.localStorage.getItem(clave);
    return v === null ? porDefecto : JSON.parse(v);
  } catch {
    return porDefecto;
  }
}
export function guardar(clave, valor) {
  try { window.localStorage.setItem(clave, JSON.stringify(valor)); } catch { /* sin almacenamiento */ }
}
