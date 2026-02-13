const express = require('express');
const AuthController = require('../controllers/AuthController');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/registro - Registro de usuario
router.post('/registro', AuthController.getValidatorsRegistro(), AuthController.registrar);

// POST /api/auth/login - Login
router.post('/login', AuthController.getValidatorsLogin(), AuthController.login);

// GET /api/auth/perfil - Obtener perfil (protegido)
router.get('/perfil', verificarToken, AuthController.getPerfil);

module.exports = router;