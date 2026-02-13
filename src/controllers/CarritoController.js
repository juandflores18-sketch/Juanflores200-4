const CarritoService = require('../services/CarritoService');
const { body, validationResult } = require('express-validator');

class CarritoController {
  static getValidatorsAgregar() {
    return [
      body('codigo').trim().notEmpty().withMessage('El código del producto es requerido'),
      body('cantidad').optional().isInt({ min: 1 }).withMessage('La cantidad debe ser mayor a 0')
    ];
  }

  static getCarrito(req, res) {
    try {
      const carrito = CarritoService.getCarrito(req.usuario.id);
      res.json(carrito);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static addItem(req, res) {
    try {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }

      const { codigo, cantidad = 1 } = req.body;
      const resultado = CarritoService.addItem(req.usuario.id, codigo, cantidad);

      res.status(201).json(resultado);
    } catch (error) {
      console.error(error);
      if (error.message === 'Producto no encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static vaciarCarrito(req, res) {
    try {
      const resultado = CarritoService.vaciarCarrito(req.usuario.id);
      res.json(resultado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CarritoController;