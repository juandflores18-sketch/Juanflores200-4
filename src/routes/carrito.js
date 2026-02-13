const express = require('express');
const CarritoController = require('../controllers/CarritoController');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

router.use(verificarToken);

// GET /api/carrito - Ver carrito con total
router.get('/', CarritoController.getCarrito);

// POST /api/carrito - Agregar producto al carrito
router.post('/', CarritoController.getValidatorsAgregar(), CarritoController.addItem);

// DELETE /api/carrito - Vaciar carrito
router.delete('/', CarritoController.vaciarCarrito);

module.exports = router;