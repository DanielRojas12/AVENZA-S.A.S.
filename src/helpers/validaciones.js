// Validaciones con expresiones regulares (HU-15). Se usan en todos los formularios.
export const REGEX = {
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  celular: /^3\d{9}$/, // celular colombiano: 10 dígitos que inician en 3
  documento: /^\d{6,10}$/,
  nit: /^\d{9}-\d$/,
  nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' ]{3,80}$/,
  codigo: /^[A-Z]{3}-[A-Z0-9]{2,10}$/,
  url: /^(https?:\/\/[\w.-]+\.[a-z]{2,}(\/\S*)?|\/[\w./-]+)$/i,
  tarjeta: /^\d{16}$/,
  vencimiento: /^(0[1-9]|1[0-2])\/\d{2}$/,
  cvv: /^\d{3,4}$/,
};

export const MENSAJES = {
  email: 'Ingrese un correo válido, por ejemplo nombre@dominio.com',
  celular: 'Ingrese un celular colombiano de 10 dígitos que inicie en 3 (ej. 3001234567)',
  documento: 'El documento debe tener entre 6 y 10 dígitos, sin puntos',
  nit: 'Formato de NIT: 9 dígitos, guion y dígito de verificación (900123456-1)',
  nombre: 'Use solo letras y espacios (mínimo 3 caracteres)',
  codigo: 'Formato: 3 letras, guion y 2 a 10 letras o números (ej. SOU-TER)',
  url: 'Ingrese una URL válida (https://...) o una ruta que empiece por /',
};

/** Algoritmo de Luhn: verifica que un número de tarjeta sea matemáticamente válido. */
export function luhn(numero) {
  const digitos = String(numero).replace(/\D/g, '');
  let suma = 0;
  let doble = false;
  for (let i = digitos.length - 1; i >= 0; i--) {
    let d = Number(digitos[i]);
    if (doble) { d *= 2; if (d > 9) d -= 9; }
    suma += d;
    doble = !doble;
  }
  return digitos.length > 0 && suma % 10 === 0;
}

/** Verifica que una fecha MM/AA no esté vencida. */
export function vencimientoVigente(mmaa) {
  if (!REGEX.vencimiento.test(mmaa)) return false;
  const [mm, aa] = mmaa.split('/').map(Number);
  const finDeMes = new Date(2000 + aa, mm, 0, 23, 59, 59);
  return finDeMes >= new Date();
}

/**
 * Valida un objeto de datos con reglas declarativas:
 * { campo: { requerido: true, regex: 'email', min: 0, minLength: 20, custom: (v, datos) => 'msg' | null } }
 */
export function validarFormulario(datos, reglas) {
  const errores = {};
  for (const [campo, regla] of Object.entries(reglas)) {
    const valor = datos[campo];
    const texto = valor === undefined || valor === null ? '' : String(valor).trim();
    if (regla.requerido && (texto === '' || valor === false)) {
      errores[campo] = regla.mensajeRequerido || 'Este campo es obligatorio';
      continue;
    }
    if (texto === '') continue;
    if (regla.regex && !REGEX[regla.regex].test(texto)) errores[campo] = regla.mensaje || MENSAJES[regla.regex];
    else if (regla.min !== undefined && (isNaN(Number(texto)) || Number(texto) < regla.min)) errores[campo] = `Debe ser un número mayor o igual a ${regla.min}`;
    else if (regla.entero && !Number.isInteger(Number(texto))) errores[campo] = 'Debe ser un número entero';
    else if (regla.minLength && texto.length < regla.minLength) errores[campo] = `Mínimo ${regla.minLength} caracteres`;
    else if (regla.maxLength && texto.length > regla.maxLength) errores[campo] = `Máximo ${regla.maxLength} caracteres`;
    else if (regla.custom) { const m = regla.custom(valor, datos); if (m) errores[campo] = m; }
  }
  return errores;
}
