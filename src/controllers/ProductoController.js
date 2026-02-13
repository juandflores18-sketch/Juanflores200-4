const ProductoService = require('../services/ProductoService');
const { body, param, validationResult } = require('express-validator');

class ProductoController {
  static getValidatorsCrear() {
    return [
      body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
      body('codigo').trim().notEmpty().withMessage('El código es requerido'),
      body('precio')
        .isFloat({ min: 0.01 })
        .withMessage('El precio debe ser mayor a 0'),
      body('descripcion').optional().trim(),
      body('imagen').optional().trim()
    ];
  }

  static getValidatorsActualizar() {
    return [
      param('codigo').notEmpty(),
      body('nombre').optional().trim().notEmpty(),
      body('precio').optional().isFloat({ min: 0.01 }),
      body('descripcion').optional().trim(),
      body('imagen').optional().trim()
    ];
  }

  static getValidatorsPorCodigo() {
    return [
      param('codigo').notEmpty()
    ];
  }

  static getAll(req, res) {
    try {
      const productos = ProductoService.getAll();
      res.json(productos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static getByCodigo(req, res) {
    try {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }

      const producto = ProductoService.getByCodigo(req.params.codigo);
      res.json(producto);
    } catch (error) {
      console.error(error);
      if (error.message === 'Producto no encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static create(req, res) {
    try {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }

      const { nombre, codigo, precio, descripcion, imagen } = req.body;
      const producto = ProductoService.create(nombre, codigo, precio, descripcion, imagen);

      res.status(201).json(producto);
    } catch (error) {
      console.error(error);
      if (error.message.includes('Ya existe')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static update(req, res) {
    try {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }

      const { nombre, precio, descripcion, imagen } = req.body;
      const producto = ProductoService.getByCodigo(req.params.codigo);
      
      const nuevosValores = {
        nombre: nombre ?? producto.nombre,
        precio: precio !== undefined ? parseFloat(precio) : producto.precio,
        descripcion: descripcion !== undefined ? descripcion : producto.descripcion,
        imagen: imagen !== undefined ? imagen : producto.imagen
      };

      const actualizado = ProductoService.update(req.params.codigo, nuevosValores);
      res.json(actualizado);
    } catch (error) {
      console.error(error);
      if (error.message === 'Producto no encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static delete(req, res) {
    try {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }

      ProductoService.delete(req.params.codigo);
      res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error(error);
      if (error.message === 'Producto no encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = ProductoController;