const ProductoModel = require('../models/ProductoModel');

class ProductoService {
  static getAll() {
    return ProductoModel.findAll();
  }

  static getByCodigo(codigo) {
    const producto = ProductoModel.findByCodigo(codigo);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  }

  static create(nombre, codigo, precio, descripcion, imagen) {
    const existente = ProductoModel.findByCodigo(codigo);
    if (existente) {
      throw new Error('Ya existe un producto con ese código');
    }

    return ProductoModel.create(nombre, codigo, precio, descripcion, imagen);
  }

  static update(codigo, nuevosValores) {
    const producto = ProductoModel.findByCodigo(codigo);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    return ProductoModel.update(codigo, nuevosValores);
  }

  static delete(codigo) {
    const resultado = ProductoModel.delete(codigo);
    if (resultado.changes === 0) {
      throw new Error('Producto no encontrado');
    }
  }
}

module.exports = ProductoService;