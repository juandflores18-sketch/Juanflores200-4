# Comandos Rápidos para Desplegar en Render

## 🚀 Despliegue Rápido (Recomendado)

### 1. Preparar el código
```bash
git add .
git commit -m "Preparar para deploy en Render"
git push origin main
```

### 2. En Render Dashboard
1. Ir a https://dashboard.render.com/
2. Click en **"New +"** → **"Web Service"**
3. Conectar tu repositorio de GitHub
4. Configurar:

**Configuración del Servicio:**
```
Name: ecommerce-app
Environment: Node
Branch: main
Build Command: npm install && npm run build
Start Command: npm start
```

**Variables de Entorno (Environment Variables):**
```
NODE_ENV=production
JWT_SECRET=genera_un_secreto_aleatorio_aqui_123456789
PORT=3000
```

5. Click en **"Create Web Service"**
6. Esperar 5-10 minutos mientras se despliega

### 3. Verificar
- Tu app estará en: `https://tu-app-name.onrender.com`
- API: `https://tu-app-name.onrender.com/api/productos`

---

## 📋 Configuración Detallada

### Build Command
```bash
npm install && npm run build
```
Este comando:
1. Instala dependencias del backend
2. Entra a la carpeta frontend
3. Instala dependencias del frontend
4. Construye el frontend (crea la carpeta dist)

### Start Command
```bash
npm start
```
Este comando inicia el servidor Express que:
1. Sirve la API en `/api/*`
2. Sirve el frontend desde `/`

---

## 🔑 Variables de Entorno Importantes

### Obligatorias
```
NODE_ENV=production
PORT=3000
JWT_SECRET=tu_secreto_super_seguro_aqui
```

### Opcionales
```
STRIPE_SECRET_KEY=sk_test_tu_clave_stripe
FRONTEND_URL=https://tu-app.onrender.com
```

---

## 🛠️ Crear Usuario Administrador

Después del despliegue, necesitas crear un usuario admin:

### Opción 1: Desde el Shell de Render
1. En Render Dashboard → Tu servicio → **Shell**
2. Ejecutar:
```bash
node -e "const db=require('./src/config/database');const bcrypt=require('bcryptjs');const pwd=bcrypt.hashSync('admin123',10);db.prepare('INSERT INTO usuarios (nombre,email,password,nivel) VALUES (?,?,?,?)').run('Admin','admin@tuapp.com',pwd,'admin');console.log('Admin creado');"
```

### Opción 2: Registrarse y actualizar
1. Regístrate normalmente en la app
2. En el Shell de Render:
```bash
node -e "const db=require('./src/config/database');db.prepare('UPDATE usuarios SET nivel=? WHERE email=?').run('admin','tu@email.com');console.log('Usuario actualizado');"
```

---

## 🔄 Actualizar la Aplicación

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

Render detectará los cambios y redesplegará automáticamente.

---

## 🐛 Solución de Problemas Comunes

### La app no carga
- Revisa los **Logs** en Render Dashboard
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que el build se completó exitosamente

### Error 404 en rutas del frontend
- Verifica que el backend esté sirviendo el frontend correctamente
- Revisa que `frontend/dist` se haya creado durante el build

### La base de datos se resetea
- Esto es normal en el plan gratuito de Render
- Para persistencia, considera:
  - Usar Render Disks (plan de pago)
  - Migrar a PostgreSQL

### El servicio está "dormido"
- En el plan gratuito, los servicios se duermen después de 15 minutos
- La primera petición puede tardar 30-60 segundos en despertar

---

## 📊 Monitoreo

### Ver logs en tiempo real
1. Render Dashboard → Tu servicio → **Logs**

### Reiniciar el servicio
1. Render Dashboard → Tu servicio → **Manual Deploy**
2. Click en **"Clear build cache & deploy"**

---

## 💡 Tips

1. **Plan Gratuito**: Perfecto para desarrollo y demos
2. **HTTPS**: Incluido automáticamente
3. **Dominio**: Puedes usar tu propio dominio en Settings
4. **Backups**: Exporta tu base de datos regularmente si es importante

---

## 📚 Recursos

- [Documentación de Render](https://render.com/docs)
- [Guía completa de despliegue](./DEPLOY.md)
- [Soporte de Render](https://community.render.com/)
