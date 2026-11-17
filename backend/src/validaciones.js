// Validaciones del lado del servidor con expresiones regulares.
// (Se repiten en el frontend: nunca se confía solo en el cliente.)
export const REGEX = {
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  celular: /^3\d{9}$/, // celular colombiano: 10 dígitos que empiezan por 3
  documento: /^\d{6,10}$/,
  nit: /^\d{9}-\d$/,
  nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' ]{3,80}$/,
  codigo: /^[A-Z]{3}-[A-Z0-9]{2,10}$/,
};

/**
 * Valida un objeto contra un conjunto de reglas.
 * reglas = { campo: [ (valor) => mensajeError | null, ... ] }
 * Retorna un objeto { campo: mensaje } con los errores encontrados.
 */
export function validar(datos, reglas) {
  const errores = {};
  for (const [campo, fns] of Object.entries(reglas)) {
    for (const fn of fns) {
      const msg = fn(datos[campo], datos);
      if (msg) { errores[campo] = msg; break; }
    }
  }
  return errores;
}

const vacio = (v) => v === undefined || v === null || v === '';

export const r = {
  requerido: (v) => (v === undefined || v === null || String(v).trim() === '' ? 'Campo obligatorio' : null),
  regex: (re, msg) => (v) => (v !== undefined && v !== '' && !re.test(String(v).trim()) ? msg : null),
  // numero/entero solo validan si hay valor (la obligatoriedad la decide r.requerido)
  numero: (min = 0) => (v) => (vacio(v) ? null : isNaN(Number(v)) || Number(v) < min ? `Debe ser un número mayor o igual a ${min}` : null),
  entero: (min = 0) => (v) => (vacio(v) ? null : !Number.isInteger(Number(v)) || Number(v) < min ? `Debe ser un entero mayor o igual a ${min}` : null),
  enLista: (lista) => (v) => (!lista.includes(v) ? `Valor no permitido. Opciones: ${lista.join(', ')}` : null),
  max: (n) => (v) => (v && String(v).length > n ? `Máximo ${n} caracteres` : null),
};

export class ErrorValidacion extends Error {
  constructor(errores) {
    super('Datos inválidos');
    this.status = 400;
    this.errores = errores;
  }
}

export function exigir(datos, reglas) {
  const errores = validar(datos, reglas);
  if (Object.keys(errores).length) throw new ErrorValidacion(errores);
}
