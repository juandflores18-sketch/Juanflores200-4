const db = require('../config/database');

const productosGym = [
  {
    nombre: 'Mancuernas de Goma',
    codigo: 'MNG-001',
    precio: 29.99,
    descripcion: 'Mancuernas de goma antideslizantes, ideal para ejercicios de fuerza.',
    imagen: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&h=500&fit=crop'
  },
  {
    nombre: 'Colchoneta de Yoga',
    codigo: 'YGA-002',
    precio: 39.99,
    descripcion: 'Colchoneta de yoga premium de 183cm x 61cm, con 6mm de espesor.',
    imagen: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop'
  },
  {
    nombre: 'Banda Elástica',
    codigo: 'BND-003',
    precio: 19.99,
    descripcion: 'Banda elástica resistente para ejercicios de tonificación.',
    imagen: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&h=500&fit=crop'
  },
  {
    nombre: 'Barra Olímpica',
    codigo: 'BRR-004',
    precio: 129.99,
    descripcion: 'Barra olímpica de 2.2m, capacidad de carga 300kg.',
    imagen: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop'
  },
  {
    nombre: 'Placa de Pesos',
    codigo: 'PLT-005',
    precio: 49.99,
    descripcion: 'Placa de pesos de 10kg, material de goma eva.',
    imagen: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=500&fit=crop'
  },
  {
    nombre: 'Soga de Saltar',
    codigo: 'RPE-006',
    precio: 14.99,
    descripcion: 'Soga de saltar profesional para entrenamiento cardio.',
    imagen: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=500&h=500&fit=crop'
  },
  {
    nombre: 'Bench de Pesos',
    codigo: 'BNC-007',
    precio: 199.99,
    descripcion: 'Bench de pesas ajustable para ejercicios de pecho y espalda.',
    imagen: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500&h=500&fit=crop'
  },
  {
    nombre: 'Cinta de Correr',
    codigo: 'TRD-008',
    precio: 599.99,
    descripcion: 'Cinta de correr con pantalla LCD y múltiples programas de entrenamiento.',
    imagen: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=500&h=500&fit=crop'
  },
  {
    nombre: 'Máquina de Pesos',
    codigo: 'WRK-009',
    precio: 899.99,
    descripcion: 'Máquina de ejercicios multifuncional para todo el cuerpo.',
    imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=500&fit=crop'
  },
  {
    nombre: 'Protector de Rodillas',
    codigo: 'KNP-010',
    precio: 24.99,
    descripcion: 'Protector de rodillas con soporte de neopreno, ideal para crossfit.',
    imagen: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=500&h=500&fit=crop'
  }
];

// Insertar productos en la base de datos
function insertarProductos() {
  const statement = db.prepare(`
    INSERT OR IGNORE INTO productos (nombre, codigo, precio, descripcion, imagen)
    VALUES (?, ?, ?, ?, ?)
  `);

  productosGym.forEach(producto => {
    statement.run(producto.nombre, producto.codigo, producto.precio, producto.descripcion, producto.imagen);
  });

  console.log(`${productosGym.length} productos de gimnasio insertados correctamente`);
}

module.exports = {
  productosGym,
  insertarProductos
};