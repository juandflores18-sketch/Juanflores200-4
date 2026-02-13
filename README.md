# E-Commerce API - Programación III

API RESTful para un sistema de e-commerce con autenticación, gestión de productos, carrito de compras y pagos.

## Estructura del Proyecto

```
📁 src/
├── 📁 config/
│   └── database.js          # Configuración de la base de datos SQLite
├── 📁 controllers/          # Controladores para manejar solicitudes HTTP
│   ├── AuthController.js
│   ├── ProductoController.js
│   ├── CarritoController.js
│   └── PagosController.js
├── 📁 middleware/           # Middleware para autenticación
│   └── auth.js
├── 📁 models/               # Modelos de datos (interacción con la DB)
│   ├── UsuarioModel.js
│   ├── ProductoModel.js
│   ├── CarritoModel.js
│   └── OrdenModel.js
├── 📁 routes/               # Rutas de la API
│   ├── auth.js
│   ├── productos.js
│   ├── carrito.js
│   └── pagos.js
├── 📁 services/             # Lógica de negocio
│   ├── AuthService.js
│   ├── ProductoService.js
│   ├── CarritoService.js
│   └── PagosService.js
└── index.js                 # Archivo principal del servidor
```

## Stack Tecnológico

- **Backend**: Node.js + Express.js
- **Base de Datos**: SQLite con better-sqlite3
- **Autenticación**: JWT + bcryptjs
- **Pagos**: Stripe + PayPal Sandbox
- **Validación**: express-validator

## Instalación

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Iniciar el servidor: `node src/index.js`
4. El servidor correrá en `http://localhost:3000`

## Endpoints

### Autenticación

- `POST /api/auth/registro` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/perfil` - Obtener perfil (protegido)

### Productos (protegidos)

- `GET /api/productos` - Ver todos los productos
- `GET /api/productos/:codigo` - Ver producto por código
- `POST /api/productos` - Crear producto (solo admin)
- `PUT /api/productos/:codigo` - Actualizar producto (solo admin)
- `DELETE /api/productos/:codigo` - Eliminar producto (solo admin)

### Carrito (protegidos)

- `GET /api/carrito` - Ver carrito con total
- `POST /api/carrito` - Agregar producto al carrito
- `DELETE /api/carrito` - Vaciar carrito

### Pagos (protegidos)

- `POST /api/pagos/crear-sesion` - Crear sesión de pago Stripe
- `POST /api/pagos/confirmar` - Confirmar orden manual
- `GET /api/pagos/ordenes` - Historial de compras
- `POST /api/pagos/crear-orden-paypal` - Crear orden PayPal
- `POST /api/pagos/capturar-paypal` - Capturar pago PayPal

## Variables de Entorno

```env
STRIPE_SECRET_KEY=tu_clave_secreta
STRIPE_WEBHOOK_SECRET=tu_secret_webhook
PAYPAL_CLIENT_ID=tu_client_id
PAYPAL_CLIENT_SECRET=tu_client_secret
FRONTEND_URL=http://localhost:3000
```

## Pruebas

Ejecutar script de prueba: `node test-api.js`

## Frontend

El frontend se encuentra en la carpeta `frontend/` y está construido con React + Vite.

## Arquitectura MVC

El proyecto sigue la arquitectura MVC:

- **Models**: Encapsulan la interacción con la base de datos
- **Services**: Contienen la lógica de negocio
- **Controllers**: Manejan las solicitudes HTTP y respuestas
- **Routes**: Definen las rutas de la API