# Guía de Despliegue en Render

Este documento contiene las instrucciones para desplegar la aplicación E-Commerce en Render.

## Requisitos Previos

1. Cuenta en [Render](https://render.com)
2. Repositorio Git con el código (GitHub, GitLab, o Bitbucket)
3. Cuenta de Stripe (opcional, para pagos)

## Opción 1: Despliegue Automático con render.yaml

### Paso 1: Preparar el Repositorio

1. Asegúrate de que todos los cambios estén commiteados:
```bash
git add .
git commit -m "Preparar para despliegue en Render"
git push origin main
```

### Paso 2: Conectar con Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en "New +" → "Blueprint"
3. Conecta tu repositorio de GitHub/GitLab/Bitbucket
4. Render detectará automáticamente el archivo `render.yaml`
5. Click en "Apply"

### Paso 3: Configurar Variables de Entorno

Render creará automáticamente los servicios, pero necesitas configurar algunas variables:

#### Para el Backend (ecommerce-api):
- `NODE_ENV`: `production` (ya configurado)
- `PORT`: `3000` (ya configurado)
- `JWT_SECRET`: Se genera automáticamente
- `STRIPE_SECRET_KEY`: Agregar tu clave de Stripe (opcional)

#### Para el Frontend (ecommerce-frontend):
No requiere variables adicionales, usa las rutas relativas `/api`

### Paso 4: Esperar el Despliegue

Render construirá y desplegará ambos servicios automáticamente. Esto puede tomar 5-10 minutos.

---

## Opción 2: Despliegue Manual

### Backend (API)

1. En Render Dashboard, click "New +" → "Web Service"
2. Conecta tu repositorio
3. Configura:
   - **Name**: `ecommerce-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Branch**: `main`

4. Variables de entorno:
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=tu_secreto_jwt_super_seguro_aqui
   STRIPE_SECRET_KEY=sk_test_tu_clave_stripe
   ```

5. Click "Create Web Service"

### Frontend (Static Site)

1. En Render Dashboard, click "New +" → "Static Site"
2. Conecta tu repositorio
3. Configura:
   - **Name**: `ecommerce-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Branch**: `main`

4. Variables de entorno:
   ```
   VITE_API_URL=/api
   ```

5. En "Redirects/Rewrites", agrega:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`

6. Click "Create Static Site"

---

## Opción 3: Despliegue Todo-en-Uno (Backend sirve Frontend)

Esta es la opción más simple y económica.

1. En Render Dashboard, click "New +" → "Web Service"
2. Conecta tu repositorio
3. Configura:
   - **Name**: `ecommerce-fullstack`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Branch**: `main`

4. Variables de entorno:
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=tu_secreto_jwt_super_seguro_aqui
   STRIPE_SECRET_KEY=sk_test_tu_clave_stripe
   ```

5. Click "Create Web Service"

---

## Verificación del Despliegue

Una vez desplegado, verifica:

1. **Backend API**: Visita `https://tu-app.onrender.com/` - Deberías ver el mensaje JSON de bienvenida
2. **Frontend**: Visita `https://tu-app.onrender.com` - Deberías ver la página de login
3. **Endpoints API**: 
   - `https://tu-app.onrender.com/api/productos` - Lista de productos
   - `https://tu-app.onrender.com/api/auth/login` - Login

## Crear Usuario Administrador

Para crear un usuario administrador, necesitas hacerlo manualmente en la base de datos o crear un endpoint temporal.

### Opción 1: Usando el Shell de Render

1. Ve a tu servicio en Render Dashboard
2. Click en "Shell" en el menú lateral
3. Ejecuta:
```bash
node -e "
const db = require('./src/config/database');
const bcrypt = require('bcryptjs');
const password = bcrypt.hashSync('admin123', 10);
db.prepare('INSERT INTO usuarios (nombre, email, password, nivel) VALUES (?, ?, ?, ?)').run('Admin', 'admin@example.com', password, 'admin');
console.log('Usuario admin creado');
"
```

### Opción 2: Registrarse y actualizar manualmente

1. Regístrate normalmente en la aplicación
2. En el Shell de Render:
```bash
node -e "
const db = require('./src/config/database');
db.prepare('UPDATE usuarios SET nivel = ? WHERE email = ?').run('admin', 'tu@email.com');
console.log('Usuario actualizado a admin');
"
```

## Solución de Problemas

### Error: "Application failed to respond"
- Verifica que el `PORT` esté configurado correctamente
- Revisa los logs en Render Dashboard

### Error: "Module not found"
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que el build command sea correcto

### Base de datos se resetea
- Render usa almacenamiento efímero. Para persistencia, considera usar:
  - Render Disks (para SQLite)
  - PostgreSQL de Render (migrar de SQLite)

### CORS errors
- Verifica que `FRONTEND_URL` esté configurado correctamente
- En producción, el frontend y backend deben estar en el mismo dominio

## Comandos Útiles

### Ver logs en tiempo real
```bash
# En Render Dashboard → Tu servicio → Logs
```

### Reiniciar el servicio
```bash
# En Render Dashboard → Tu servicio → Manual Deploy → Clear build cache & deploy
```

### Acceder al Shell
```bash
# En Render Dashboard → Tu servicio → Shell
```

## Notas Importantes

1. **Plan Gratuito de Render**: Los servicios se duermen después de 15 minutos de inactividad. La primera petición puede tardar 30-60 segundos.

2. **Base de Datos**: SQLite funciona pero se resetea en cada deploy. Para producción real, considera migrar a PostgreSQL.

3. **Variables de Entorno**: Nunca subas archivos `.env` al repositorio. Usa las variables de entorno de Render.

4. **HTTPS**: Render proporciona HTTPS automáticamente.

5. **Dominio Personalizado**: Puedes agregar tu propio dominio en la configuración del servicio.

## Recursos Adicionales

- [Documentación de Render](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [Render Status](https://status.render.com/)
