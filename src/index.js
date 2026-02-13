const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const carritoRoutes = require('./routes/carrito');
const pagosRoutes = require('./routes/pagos');
const { webhookStripe } = require('./routes/pagos');

// Inicializar base de datos
require('./config/database');

// Insertar productos de gimnasio iniciales
const { insertarProductos } = require('./data/productos-gym');
insertarProductos();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Webhook Stripe debe recibir body raw (antes de express.json())
app.post('/api/pagos/webhook-stripe', express.raw({ type: 'application/json' }), webhookStripe);

app.use(express.json());

// Servir archivos estáticos del frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
}

app.use(express.static(path.join(__dirname, '..', 'public')));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pagos', pagosRoutes);

// Ruta principal - API info solo si no es producción
app.get('/api', (req, res) => {
  res.json({
    mensaje: 'API E-Commerce - Programación III',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (registro, login)',
      productos: '/api/productos',
      carrito: '/api/carrito',
      pagos: '/api/pagos'
    }
  });
});

// Manejo de errores 404 para API
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Servir el frontend para todas las demás rutas en producción
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log('Endpoints disponibles:');
  console.log('  - POST /api/auth/registro');
  console.log('  - POST /api/auth/login');
  console.log('  - GET/POST/PUT/DELETE /api/productos');
  console.log('  - GET/POST/DELETE /api/carrito');
  console.log('  - POST /api/pagos/crear-sesion | POST /api/pagos/confirmar | GET /api/pagos/ordenes');
});
