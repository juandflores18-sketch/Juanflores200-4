const express = require('express');
const ProductoController = require('../controllers/ProductoController');
const { verificarToken, requiereAdmin } = require('../middleware/auth');

const router = express.Router();

// Aplicar verificación de token a todas las rutas
router.use(verificarToken);

// GET /api/productos - Ver todos los productos
router.get('/', ProductoController.getAll);

// GET /api/productos/:codigo - Ver producto por código
router.get('/:codigo', ProductoController.getValidatorsPorCodigo(), ProductoController.getByCodigo);

// POST /api/productos - Crear producto (solo admin)
router.post('/', requiereAdmin, ProductoController.getValidatorsCrear(), ProductoController.create);

// PUT /api/productos/:codigo - Actualizar producto (solo admin)
router.put('/:codigo', requiereAdmin, ProductoController.getValidatorsActualizar(), ProductoController.update);

// DELETE /api/productos/:codigo - Eliminar producto (solo admin)
router.delete('/:codigo', requiereAdmin, ProductoController.getValidatorsPorCodigo(), ProductoController.delete);

module.exports = router;