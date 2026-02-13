const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../database.sqlite'));

// Inicializar tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nivel TEXT NOT NULL CHECK(nivel IN ('admin', 'usuario')),
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    codigo TEXT UNIQUE NOT NULL,
    precio REAL NOT NULL,
    descripcion TEXT,
    imagen TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS carrito_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    producto_codigo TEXT NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_codigo) REFERENCES productos(codigo),
    UNIQUE(usuario_id, producto_codigo)
  );

  CREATE TABLE IF NOT EXISTS ordenes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    total REAL NOT NULL,
    estado TEXT DEFAULT 'completada',
    stripe_session_id TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS orden_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orden_id INTEGER NOT NULL,
    producto_codigo TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id)
  );
`);

module.exports = db;
