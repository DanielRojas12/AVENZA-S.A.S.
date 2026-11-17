-- =========================================================
--  AVENZA S.A.S. - Esquema de base de datos (PostgreSQL / Neon)
--  Ejecutar con:  npm run db:init   (desde la carpeta backend)
-- =========================================================

DROP TABLE IF EXISTS inventario_movimientos CASCADE;
DROP TABLE IF EXISTS factura_detalle CASCADE;
DROP TABLE IF EXISTS facturas CASCADE;
DROP TABLE IF EXISTS compras CASCADE;
DROP TABLE IF EXISTS pqr CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS productos CASCADE;

-- Catálogo comercial: pasaportes (entradas) y souvenirs ecológicos
CREATE TABLE productos (
  id            SERIAL PRIMARY KEY,
  codigo        VARCHAR(20)  NOT NULL UNIQUE,
  nombre        VARCHAR(120) NOT NULL,
  categoria     VARCHAR(20)  NOT NULL CHECK (categoria IN ('Pasaporte', 'Souvenir')),
  descripcion   TEXT         NOT NULL DEFAULT '',
  precio        NUMERIC(12,2) NOT NULL CHECK (precio >= 0),
  stock         INTEGER      NOT NULL DEFAULT 0 CHECK (stock >= 0),
  stock_minimo  INTEGER      NOT NULL DEFAULT 5 CHECK (stock_minimo >= 0),
  imagen        VARCHAR(255) NOT NULL DEFAULT '/img/productos/generico.svg',
  activo        BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE clientes (
  id         SERIAL PRIMARY KEY,
  documento  VARCHAR(12)  NOT NULL UNIQUE,
  nombres    VARCHAR(80)  NOT NULL,
  email      VARCHAR(120) NOT NULL,
  celular    VARCHAR(10)  NOT NULL,
  direccion  VARCHAR(150) NOT NULL DEFAULT '',
  creado_en  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE proveedores (
  id            SERIAL PRIMARY KEY,
  nit           VARCHAR(15)  NOT NULL UNIQUE,
  razon_social  VARCHAR(120) NOT NULL,
  contacto      VARCHAR(80)  NOT NULL,
  email         VARCHAR(120) NOT NULL,
  celular       VARCHAR(10)  NOT NULL,
  ciudad        VARCHAR(60)  NOT NULL DEFAULT 'Bogotá'
);

-- Compras a proveedores: cada compra AUMENTA el stock del producto
CREATE TABLE compras (
  id              SERIAL PRIMARY KEY,
  proveedor_id    INTEGER NOT NULL REFERENCES proveedores(id),
  producto_id     INTEGER NOT NULL REFERENCES productos(id),
  cantidad        INTEGER NOT NULL CHECK (cantidad > 0),
  costo_unitario  NUMERIC(12,2) NOT NULL CHECK (costo_unitario >= 0),
  total           NUMERIC(14,2) NOT NULL,
  fecha           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Facturación (ventas): cada factura DESCUENTA stock
CREATE TABLE facturas (
  id               SERIAL PRIMARY KEY,
  numero           VARCHAR(20) UNIQUE,
  cliente_id       INTEGER NOT NULL REFERENCES clientes(id),
  fecha            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  subtotal         NUMERIC(14,2) NOT NULL,
  iva              NUMERIC(14,2) NOT NULL,
  total            NUMERIC(14,2) NOT NULL,
  metodo_pago      VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('TARJETA', 'PSE', 'NEQUI')),
  referencia_pago  VARCHAR(40) NOT NULL,
  estado           VARCHAR(10) NOT NULL DEFAULT 'PAGADA' CHECK (estado IN ('PAGADA', 'ANULADA'))
);

CREATE TABLE factura_detalle (
  id               SERIAL PRIMARY KEY,
  factura_id       INTEGER NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
  producto_id      INTEGER NOT NULL REFERENCES productos(id),
  descripcion      VARCHAR(120) NOT NULL,
  cantidad         INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario  NUMERIC(12,2) NOT NULL,
  subtotal         NUMERIC(14,2) NOT NULL
);

-- Kardex: historial de entradas y salidas de inventario
CREATE TABLE inventario_movimientos (
  id           SERIAL PRIMARY KEY,
  producto_id  INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  tipo         VARCHAR(10) NOT NULL CHECK (tipo IN ('ENTRADA', 'SALIDA', 'AJUSTE', 'ANULACION')),
  cantidad     INTEGER NOT NULL,
  saldo        INTEGER NOT NULL,
  referencia   VARCHAR(60) NOT NULL DEFAULT '',
  fecha        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Peticiones, Quejas, Reclamos y Sugerencias
CREATE TABLE pqr (
  id         SERIAL PRIMARY KEY,
  radicado   VARCHAR(20) UNIQUE,
  tipo       VARCHAR(12) NOT NULL CHECK (tipo IN ('Petición', 'Queja', 'Reclamo', 'Sugerencia')),
  nombre     VARCHAR(80)  NOT NULL,
  documento  VARCHAR(12)  NOT NULL,
  email      VARCHAR(120) NOT NULL,
  celular    VARCHAR(10)  NOT NULL,
  asunto     VARCHAR(120) NOT NULL,
  mensaje    TEXT         NOT NULL,
  estado     VARCHAR(12)  NOT NULL DEFAULT 'RADICADA' CHECK (estado IN ('RADICADA', 'EN TRÁMITE', 'RESUELTA')),
  respuesta  TEXT         NOT NULL DEFAULT '',
  fecha      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_facturas_fecha ON facturas(fecha);
CREATE INDEX idx_mov_producto ON inventario_movimientos(producto_id, fecha);
