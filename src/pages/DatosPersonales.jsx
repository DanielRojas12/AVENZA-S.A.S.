// Apartado de manejo de datos personales (requisito n / HU-13).
import Acordeon from '../components/Acordeon';
import { EMPRESA } from '../data/empresa';
import { Link } from '../router/Router';

const SECCIONES = [
  {
    id: 'marco',
    titulo: '1. Marco legal',
    contenido: [
      'Esta política se adopta en cumplimiento de la Ley Estatutaria 1581 de 2012 (Régimen General de Protección de Datos Personales), del Decreto 1377 de 2013, compilado en el Decreto Único 1074 de 2015, y del artículo 15 de la Constitución Política de Colombia (derecho de habeas data).',
    ],
  },
  {
    id: 'responsable',
    titulo: '2. Responsable del tratamiento',
    contenido: [
      `${EMPRESA.razonSocial}, NIT ${EMPRESA.nit}, con domicilio en ${EMPRESA.direccion}. Correo para asuntos de datos personales: ${EMPRESA.email}.`,
    ],
  },
  {
    id: 'datos',
    titulo: '3. Datos que recolectamos',
    lista: [
      'Identificación y contacto: nombre, número de documento, correo electrónico, celular y dirección.',
      'Datos de la compra: productos, valores, método de pago y referencia de la transacción. AVENZA no almacena números completos de tarjeta ni códigos CVV.',
      'Solicitudes PQR: el contenido de la petición, queja, reclamo o sugerencia.',
      'Preferencias del navegador: el carrito y las opciones de accesibilidad se guardan solo en su dispositivo (localStorage).',
    ],
  },
  {
    id: 'finalidades',
    titulo: '4. Finalidades del tratamiento',
    lista: [
      'Procesar compras, emitir facturas y entregar pasaportes y souvenirs.',
      'Atender y responder las PQR dentro de los términos legales.',
      'Enviar información sobre su compra o solicitud.',
      'Elaborar estadísticas internas anónimas para mejorar el servicio.',
    ],
  },
  {
    id: 'derechos',
    titulo: '5. Derechos del titular',
    lista: [
      'Conocer, actualizar y rectificar sus datos personales.',
      'Solicitar prueba de la autorización otorgada.',
      'Ser informado sobre el uso que se ha dado a sus datos.',
      'Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).',
      'Revocar la autorización y/o solicitar la supresión de sus datos cuando no exista un deber legal de conservarlos.',
      'Acceder gratuitamente a sus datos personales.',
    ],
  },
  {
    id: 'procedimiento',
    titulo: '6. ¿Cómo ejercer sus derechos?',
    contenido: [
      'Puede radicar una consulta o reclamo a través del formulario de PQR o del correo indicado. Las consultas se atienden en un máximo de diez (10) días hábiles y los reclamos en un máximo de quince (15) días hábiles, según los términos de la Ley 1581 de 2012.',
    ],
  },
  {
    id: 'seguridad',
    titulo: '7. Seguridad de la información',
    contenido: [
      'Los datos se almacenan en una base de datos PostgreSQL alojada en Neon con conexión cifrada (SSL). El acceso se limita al personal autorizado y las contraseñas y credenciales no se publican en el código fuente.',
    ],
  },
  {
    id: 'vigencia',
    titulo: '8. Vigencia',
    contenido: ['Esta política rige desde noviembre de 2026. Los datos se conservarán mientras sean necesarios para las finalidades descritas o mientras exista una obligación legal o contractual.'],
  },
];

export default function DatosPersonales() {
  return (
    <div className="container py-4">
      <h1 className="fw-bold text-avenza">Política de tratamiento de datos personales</h1>
      <p className="lead">
        En AVENZA S.A.S. protegemos su información. Aquí explicamos qué datos recolectamos, para qué los usamos y cómo puede ejercer sus derechos.
      </p>
      <div className="row g-4">
        <div className="col-lg-8">
          <Acordeon items={SECCIONES} id="politica" abiertoInicial={0} />
        </div>
        <aside className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5">Resumen en 3 puntos</h2>
              <ol className="mb-3">
                <li>Solo pedimos los datos necesarios para su compra o solicitud.</li>
                <li>No vendemos ni compartimos sus datos con terceros con fines comerciales.</li>
                <li>Puede consultar, corregir o eliminar sus datos cuando lo desee.</li>
              </ol>
              <Link to="/contacto" className="btn btn-success w-100">Ejercer mis derechos (PQR)</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
