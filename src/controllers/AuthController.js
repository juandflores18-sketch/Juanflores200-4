const AuthService = require('../services/AuthService');
const { body, validationResult } = require('express-validator');

class AuthController {
  static getValidatorsRegistro() {
    return [
      body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
      body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
      body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
      body('nivel')
        .isIn(['admin', 'usuario'])
        .withMessage('El nivel debe ser admin o usuario')
    ];
  }

  static getValidatorsLogin() {
    return [
      body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
      body('password').notEmpty().withMessage('La contraseña es requerida')
    ];
  }

  static async registrar(req, res) {
    try {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }

      const { nombre, email, password, nivel } = req.body;
      const usuario = await AuthService.registrar(nombre, email, password, nivel);

      res.status(201).json({
        mensaje: 'Usuario registrado correctamente',
        usuario
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }

      const { email, password } = req.body;
      const resultado = await AuthService.login(email, password);

      res.json({
        mensaje: 'Login exitoso',
        token: resultado.token,
        usuario: resultado.usuario
      });
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: error.message });
    }
  }

  static async getPerfil(req, res) {
    try {
      const usuario = AuthService.getPerfil(req.usuario.id);
      res.json(usuario);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = AuthController;