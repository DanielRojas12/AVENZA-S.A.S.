import { crearCrud } from './crudFactory.js';
import { r, REGEX } from '../validaciones.js';

export default crearCrud({
  tabla: 'clientes',
  campos: ['documento', 'nombres', 'email', 'celular', 'direccion'],
  reglas: {
    documento: [r.requerido, r.regex(REGEX.documento, 'Documento: 6 a 10 dígitos')],
    nombres: [r.requerido, r.regex(REGEX.nombre, 'Solo letras y espacios (3 a 80)')],
    email: [r.requerido, r.regex(REGEX.email, 'Correo electrónico inválido')],
    celular: [r.requerido, r.regex(REGEX.celular, 'Celular colombiano de 10 dígitos que inicia en 3')],
    direccion: [r.max(150)],
  },
  busqueda: ['documento', 'nombres', 'email'],
  orden: 'nombres',
});
