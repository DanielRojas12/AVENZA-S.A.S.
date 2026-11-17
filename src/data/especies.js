// Catálogo educativo de especies (HU-05 y HU-06).
// Estados de conservación según la Lista Roja de la UICN (verificar actualizaciones en iucnredlist.org).

export const CATEGORIAS = [
  { id: 'mamiferos', nombre: 'Mamíferos exóticos', icono: 'hippo', color: '#6d4c41' },
  { id: 'felinos', nombre: 'Grandes felinos y depredadores', icono: 'cat', color: '#bf360c' },
  { id: 'aves', nombre: 'Aves tropicales', icono: 'crow', color: '#1565c0' },
  { id: 'reptiles', nombre: 'Reptiles y anfibios', icono: 'frog', color: '#2e7d32' },
  { id: 'acuaticos', nombre: 'Especies acuáticas', icono: 'fish', color: '#00695c' },
];

export const ESTADOS_UICN = {
  LC: { nombre: 'Preocupación menor', clase: 'text-bg-success' },
  NT: { nombre: 'Casi amenazada', clase: 'text-bg-info' },
  VU: { nombre: 'Vulnerable', clase: 'text-bg-warning' },
  EN: { nombre: 'En peligro', clase: 'text-bg-danger' },
  CR: { nombre: 'En peligro crítico', clase: 'text-bg-dark' },
};

