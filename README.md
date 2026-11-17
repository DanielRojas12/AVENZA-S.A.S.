# AVENZA S.A.S. — Proyecto Final de Programación Web

Plataforma educativa sobre la historia de los zoológicos, la fauna y su conservación, con tienda en línea de pasaportes y souvenirs ecológicos.

**Equipo:** Juan Felipe Rodríguez Santaella · María Alejandra Guerrero Molina · Daniel Alejandro Rojas Saavedra
**Docente:** Hugo Urrego · Universidad Libre, Bogotá D.C., 2026

## Arquitectura

| Capa | Tecnología | Puerto |
|---|---|---|
| Frontend (SPA) | React 19 + Vite + Bootstrap 5 | 5173 |
| Backend (API REST) | Express.js 4 + `pg` | 4000 |
| Base de datos | PostgreSQL en **Neon** | — |
| API virtual de desarrolladores | json-server (`db.json`) | 3004 |
| IA (opcional) | Google Gemini vía backend + motor local TF-IDF | — |

## Puesta en marcha

Requisitos: Node.js 20 o superior y una cuenta gratuita en [Neon](https://neon.tech).

```bash
# 1. Dependencias
npm install
npm --prefix backend install

# 2. Variables de entorno
cp backend/.env.example backend/.env   # pegue su DATABASE_URL de Neon
cp .env.example .env                    # solo si cambia puertos o usa Codespaces

# 3. Crear tablas y datos iniciales en Neon
npm run db:init

# 4. Levantar los tres servicios (una terminal para cada uno)
npm run backend   # API Express  → http://localhost:4000/api/health
npm run server    # json-server  → http://localhost:3004/desarrolladores
npm run dev       # React        → http://localhost:5173
```

**En GitHub Codespaces:** en la pestaña *Puertos* haga públicos el 4000 y el 3004, copie sus URL y póngalas en `.env` (`VITE_API_URL=https://…-4000.app.github.dev/api` y `VITE_DEVS_URL=https://…-3004.app.github.dev`). Agregue también la URL del 5173 a `CORS_ORIGIN` en `backend/.env`.

**IA con Gemini (opcional):** cree una clave en Google AI Studio y póngala en `GEMINI_API_KEY` de `backend/.env`. Sin clave, el recomendador funciona igual con el motor local.

## Pruebas rápidas

- Tarjeta aprobada: `4111 1111 1111 1111` · rechazada: `4000 0000 0000 0002` (cualquier fecha futura y CVV de 3 dígitos).
- Celular válido: 10 dígitos que empiezan por 3 (ej. `3001234567`).

## Estructura

```
├── index.html, vite.config.js, db.json (json-server)
├── public/img/            logo, slides, productos, fotos de desarrolladores
├── src/
│   ├── router/            enrutador SPA (History API) con página 404
│   ├── context/           carrito, accesibilidad, avisos
│   ├── helpers/           helpFetch, validaciones (regex), formato
│   ├── data/              especies, zoológicos, información corporativa
│   ├── ia/                recomendador local TF-IDF + coseno
│   ├── components/        layout, carrusel, acordeón, QR, CRUD reutilizable
│   └── pages/             una página por ruta
└── backend/
    ├── db/                schema.sql, seed.sql, init.js
    └── src/               server.js, db.js, validaciones.js, routes/
```

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/productos/catalogo` | Catálogo público (filtros `categoria`, `q`) |
| GET/POST/PUT/DELETE | `/api/productos`, `/api/clientes`, `/api/proveedores` | CRUD |
| PATCH | `/api/productos/:id/stock` | Ajuste de inventario |
| GET/POST | `/api/compras` | Compras a proveedores (suman stock) |
| GET/POST | `/api/facturas` | Facturación / checkout (descuenta stock) |
| PATCH | `/api/facturas/:id/anular` | Anulación (devuelve stock) |
| GET | `/api/reportes/resumen`, `/api/reportes/kardex` | Indicadores y kardex |
| GET/POST/PATCH | `/api/pqr`, `/api/pqr/radicado/:n` | PQR |
| POST | `/api/ia/recomendar` | Recomendador con Gemini |

## Antes de entregar

- Reemplace `public/img/logo.svg` y `logo-claro.svg` por el logotipo oficial del grupo.
- Reemplace las fotos de `public/img/devs/` y los celulares de `db.json` por los reales.
- Cambie las URL de redes sociales en `src/data/empresa.js` por las cuentas del proyecto.

Íconos: Font Awesome Free (CC BY 4.0).
