const express = require('express');
const PagosController = require('../controllers/PagosController');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

router.use(verificarToken);

// POST /api/pagos/crear-sesion - Crear sesión de pago Stripe
router.post('/crear-sesion', PagosController.crearSesionStripe);

// POST /api/pagos/confirmar - Confirmar orden manual (guarda la orden y vacía el carrito)
router.post('/confirmar', PagosController.confirmarOrden);

// GET /api/pagos/ordenes - Historial de compras del usuario
router.get('/ordenes', PagosController.getOrdenes);

// POST /api/pagos/crear-orden-paypal - Crear orden PayPal Sandbox (devuelve URL para redirigir)
router.post('/crear-orden-paypal', PagosController.crearOrdenPayPal);

// POST /api/pagos/capturar-paypal - Capturar pago PayPal y guardar orden
router.post('/capturar-paypal', PagosController.capturarPagoPayPal);

// Handler del webhook de Stripe (req.body debe ser raw Buffer)
const webhookStripe = PagosController.webhookStripe;

module.exports = router;
module.exports.webhookStripe = webhookStripe;