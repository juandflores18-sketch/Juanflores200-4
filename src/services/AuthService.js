const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/UsuarioModel');
const { SECRET_KEY } = require('../middleware/auth');

class AuthService {
  static async registrar(nombre, email, password, nivel) {
    // Verificar si el email ya existe
    const existente = UsuarioModel.findByEmail(email);
    if (existente) {
      throw new Error('El email ya está registrado');
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const usuario = UsuarioModel.create(nombre, email, passwordHash, nivel);

    return usuario;
  }

  static async login(email, password) {
    const usuario = UsuarioModel.findByEmail(email);
    if (!usuario) {
      throw new Error('Credenciales incorrectas');
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      throw new Error('Credenciales incorrectas');
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nivel: usuario.nivel },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        nivel: usuario.nivel
      }
    };
  }

  static getPerfil(usuarioId) {
    const usuario = UsuarioModel.findById(usuarioId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    return usuario;
  }
}

module.exports = AuthService;