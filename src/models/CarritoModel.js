const db = require('../config/database');

class CarritoModel {
  static findByUsuarioId(usuarioId) {
    return db.prepare(`
      SELECT ci.id, ci.producto_codigo, ci.cantidad, p.nombre, p.precio,
             (ci.cantidad * p.precio) as subtotal
      FROM carrito_items ci
      JOIN productos p ON p.codigo = ci.producto_codigo
      WHERE ci.usuario_id = ?
    `).all(usuarioId);
  }

  static findItemByUsuarioYProducto(usuarioId, codigo) {
    return db.prepare(`
      SELECT * FROM carrito_items
      WHERE usuario_id = ? AND producto_codigo = ?
    `).get(usuarioId, codigo);
  }

  static addItem(usuarioId, codigo, cantidad) {
    const existente = this.findItemByUsuarioYProducto(usuarioId, codigo);
    
    if (existente) {
      const nuevaCantidad = existente.cantidad + parseInt(cantidad);
      db.prepare('UPDATE carrito_items SET cantidad = ? WHERE id = ?')
        .run(nuevaCantidad, existente.id);
    } else {
      db.prepare(`
        INSERT INTO carrito_items (usuario_id, producto_codigo, cantidad)
        VALUES (?, ?, ?)
      `).run(usuarioId, codigo, parseInt(cantidad));
    }
    
    return this.findByUsuarioId(usuarioId);
  }

  static deleteAllItems(usuarioId) {
    db.prepare('DELETE FROM carrito_items WHERE usuario_id = ?').run(usuarioId);
    return [];
  }

  static getTotal(items) {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  }
}

module.exports = CarritoModel;