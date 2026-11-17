// Componente de Inteligencia Artificial: recomendador de especies y pasaportes.
// Usa Google Gemini si existe GEMINI_API_KEY; si no, el frontend usa su motor local.
import { Router } from 'express';

const router = Router();

router.get('/estado', (_req, res) => {
  res.json({ gemini: Boolean(process.env.GEMINI_API_KEY), modelo: process.env.GEMINI_MODEL || 'gemini-2.5-flash' });
});

router.post('/recomendar', async (req, res, next) => {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return res.status(503).json({ error: 'IA externa no configurada', codigo: 'IA_NO_CONFIGURADA' });

    const { intereses = [], mensaje = '', catalogo = {} } = req.body;
    const especies = (catalogo.especies || []).slice(0, 40);
    const pasaportes = (catalogo.pasaportes || []).slice(0, 10);
    if (!especies.length) return res.status(400).json({ error: 'Catálogo vacío' });

    const prompt = `Eres el guía educativo de AVENZA S.A.S., una plataforma colombiana sobre zoológicos y conservación.
Un visitante indicó estos intereses: ${intereses.join(', ') || 'ninguno'}.
Mensaje del visitante: "${String(mensaje).slice(0, 500)}".
Catálogo de especies (JSON): ${JSON.stringify(especies)}
Pasaportes disponibles (JSON): ${JSON.stringify(pasaportes)}
Elige exactamente 3 especies del catálogo y 1 pasaporte que mejor se ajusten al visitante.
Responde SOLO con JSON con esta forma:
{"especies":[{"id":number,"razon":"máx 25 palabras"}],"pasaporte":{"id":number,"razon":"máx 25 palabras"},"mensaje":"saludo breve y amable en español, máx 40 palabras"}`;

    const modelo = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.6 },
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!resp.ok) {
      const detalle = await resp.text();
      console.error('Gemini respondió', resp.status, detalle.slice(0, 300));
      return res.status(502).json({ error: 'El servicio de IA no respondió correctamente' });
    }
    const data = await resp.json();
    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const json = JSON.parse(texto);

    // Se filtran ids inexistentes (la IA puede "alucinar")
    const idsEsp = new Set(especies.map((e) => e.id));
    const idsPas = new Set(pasaportes.map((p) => p.id));
    const recomendadas = (json.especies || []).filter((e) => idsEsp.has(e.id)).slice(0, 3);
    if (!recomendadas.length) return res.status(502).json({ error: 'Respuesta de IA sin especies válidas' });

    res.json({
      fuente: `Google Gemini (${modelo})`,
      mensaje: json.mensaje || '',
      especies: recomendadas,
      pasaporte: json.pasaporte && idsPas.has(json.pasaporte.id) ? json.pasaporte : null,
    });
  } catch (e) {
    if (e.name === 'TimeoutError' || e instanceof SyntaxError) {
      return res.status(502).json({ error: 'El servicio de IA no respondió a tiempo' });
    }
    next(e);
  }
});

export default router;
