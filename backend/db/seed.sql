-- =========================================================
--  AVENZA S.A.S. - Datos iniciales (precios ficticios en COP)
-- =========================================================

INSERT INTO productos (codigo, nombre, categoria, descripcion, precio, stock, stock_minimo, imagen) VALUES
('PAS-UKU', 'Pasaporte Bioparque Ukumarí', 'Pasaporte', 'Entrada general de un día al Bioparque Ukumarí (Pereira). Incluye recorrido por las biorregiones.', 45000, 120, 20, '/img/productos/pasaporte-ukumari.svg'),
('PAS-CAL', 'Pasaporte Zoológico de Cali', 'Pasaporte', 'Entrada general de un día al Zoológico de Cali con acceso a charlas educativas.', 38000, 150, 20, '/img/productos/pasaporte-cali.svg'),
('PAS-STC', 'Pasaporte Zoológico Santacruz', 'Pasaporte', 'Entrada general de un día al Zoológico Santacruz (San Antonio del Tequendama).', 28000, 90, 15, '/img/productos/pasaporte-santacruz.svg'),
('PAS-FAM', 'Pasaporte Familiar 3 Parques', 'Pasaporte', 'Paquete para 4 personas válido en los tres parques aliados durante un año.', 360000, 25, 5, '/img/productos/pasaporte-familiar.svg'),
('SOU-TER', 'Termo ecológico de bambú', 'Souvenir', 'Termo de 500 ml con tapa de bambú y grabado del oso de anteojos.', 52000, 40, 10, '/img/productos/termo.svg'),
('SOU-PEL', 'Peluche oso de anteojos', 'Souvenir', 'Peluche de algodón orgánico de 30 cm. Parte de la venta apoya programas de conservación.', 65000, 30, 8, '/img/productos/peluche.svg'),
('SOU-BOL', 'Bolsa reutilizable AVENZA', 'Souvenir', 'Bolsa de lona cruda con ilustraciones de fauna colombiana.', 25000, 80, 15, '/img/productos/bolsa.svg'),
('SOU-LIB', 'Guía ilustrada de fauna colombiana', 'Souvenir', 'Libro de 120 páginas con fichas de 60 especies y sus estados de conservación.', 78000, 4, 5, '/img/productos/libro.svg'),
('SOU-CAM', 'Camiseta algodón orgánico', 'Souvenir', 'Camiseta unisex con estampado del jaguar. Tallas S a XL.', 55000, 50, 10, '/img/productos/camiseta.svg'),
('SOU-SEM', 'Kit de semillas nativas', 'Souvenir', 'Kit para sembrar especies nativas que atraen polinizadores y aves.', 22000, 60, 10, '/img/productos/semillas.svg');

INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, saldo, referencia)
SELECT id, 'ENTRADA', stock, stock, 'Inventario inicial' FROM productos;

INSERT INTO clientes (documento, nombres, email, celular, direccion) VALUES
('1012345678', 'Laura Gómez Pérez', 'laura.gomez@correo.com', '3101234567', 'Calle 45 # 12-30, Bogotá'),
('80123456', 'Carlos Ruiz Martínez', 'carlos.ruiz@correo.com', '3157654321', 'Carrera 7 # 72-10, Bogotá');

INSERT INTO proveedores (nit, razon_social, contacto, email, celular, ciudad) VALUES
('900123456-1', 'EcoSouvenirs Colombia S.A.S.', 'Andrea Molina', 'ventas@ecosouvenirs.co', '3201112233', 'Medellín'),
('901987654-3', 'Textiles Orgánicos Andinos Ltda.', 'Jorge Castaño', 'pedidos@textilesandinos.co', '3184445566', 'Bogotá'),
('830555777-2', 'Parques Aliados de Colombia', 'Natalia Rojas', 'convenios@parquesaliados.co', '3009998877', 'Pereira');

INSERT INTO pqr (radicado, tipo, nombre, documento, email, celular, asunto, mensaje, estado) VALUES
('PQR-2026-000001', 'Sugerencia', 'Laura Gómez Pérez', '1012345678', 'laura.gomez@correo.com', '3101234567', 'Más fichas de anfibios', 'Me gustaría que el catálogo educativo incluyera más especies de anfibios colombianos.', 'RADICADA');
