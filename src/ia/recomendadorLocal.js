// =========================================================
//  Motor local de recomendación (componente de IA, HU-14)
//  Técnica: recuperación de información con TF-IDF + similitud del coseno,
//  un método clásico de aprendizaje automático no supervisado para
//  sistemas de recomendación basados en contenido.
// =========================================================
import { ESPECIES, CATEGORIAS } from '../data/especies';

// Intereses que el usuario puede marcar y las palabras que activan
export const INTERESES = [
  { id: 'felinos', etiqueta: 'Grandes felinos', palabras: ['felino', 'depredador', 'carnívoro'] },
  { id: 'aves', etiqueta: 'Aves', palabras: ['ave', 'volar', 'colorida'] },
  { id: 'agua', etiqueta: 'Ríos y mar', palabras: ['agua', 'río', 'acuático', 'nadador', 'mar'] },
  { id: 'reptiles', etiqueta: 'Reptiles y anfibios', palabras: ['reptil', 'anfibio', 'serpiente', 'rana'] },
  { id: 'andes', etiqueta: 'Montaña y páramo', palabras: ['andes', 'montaña', 'páramo', 'frío'] },
  { id: 'selva', etiqueta: 'Selva y Amazonía', palabras: ['selva', 'amazonía', 'calor'] },
  { id: 'colombia', etiqueta: 'Fauna colombiana', palabras: ['colombia', 'endémica', 'símbolo'] },
  { id: 'amenazadas', etiqueta: 'Especies amenazadas', palabras: ['amenazada', 'peligro crítico'] },
  { id: 'gigantes', etiqueta: 'Animales gigantes', palabras: ['gigante'] },
  { id: 'exoticas', etiqueta: 'Fauna de otros continentes', palabras: ['exótica', 'áfrica', 'asia', 'sabana'] },
];

const STOPWORDS = new Set('a al algo como con de del el en es esta este la las lo los me mi mis muy no o para pero por que quiero se si sin su sus te tu un una uno y ya me gusta gustan gustaria encanta encantan ver conocer animales animal'.split(' '));

/** Pasa a minúsculas, quita tildes y signos, y elimina palabras vacías. */
export function tokenizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t))
    .map(raiz);
}

/** "Stemming" muy simple para español: unifica plurales y algunos sufijos. */
function raiz(t) {
  return t.replace(/(es|s)$/, '').replace(/(ito|ita)$/, '').replace(/a$/, 'o');
}

/** Documento de texto que describe a cada especie (las etiquetas pesan el doble). */
function documento(e) {
  const cat = CATEGORIAS.find((c) => c.id === e.categoria)?.nombre || '';
  return [e.nombre, cat, e.tags.join(' '), e.tags.join(' '), e.habitat, e.distribucion, e.dieta].join(' ');
}

// --- Construcción del modelo TF-IDF (se calcula una sola vez) ---
const DOCS = ESPECIES.map((e) => tokenizar(documento(e)));
const DF = new Map();
DOCS.forEach((tokens) => new Set(tokens).forEach((t) => DF.set(t, (DF.get(t) || 0) + 1)));
const N = DOCS.length;
const idf = (t) => Math.log((N + 1) / ((DF.get(t) || 0) + 1)) + 1;

function vector(tokens) {
  const tf = new Map();
  tokens.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
  const v = new Map();
  tf.forEach((n, t) => v.set(t, (n / tokens.length) * idf(t)));
  return v;
}

function coseno(a, b) {
  let punto = 0;
  a.forEach((x, t) => { if (b.has(t)) punto += x * b.get(t); });
  const na = Math.sqrt([...a.values()].reduce((s, x) => s + x * x, 0));
  const nb = Math.sqrt([...b.values()].reduce((s, x) => s + x * x, 0));
  return na && nb ? punto / (na * nb) : 0;
}

const VECTORES = DOCS.map(vector);

/**
 * Recomienda especies y un pasaporte.
 * @param {string[]} intereses ids de INTERESES seleccionados
 * @param {string} mensaje texto libre del visitante
 * @param {object[]} pasaportes productos de categoría Pasaporte (desde la API)
 */
export function recomendarLocal(intereses, mensaje, pasaportes = []) {
  const palabras = INTERESES.filter((i) => intereses.includes(i.id)).flatMap((i) => i.palabras);
  const tokensUsuario = tokenizar([...palabras, mensaje].join(' '));
  if (!tokensUsuario.length) return null;

  const vUsuario = vector(tokensUsuario);
  const puntajes = ESPECIES.map((e, i) => {
    const sim = coseno(vUsuario, VECTORES[i]);
    const coincidencias = [...new Set(tokensUsuario.filter((t) => DOCS[i].includes(t)))];
    return { especie: e, sim, coincidencias };
  })
    .filter((p) => p.sim > 0)
    .sort((a, b) => b.sim - a.sim)
    .slice(0, 3);

  if (!puntajes.length) return null;
  const max = puntajes[0].sim;

  return {
    fuente: 'Motor local (TF-IDF + similitud del coseno)',
    mensaje: '¡Analicé tus intereses! Estas especies son las que más se parecen a lo que buscas.',
    especies: puntajes.map((p) => ({
      id: p.especie.id,
      afinidad: Math.round((p.sim / max) * 100),
      razon: `Coincide con: ${traducir(p.coincidencias, p.especie).join(', ')}.`,
    })),
    pasaporte: elegirPasaporte(tokenizar(mensaje), pasaportes),
  };
}

/** Muestra al usuario las etiquetas reales (con tildes) que coincidieron. */
function traducir(raices, especie) {
  const fuente = [...especie.tags, ...tokenizarConOriginal(especie.habitat)];
  const legibles = raices.map((r) => fuente.find((t) => tokenizar(t)[0] === r) || r);
  return [...new Set(legibles)].slice(0, 4);
}
const tokenizarConOriginal = (t) => t.toLowerCase().split(/[\s,;:]+/).filter((x) => x.length > 3);

/** Regla sencilla para sugerir pasaporte según región o tipo de plan. */
function elegirPasaporte(tokens, pasaportes) {
  if (!pasaportes.length) return null;
  const por = (codigo) => pasaportes.find((p) => p.codigo === codigo);
  const tiene = (...ps) => ps.some((p) => tokens.includes(raiz(p)));
  let elegido = null;
  let razon = '';
  if (tiene('familia', 'hijos', 'ninos', 'nino', 'familiar')) { elegido = por('PAS-FAM'); razon = 'Mencionaste un plan en familia: el pase familiar cubre 4 personas en 3 parques.'; }
  else if (tiene('pereira', 'risaralda', 'cafetero', 'eje')) { elegido = por('PAS-UKU'); razon = 'Está en el Eje Cafetero, la región que mencionaste.'; }
  else if (tiene('cali', 'valle', 'pacifico')) { elegido = por('PAS-CAL'); razon = 'Queda en Cali, la región que mencionaste.'; }
  else if (tiene('bogota', 'cundinamarca', 'colegio', 'salida')) { elegido = por('PAS-STC'); razon = 'Está a menos de una hora de Bogotá, ideal para una salida corta.'; }
  if (!elegido) { elegido = por('PAS-FAM') || pasaportes[0]; razon = 'Te permite visitar los tres parques aliados y ver más especies.'; }
  return elegido ? { id: elegido.id, razon } : null;
}
