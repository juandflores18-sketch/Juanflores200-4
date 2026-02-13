const PagosService = require('../services/PagosService');

class PagosController {
  static async crearSesionStripe(req, res) {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const resultado = await PagosService.crearSesionStripe(req.usuario.id, frontendUrl);
      res.json(resultado);
    } catch (error) {
      console.error(error);
      if (error.message.includes('no configurados') || error.message.includes('no configurado')) {
        res.status(503).json({ error: error.message });
      } else if (error.message === 'El carrito está vacío') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static confirmarOrden(req, res) {
    try {
      const resultado = PagosService.confirmarOrden(req.usuario.id);
      res.json(resultado);
    } catch (error) {
      console.error(error);
      if (error.message === 'El carrito está vacío') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static getOrdenes(req, res) {
    try {
      const ordenes = PagosService.getOrdenes(req.usuario.id);
      res.json(ordenes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async crearOrdenPayPal(req, res) {
    try {
      const frontendUrl = process.env.FRONTEND_URL || (req.protocol + '://' + req.get('host'));
      const resultado = await PagosService.crearOrdenPayPal(req.usuario.id, frontendUrl);
      res.json(resultado);
    } catch (error) {
      console.error(error);
      if (error.message.includes('no configurados') || error.message.includes('no configurado')) {
        res.status(503).json({ error: error.message });
      } else if (error.message === 'El carrito está vacío') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async capturarPagoPayPal(req, res) {
    try {
      const orderId = req.body?.orderId || req.query?.orderId;
      if (!orderId) {
        return res.status(400).json({ error: 'Falta orderId de PayPal' });
      }

      const resultado = await PagosService.capturarPagoPayPal(orderId, req.usuario.id);
      res.json(resultado);
    } catch (error) {
      console.error(error);
      if (error.message.includes('no configurados') || error.message.includes('no configurado')) {
        res.status(503).json({ error: error.message });
      } else if (error.message === 'El carrito está vacío') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static webhookStripe(req, res) {
    try {
      const resultado = PagosService.webhookStripe(req);
      res.json(resultado);
    } catch (error) {
      console.error(error);
      if (error.message.includes('no configurado')) {
        res.status(503).send('Webhook no configurado');
      } else if (error.message.includes('Falta')) {
        res.status(400).send(error.message);
      } else if (error.message.includes('Webhook Error')) {
        res.status(400).send(error.message);
      } else {
        res.status(500).send(error.message);
      }
    }
  }
}

module.exports = PagosController;