const CarritoModel = require('../models/CarritoModel');
const ProductoModel = require('../models/ProductoModel');

class CarritoService {
  static getCarrito(usuarioId) {
    const items = CarritoModel.findByUsuarioId(usuarioId);
    const total = CarritoModel.getTotal(items);

    return {
      items,
      total: Math.round(total * 100) / 100
    };
  }

  static addItem(usuarioId, codigo, cantidad = 1) {
    const producto = ProductoModel.findByCodigo(codigo);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    const items = CarritoModel.addItem(usuarioId, codigo, cantidad);
    const total = CarritoModel.getTotal(items);

    return {
      mensaje: 'Producto agregado al carrito',
      items,
      total: Math.round(total * 100) / 100
    };
  }

  static vaciarCarrito(usuarioId) {
    const items = CarritoModel.deleteAllItems(usuarioId);
    return {
      mensaje: 'Carrito vaciado correctamente',
      items,
      total: 0
    };
  }
}

module.exports = CarritoService;