// Información corporativa de AVENZA S.A.S. (HU-03)
export const EMPRESA = {
  razonSocial: 'AVENZA S.A.S.',
  nit: '901.234.567-8 (ficticio, uso académico)',
  lema: 'Conocer para conservar',
  direccion: 'Universidad Libre, Sede Bosque Popular — Carrera 70 # 53-40, Bogotá D.C.',
  mapaEmbed: 'https://www.google.com/maps?q=Universidad+Libre+Sede+Bosque+Popular,+Carrera+70+%2353-40,+Bogot%C3%A1&output=embed',
  mapaEnlace: 'https://www.google.com/maps/search/?api=1&query=Universidad+Libre+Sede+Bosque+Popular+Bogota',
  horario: 'Lunes a viernes de 8:00 a. m. a 6:00 p. m.',
  email: 'contacto@avenza.com.co',
  celular: '3001234567',
  redes: [
    { nombre: 'Instagram', icono: 'instagram', url: 'https://www.instagram.com/', clase: 'instagram' },
    { nombre: 'Facebook', icono: 'facebook', url: 'https://www.facebook.com/', clase: 'facebook' },
    { nombre: 'WhatsApp', icono: 'whatsapp', url: 'https://wa.me/573001234567?text=Hola%20AVENZA%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n', clase: 'whatsapp' },
    { nombre: 'LinkedIn', icono: 'linkedin', url: 'https://www.linkedin.com/', clase: 'linkedin' },
  ],
};

export const SECCIONES_CORPORATIVAS = [
  {
    id: 'razon',
    titulo: 'Razón social',
    contenido: [
      'AVENZA S.A.S. es una sociedad por acciones simplificada colombiana dedicada a la educación ambiental digital. Su plataforma reúne la historia de los zoológicos, fichas verificadas de fauna con códigos QR y una tienda en línea de pasaportes a parques aliados y souvenirs ecológicos.',
      'Proyecto académico del curso de Programación Web de la Universidad Libre, Bogotá D.C., 2026.',
    ],
  },
  {
    id: 'mision',
    titulo: 'Misión',
    contenido: [
      'Acercar a estudiantes, familias y turistas al conocimiento de la fauna y de los centros de conservación mediante una plataforma web accesible, interactiva y confiable, que transforme la visita a un zoológico en una experiencia de aprendizaje y compromiso con la biodiversidad.',
    ],
  },
  {
    id: 'vision',
    titulo: 'Visión',
    contenido: [
      'En 2030 ser la plataforma educativa de referencia en Colombia para el aprendizaje sobre fauna y conservación, aliada de los principales bioparques del país y reconocida por su accesibilidad, su uso responsable de la tecnología y su aporte a la protección de especies amenazadas.',
    ],
  },
  {
    id: 'objetivos',
    titulo: 'Objetivos corporativos',
    lista: [
      'Divulgar información verificada sobre la historia de los zoológicos y su evolución hacia centros de conservación.',
      'Ofrecer fichas educativas de especies en cinco categorías, con códigos QR que amplían la experiencia en sitio.',
      'Facilitar la compra en línea de pasaportes y souvenirs ecológicos con un proceso seguro y transparente.',
      'Personalizar la experiencia del visitante con un recomendador basado en inteligencia artificial.',
      'Garantizar accesibilidad, protección de datos personales y cumplimiento de estándares web W3C.',
    ],
  },
  {
    id: 'valores',
    titulo: 'Valores',
    lista: [
      'Respeto por la vida silvestre y el bienestar animal.',
      'Rigor y veracidad en la información que publicamos.',
      'Inclusión: una plataforma para todas las edades y capacidades.',
      'Transparencia en el manejo de datos y en las transacciones.',
    ],
  },
];

// Slide publicitario (HU-02): 5 imágenes con su campaña.
export const SLIDES = [
  {
    imagen: '/img/slides/slide1.svg',
    alt: 'Ilustración de huellas, hojas y plumas sobre fondo verde selva',
    titulo: 'Bienvenido a AVENZA',
    texto: 'Conoce la historia de los zoológicos y cómo hoy protegen la fauna del planeta.',
    cta: 'Explorar zoológicos', enlace: '/zoologicos',
  },
  {
    imagen: '/img/slides/slide2.svg',
    alt: 'Ilustración de una boleta de entrada con montañas y binoculares',
    titulo: 'Pasaporte Familiar 3 Parques',
    texto: 'Ukumarí, Cali y Santacruz en un solo pase para 4 personas durante todo un año.',
    cta: 'Comprar pasaporte', enlace: '/tienda?categoria=Pasaporte',
  },
  {
    imagen: '/img/slides/slide3.svg',
    alt: 'Ilustración de un código QR junto a un libro y un celular',
    titulo: 'Escanea y aprende',
    texto: 'Cada especie tiene su código QR con la historia completa. ¡Pruébalo con tu celular!',
    cta: 'Ver especies', enlace: '/especies',
  },
  {
    imagen: '/img/slides/slide4.svg',
    alt: 'Ilustración de una mano sosteniendo un corazón rodeada de semillas y hojas',
    titulo: 'Souvenirs que conservan',
    texto: 'Termos, peluches y kits de semillas hechos con materiales responsables.',
    cta: 'Ir a la tienda', enlace: '/tienda?categoria=Souvenir',
  },
  {
    imagen: '/img/slides/slide5.svg',
    alt: 'Ilustración de un robot amigable con globos de conversación y un planeta',
    titulo: 'Pregúntale a nuestra IA',
    texto: 'Cuéntanos tus gustos y te recomendamos especies y el pasaporte ideal.',
    cta: 'Usar recomendador', enlace: '/recomendador',
  },
];
