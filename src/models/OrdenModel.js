const db = require('../config/database');

class OrdenModel {
  static create(usuarioId, total, stripeSessionId = null) {
    const resultado = db.prepare(`
      INSERT INTO ordenes (usuario_id, total, estado, stripe_session_id)
      VALUES (?, ?, 'completada', ?)
    `).run(usuarioId, total, stripeSessionId);
    return this.findById(resultado.lastInsertRowid);
  }

  static findById(id) {
    return db.prepare('SELECT * FROM ordenes WHERE id = ?').get(id);
  }

  static findByUsuarioId(usuarioId) {
    return db.prepare('SELECT * FROM ordenes WHERE usuario_id = ? ORDER BY creado_en DESC').all(usuarioId);
  }

  static createOrdenItems(ordenId, items) {
    const statement = db.prepare(`
      INSERT INTO orden_items (orden_id, producto_codigo, cantidad, precio_unitario)
      VALUES (?, ?, ?, ?)
    `);

    items.forEach(item => {
      statement.run(ordenId, item.producto_codigo, item.cantidad, item.precio);
    });
  }

  static findItemsByOrdenId(ordenId) {
    return db.prepare(`
      SELECT oi.producto_codigo, oi.cantidad, oi.precio_unitario, p.nombre
      FROM orden_items oi
      JOIN productos p ON p.codigo = oi.producto_codigo
      WHERE oi.orden_id = ?
    `).all(ordenId);
  }

  static updateEstado(ordenId, estado) {
    db.prepare('UPDATE ordenes SET estado = ? WHERE id = ?').run(estado, ordenId);
    return this.findById(ordenId);
  }
}

module.exports = OrdenModel;