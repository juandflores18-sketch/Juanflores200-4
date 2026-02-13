const db = require('../config/database');

class ProductoModel {
  static findAll() {
    return db.prepare('SELECT * FROM productos ORDER BY nombre').all();
  }

  static findByCodigo(codigo) {
    return db.prepare('SELECT * FROM productos WHERE codigo = ?').get(codigo);
  }

  static create(nombre, codigo, precio, descripcion, imagen) {
    db.prepare(`
      INSERT INTO productos (nombre, codigo, precio, descripcion, imagen)
      VALUES (?, ?, ?, ?, ?)
    `).run(nombre, codigo, parseFloat(precio), descripcion || null, imagen || null);
    return this.findByCodigo(codigo);
  }

  static update(codigo, nuevosValores) {
    db.prepare(`
      UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, imagen = ?
      WHERE codigo = ?
    `).run(
      nuevosValores.nombre,
      nuevosValores.precio,
      nuevosValores.descripcion,
      nuevosValores.imagen || null,
      codigo
    );
    return this.findByCodigo(codigo);
  }

  static delete(codigo) {
    return db.prepare('DELETE FROM productos WHERE codigo = ?').run(codigo);
  }
}

module.exports = ProductoModel;