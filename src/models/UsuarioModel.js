const db = require('../config/database');

class UsuarioModel {
  static findByEmail(email) {
    return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  }

  static findById(id) {
    return db.prepare('SELECT id, nombre, email, nivel FROM usuarios WHERE id = ?').get(id);
  }

  static create(nombre, email, password, nivel) {
    const resultado = db.prepare(`
      INSERT INTO usuarios (nombre, email, password, nivel)
      VALUES (?, ?, ?, ?)
    `).run(nombre, email, password, nivel);
    return this.findById(resultado.lastInsertRowid);
  }

  static findAll() {
    return db.prepare('SELECT id, nombre, email, nivel FROM usuarios').all();
  }
}

module.exports = UsuarioModel;