export const ESPECIES = [
  {
    id: 1, slug: 'oso-de-anteojos', nombre: 'Oso de anteojos', cientifico: 'Tremarctos ornatus',
    categoria: 'mamiferos', icono: 'paw', estado: 'VU',
    habitat: 'Bosques andinos, bosques de niebla y páramos', distribucion: 'Andes de Venezuela, Colombia, Ecuador, Perú y Bolivia',
    dieta: 'Omnívoro, principalmente vegetal: bromelias, frutos y cogollos', tamano: '1,3 a 2 m de largo; hasta 175 kg los machos',
    dato: 'Es el único oso de Sudamérica y las manchas claras de su cara son únicas en cada individuo, como una huella digital.',
    tags: ['andes', 'montaña', 'páramo', 'bosque', 'colombia', 'amenazada', 'mamífero', 'oso', 'frío'],
    historia: [
      'El oso de anteojos, también llamado oso andino o ukumarí, habita las montañas desde Venezuela hasta Bolivia. En Colombia recorre las tres cordilleras, y su presencia es señal de bosques y páramos sanos, las mismas fábricas de agua que abastecen a ciudades como Bogotá.',
      'Pasa gran parte del día buscando bromelias, cuyos cogollos abre con sus garras, y trepa a los árboles para alcanzar frutos, donde a veces construye plataformas para descansar. Al dispersar semillas en sus largos recorridos ayuda a regenerar el bosque.',
      'La pérdida de hábitat por la expansión agrícola y ganadera y los conflictos con comunidades rurales son sus principales amenazas. Los centros de conservación trabajan en educación, rescate y monitoreo con cámaras trampa para proteger sus corredores.',
    ],
  },
  {
    id: 2, slug: 'danta-de-montana', nombre: 'Danta de montaña', cientifico: 'Tapirus pinchaque',
    categoria: 'mamiferos', icono: 'horse', estado: 'EN',
    habitat: 'Bosques nublados y páramos entre 2.000 y 4.000 m', distribucion: 'Andes de Colombia, Ecuador y norte del Perú',
    dieta: 'Herbívora: hojas, brotes, frutos y plantas de páramo', tamano: 'Alrededor de 1,8 m de largo y hasta 250 kg',
    dato: 'Es el tapir más pequeño y el único con pelaje lanudo, una adaptación al frío de la alta montaña.',
    tags: ['andes', 'montaña', 'páramo', 'bosque', 'colombia', 'amenazada', 'mamífero', 'herbívoro', 'frío'],
    historia: [
      'La danta de montaña es un pariente lejano de caballos y rinocerontes que vive en las zonas más altas de los Andes. Su pelaje denso, de color café oscuro, la protege de las bajas temperaturas del páramo.',
      'Se le conoce como la "jardinera del bosque" porque dispersa semillas de muchas plantas a lo largo de los kilómetros que recorre. Es solitaria, tímida y de hábitos principalmente nocturnos y crepusculares.',
      'Tiene una reproducción lenta (una cría tras unos 13 meses de gestación), por lo que la cacería y la fragmentación del hábitat afectan gravemente a sus poblaciones.',
    ],
  },
  {
    id: 3, slug: 'jirafa', nombre: 'Jirafa', cientifico: 'Giraffa camelopardalis',
    categoria: 'mamiferos', icono: 'tree', estado: 'VU',
    habitat: 'Sabanas y bosques abiertos', distribucion: 'África subsahariana',
    dieta: 'Herbívora: hojas de acacias y otros árboles', tamano: 'Hasta 5,5 m de altura',
    dato: 'Es el animal terrestre más alto del mundo y su lengua puede medir cerca de medio metro.',
    tags: ['áfrica', 'sabana', 'gigante', 'mamífero', 'herbívoro', 'amenazada', 'calor', 'exótica'],
    historia: [
      'La jirafa usa su cuello largo para alimentarse de hojas que otros herbívoros no alcanzan. A pesar de su longitud, su cuello tiene solo siete vértebras, las mismas que el de un ser humano.',
      'Su corazón es muy potente para bombear sangre hasta la cabeza, y sus patrones de manchas varían entre individuos y subespecies. Vive en grupos de composición cambiante.',
      'Sus poblaciones disminuyeron de forma importante en las últimas décadas por la pérdida de hábitat y la caza furtiva, lo que llevó a la UICN a clasificarla como vulnerable.',
    ],
  },
  {
    id: 4, slug: 'jaguar', nombre: 'Jaguar', cientifico: 'Panthera onca',
    categoria: 'felinos', icono: 'cat', estado: 'NT',
    habitat: 'Selvas húmedas, bosques secos y sabanas inundables', distribucion: 'Desde México hasta el norte de Argentina',
    dieta: 'Carnívoro: chigüiros, pecaríes, caimanes, peces y tortugas', tamano: '1,1 a 1,9 m de largo sin la cola; hasta 150 kg',
    dato: 'Es el felino más grande de América y, en proporción a su tamaño, tiene una de las mordidas más fuertes entre los grandes felinos.',
    tags: ['felino', 'depredador', 'selva', 'colombia', 'amazonía', 'agua', 'nadador', 'amenazada', 'carnívoro', 'nocturno'],
    historia: [
      'El jaguar ocupa la cima de la cadena alimenticia en los bosques de América. A diferencia de muchos felinos, le encanta el agua: nada con facilidad y caza caimanes y peces en los ríos.',
      'Para culturas prehispánicas como la olmeca, la maya y la muisca fue símbolo de poder. En Colombia habita la Amazonía, la Orinoquía, el Pacífico y el Caribe, y necesita grandes territorios conectados.',
      'La deforestación y el conflicto con la ganadería son sus amenazas principales. Iniciativas como el Corredor del Jaguar buscan conectar sus poblaciones a lo largo del continente.',
    ],
  },
  {
    id: 5, slug: 'leon', nombre: 'León', cientifico: 'Panthera leo',
    categoria: 'felinos', icono: 'cat', estado: 'VU',
    habitat: 'Sabanas y pastizales', distribucion: 'África subsahariana y una pequeña población en el bosque de Gir (India)',
    dieta: 'Carnívoro: cebras, ñus, búfalos y antílopes', tamano: 'Machos de hasta 250 kg',
    dato: 'Es el único felino que vive en grupos sociales permanentes, llamados manadas.',
    tags: ['felino', 'depredador', 'áfrica', 'sabana', 'carnívoro', 'amenazada', 'social', 'exótica', 'calor'],
    historia: [
      'Las manadas de leones están formadas por hembras emparentadas, sus crías y uno o varios machos. Las leonas suelen cazar en equipo, mientras los machos defienden el territorio.',
      'Su rugido puede oírse a varios kilómetros y sirve para marcar el territorio y mantener unido al grupo.',
      'En el último siglo su área de distribución se redujo drásticamente por la conversión de sabanas en cultivos, la disminución de sus presas y los conflictos con pastores.',
    ],
  },
  {
    id: 6, slug: 'tigre', nombre: 'Tigre', cientifico: 'Panthera tigris',
    categoria: 'felinos', icono: 'cat', estado: 'EN',
    habitat: 'Bosques tropicales, manglares y bosques boreales', distribucion: 'Asia: India, Sudeste asiático y Lejano Oriente ruso',
    dieta: 'Carnívoro: ciervos y jabalíes', tamano: 'El felino más grande; algunos machos superan los 250 kg',
    dato: 'El patrón de rayas de cada tigre es único, y también está pigmentado en su piel.',
    tags: ['felino', 'depredador', 'asia', 'selva', 'carnívoro', 'amenazada', 'nadador', 'agua', 'exótica', 'gigante'],
    historia: [
      'El tigre es un cazador solitario que acecha a sus presas aprovechando el camuflaje de sus rayas entre la vegetación. Como el jaguar, es un excelente nadador.',
      'A comienzos del siglo XX existían muchos más tigres en libertad que hoy. La caza, el comercio ilegal de sus partes y la pérdida de bosques redujeron sus poblaciones.',
      'Gracias a programas de conservación en países como India y Nepal, algunas poblaciones muestran recuperación, un ejemplo de que la protección funciona.',
    ],
  },
  {
    id: 7, slug: 'condor-andino', nombre: 'Cóndor andino', cientifico: 'Vultur gryphus',
    categoria: 'aves', icono: 'feather', estado: 'VU',
    habitat: 'Cordilleras y páramos; también costas en el sur del continente', distribucion: 'Cordillera de los Andes, de Venezuela a Tierra del Fuego',
    dieta: 'Carroñero', tamano: 'Envergadura de más de 3 m',
    dato: 'Es el ave nacional de Colombia y figura en el escudo; es una de las aves voladoras más grandes del mundo.',
    tags: ['ave', 'andes', 'montaña', 'colombia', 'amenazada', 'gigante', 'volar', 'símbolo', 'frío'],
    historia: [
      'El cóndor andino planea durante horas aprovechando las corrientes de aire, casi sin batir sus enormes alas. Como carroñero, limpia el ecosistema de animales muertos y evita la propagación de enfermedades.',
      'Se reproduce muy lentamente: una pareja puede tener un solo pichón cada dos años. Por eso cada individuo perdido tiene un gran impacto.',
      'El envenenamiento, la cacería y la pérdida de hábitat redujeron sus poblaciones en Colombia; programas de reintroducción y monitoreo buscan devolverlo a los cielos andinos.',
    ],
  },
  {
    id: 8, slug: 'guacamaya-bandera', nombre: 'Guacamaya bandera', cientifico: 'Ara macao',
    categoria: 'aves', icono: 'dove', estado: 'LC',
    habitat: 'Selvas húmedas tropicales y bosques de galería', distribucion: 'Desde el sur de México hasta la Amazonía',
    dieta: 'Frutos, semillas y nueces', tamano: 'Hasta 90 cm incluida la cola',
    dato: 'Visita barrancos de arcilla, llamados collpas, y la consume posiblemente para complementar minerales de su dieta.',
    tags: ['ave', 'selva', 'amazonía', 'colombia', 'colorida', 'volar', 'social', 'calor'],
    historia: [
      'La guacamaya bandera luce plumas rojas, amarillas y azules. Vive en parejas que permanecen juntas durante años y se desplazan en bandadas ruidosas.',
      'Su pico curvo y fuerte le permite romper semillas duras. Al alimentarse de frutos también dispersa semillas por la selva.',
      'Aunque su estado global es de preocupación menor, en varias regiones ha desaparecido por el tráfico ilegal de mascotas. Nunca compres aves silvestres.',
    ],
  },
  {
    id: 9, slug: 'tucan-toco', nombre: 'Tucán toco', cientifico: 'Ramphastos toco',
    categoria: 'aves', icono: 'kiwi-bird', estado: 'LC',
    habitat: 'Sabanas arboladas, bosques de galería y bordes de selva', distribucion: 'Centro y oriente de Sudamérica',
    dieta: 'Frutos, insectos, huevos y pequeños animales', tamano: 'Alrededor de 60 cm; el pico mide casi 20 cm',
    dato: 'Su enorme pico es ligero y le ayuda a regular la temperatura corporal liberando calor.',
    tags: ['ave', 'selva', 'sabana', 'colorida', 'volar', 'calor', 'exótica'],
    historia: [
      'El tucán toco es el más grande de los tucanes. Su pico naranja, aunque parece pesado, está formado por una estructura de queratina con espacios internos que lo hacen liviano.',
      'Estudios científicos mostraron que el pico funciona como un radiador: el ave regula el flujo de sangre hacia él para perder o conservar calor.',
      'Duerme en huecos de árboles, donde gira la cabeza y acomoda el pico sobre la espalda.',
    ],
  },
  {
    id: 10, slug: 'caiman-llanero', nombre: 'Caimán llanero', cientifico: 'Crocodylus intermedius',
    categoria: 'reptiles', icono: 'dragon', estado: 'CR',
    habitat: 'Ríos, lagunas y caños de los Llanos', distribucion: 'Cuenca del río Orinoco (Colombia y Venezuela)',
    dieta: 'Carnívoro: peces, aves y mamíferos', tamano: 'Uno de los cocodrilos más grandes de América',
    dato: 'Es uno de los cocodrilos más amenazados del mundo; en Colombia se crían ejemplares para reintroducirlos.',
    tags: ['reptil', 'agua', 'río', 'llanos', 'colombia', 'amenazada', 'peligro crítico', 'depredador', 'calor'],
    historia: [
      'El caimán llanero fue cazado intensamente por su piel durante buena parte del siglo XX, lo que llevó a sus poblaciones al borde de la extinción.',
      'En Colombia, la Estación de Biología Tropical Roberto Franco de la Universidad Nacional, en Villavicencio, ha criado caimanes durante décadas para apoyar su recuperación.',
      'Protegerlo implica conservar los ríos del Orinoco, evitar el saqueo de nidos y trabajar con las comunidades ribereñas.',
    ],
  },
  {
    id: 11, slug: 'rana-dorada', nombre: 'Rana dorada venenosa', cientifico: 'Phyllobates terribilis',
    categoria: 'reptiles', icono: 'frog', estado: 'EN',
    habitat: 'Selva húmeda tropical', distribucion: 'Endémica del Pacífico colombiano (Cauca)',
    dieta: 'Insectos pequeños, hormigas y ácaros', tamano: 'Alrededor de 5 cm',
    dato: 'Está entre los animales más tóxicos del planeta, pero en cautiverio pierde su veneno porque cambia su dieta.',
    tags: ['anfibio', 'rana', 'selva', 'pacífico', 'colombia', 'amenazada', 'endémica', 'colorida', 'pequeño', 'calor'],
    historia: [
      'La rana dorada solo vive en una pequeña región del Pacífico colombiano. Sus colores intensos advierten a los depredadores que es peligrosa.',
      'Su toxina, la batracotoxina, proviene de los insectos que consume en la selva. Comunidades indígenas emberá la usaban tradicionalmente en dardos para cazar.',
      'La deforestación, la minería ilegal y el tráfico de especies la amenazan. Comprar ranas como mascota alimenta ese comercio ilegal.',
    ],
  },
  {
    id: 12, slug: 'anaconda-verde', nombre: 'Anaconda verde', cientifico: 'Eunectes murinus',
    categoria: 'reptiles', icono: 'dragon', estado: 'LC',
    habitat: 'Ríos lentos, pantanos y llanuras inundables', distribucion: 'Amazonía y Orinoquía',
    dieta: 'Carnívora: peces, aves, chigüiros y caimanes', tamano: 'Puede superar los 5 m de largo',
    dato: 'Es la serpiente más pesada del mundo; no es venenosa y caza por constricción.',
    tags: ['reptil', 'serpiente', 'agua', 'río', 'amazonía', 'llanos', 'colombia', 'gigante', 'depredador', 'nadador'],
    historia: [
      'La anaconda pasa la mayor parte del tiempo en el agua, donde su peso no la limita. Sus ojos y fosas nasales están en la parte superior de la cabeza para respirar y vigilar casi sumergida.',
      'Las hembras son mucho más grandes que los machos y dan a luz crías vivas en lugar de poner huevos.',
      'A pesar de su mala fama, no representa un peligro habitual para las personas y cumple un papel clave controlando poblaciones de presas.',
    ],
  },
  {
    id: 13, slug: 'delfin-rosado', nombre: 'Delfín rosado', cientifico: 'Inia geoffrensis',
    categoria: 'acuaticos', icono: 'fish', estado: 'EN',
    habitat: 'Ríos, lagos y bosques inundados', distribucion: 'Cuencas del Amazonas y del Orinoco',
    dieta: 'Peces, cangrejos y tortugas pequeñas', tamano: 'Hasta 2,5 m de largo',
    dato: 'A diferencia de los delfines marinos, sus vértebras del cuello no están fusionadas, por eso puede girar la cabeza.',
    tags: ['agua', 'río', 'amazonía', 'colombia', 'amenazada', 'mamífero', 'acuático', 'inteligente'],
    historia: [
      'El delfín rosado, o bufeo, es el delfín de río más grande del mundo. Su color rosado se intensifica con la edad y la actividad.',
      'Durante la temporada de lluvias nada entre los árboles del bosque inundado, ayudado por su cuello flexible y su ecolocalización.',
      'La contaminación por mercurio de la minería, las represas, la captura incidental en redes y su uso como carnada lo amenazan. Es protagonista de muchas leyendas amazónicas.',
    ],
  },
  {
    id: 14, slug: 'manati-antillano', nombre: 'Manatí antillano', cientifico: 'Trichechus manatus',
    categoria: 'acuaticos', icono: 'water', estado: 'VU',
    habitat: 'Ríos, ciénagas, estuarios y costas cálidas', distribucion: 'Caribe y Atlántico tropical; en Colombia, cuenca del Magdalena y el Caribe',
    dieta: 'Herbívoro: plantas acuáticas', tamano: 'Hasta 3,5 m y más de 500 kg',
    dato: 'Puede comer una gran cantidad de plantas acuáticas al día, cerca del 10 % de su peso.',
    tags: ['agua', 'río', 'mar', 'caribe', 'colombia', 'amenazada', 'mamífero', 'acuático', 'herbívoro', 'gigante', 'calor'],
    historia: [
      'Los manatíes son mamíferos tranquilos emparentados con los elefantes. Suben a la superficie a respirar cada pocos minutos y se comunican con chillidos.',
      'Al alimentarse de plantas acuáticas ayudan a mantener despejados los cuerpos de agua.',
      'Las colisiones con embarcaciones, la caza y la degradación de las ciénagas son sus principales amenazas en Colombia.',
    ],
  },
  {
    id: 15, slug: 'nutria-gigante', nombre: 'Nutria gigante', cientifico: 'Pteronura brasiliensis',
    categoria: 'acuaticos', icono: 'otter', estado: 'EN',
    habitat: 'Ríos de aguas lentas, lagos y humedales', distribucion: 'Amazonía y Orinoquía',
    dieta: 'Piscívora: principalmente peces', tamano: 'Hasta 1,8 m incluida la cola',
    dato: 'Se le conoce como "lobo de río": vive en grupos familiares muy unidos y vocaliza constantemente.',
    tags: ['agua', 'río', 'amazonía', 'llanos', 'colombia', 'amenazada', 'mamífero', 'acuático', 'social', 'depredador', 'nadador'],
    historia: [
      'La nutria gigante es la más grande de todas las nutrias. Cada individuo tiene en la garganta una mancha clara única que permite identificarlo.',
      'Los grupos familiares defienden su territorio, cazan juntos y cuidan a las crías entre todos.',
      'Estuvo al borde de la extinción por el comercio de su piel; hoy la contaminación de los ríos y la pérdida de hábitat siguen amenazándola.',
    ],
  },
];

export const especiePorSlug = (slug) => ESPECIES.find((e) => e.slug === slug);
export const categoriaPorId = (id) => CATEGORIAS.find((c) => c.id === id);
