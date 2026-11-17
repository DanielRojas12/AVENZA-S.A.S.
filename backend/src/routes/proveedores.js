import { crearCrud } from './crudFactory.js';
import { r, REGEX } from '../validaciones.js';

export default crearCrud({
  tabla: 'proveedores',
  campos: ['nit', 'razon_social', 'contacto', 'email', 'celular', 'ciudad'],
  reglas: {
    nit: [r.requerido, r.regex(REGEX.nit, 'NIT con dígito de verificación: 900123456-1')],
    razon_social: [r.requerido, r.max(120)],
    contacto: [r.requerido, r.regex(REGEX.nombre, 'Solo letras y espacios (3 a 80)')],
    email: [r.requerido, r.regex(REGEX.email, 'Correo electrónico inválido')],
    celular: [r.requerido, r.regex(REGEX.celular, 'Celular colombiano de 10 dígitos que inicia en 3')],
    ciudad: [r.requerido, r.max(60)],
  },
  busqueda: ['nit', 'razon_social', 'ciudad'],
  orden: 'razon_social',
});
