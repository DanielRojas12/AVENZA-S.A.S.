const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
export const moneda = (n) => cop.format(Number(n) || 0);
export const fecha = (f) => new Date(f).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
export const fechaCorta = (f) => new Date(f).toLocaleDateString('es-CO', { dateStyle: 'medium' });
