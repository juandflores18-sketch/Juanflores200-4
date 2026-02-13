# ✅ Checklist de Despliegue en Render

## Antes de Desplegar

- [ ] Todos los cambios están commiteados en Git
- [ ] El código está en GitHub/GitLab/Bitbucket
- [ ] Tienes una cuenta en Render.com
- [ ] Has probado la aplicación localmente

## Archivos Necesarios (Ya Creados)

- [x] `render.yaml` - Configuración automática de Render
- [x] `.env.example` - Ejemplo de variables de entorno
- [x] `frontend/.env.production` - Variables del frontend para producción
- [x] `frontend/.env.development` - Variables del frontend para desarrollo
- [x] `frontend/src/config/api.js` - Configuración de API
- [x] `package.json` - Con script de build
- [x] `.gitignore` - Archivos a ignorar
- [x] `DEPLOY.md` - Guía completa de despliegue
- [x] `COMANDOS-RENDER.md` - Comandos rápidos

## Pasos de Despliegue

### 1. Preparar Repositorio
```bash
git add .
git commit -m "Preparar para deploy en Render"
git push origin main
```
- [ ] Código subido a GitHub

### 2. Crear Servicio en Render
- [ ] Ir a https://dashboard.render.com/
- [ ] Click en "New +" → "Web Service"
- [ ] Conectar repositorio
- [ ] Configurar nombre: `ecommerce-app`
- [ ] Environment: `Node`
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`

### 3. Configurar Variables de Entorno
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000`
- [ ] `JWT_SECRET` = (generar uno seguro)
- [ ] `STRIPE_SECRET_KEY` = (opcional, tu clave de Stripe)

### 4. Desplegar
- [ ] Click en "Create Web Service"
- [ ] Esperar que el build termine (5-10 minutos)
- [ ] Verificar que no haya errores en los logs

### 5. Verificar Funcionamiento
- [ ] Abrir la URL de tu app: `https://tu-app.onrender.com`
- [ ] Verificar que carga la página de login
- [ ] Probar registro de usuario
- [ ] Probar login
- [ ] Verificar que se ven los productos
- [ ] Probar agregar al carrito

### 6. Crear Usuario Administrador
- [ ] Ir a Shell en Render Dashboard
- [ ] Ejecutar comando para crear admin (ver COMANDOS-RENDER.md)
- [ ] Verificar login como admin
- [ ] Probar panel de administración

## Post-Despliegue

### Configuración Adicional (Opcional)
- [ ] Configurar dominio personalizado
- [ ] Configurar Stripe para pagos reales
- [ ] Configurar backups de base de datos
- [ ] Configurar notificaciones de deploy

### Documentación
- [ ] Anotar la URL de la aplicación
- [ ] Guardar credenciales de admin
- [ ] Documentar variables de entorno usadas

## URLs Importantes

- **Dashboard de Render**: https://dashboard.render.com/
- **Tu Aplicación**: https://[tu-app-name].onrender.com
- **API**: https://[tu-app-name].onrender.com/api
- **Logs**: Dashboard → Tu servicio → Logs
- **Shell**: Dashboard → Tu servicio → Shell

## Comandos Útiles

### Ver logs
```
Dashboard → Tu servicio → Logs
```

### Reiniciar servicio
```
Dashboard → Tu servicio → Manual Deploy → Clear build cache & deploy
```

### Crear admin
```bash
node -e "const db=require('./src/config/database');const bcrypt=require('bcryptjs');const pwd=bcrypt.hashSync('admin123',10);db.prepare('INSERT INTO usuarios (nombre,email,password,nivel) VALUES (?,?,?,?)').run('Admin','admin@tuapp.com',pwd,'admin');console.log('Admin creado');"
```

## Solución de Problemas

### ❌ Build falla
- Revisar logs de build
- Verificar que todas las dependencias estén en package.json
- Verificar que el comando de build sea correcto

### ❌ App no carga
- Verificar que el servicio esté "running" (verde)
- Revisar logs de runtime
- Verificar variables de entorno

### ❌ Error 404 en rutas
- Verificar que el frontend se haya construido (carpeta dist)
- Verificar que el backend esté sirviendo archivos estáticos

### ❌ CORS errors
- Verificar configuración de CORS en backend
- Verificar que frontend use rutas relativas (/api)

## Notas Importantes

⚠️ **Plan Gratuito**: Los servicios se duermen después de 15 minutos de inactividad

⚠️ **Base de Datos**: SQLite se resetea en cada deploy. Para producción considera PostgreSQL

⚠️ **Primera Carga**: Puede tardar 30-60 segundos si el servicio estaba dormido

✅ **HTTPS**: Incluido automáticamente

✅ **Auto-Deploy**: Se redespliega automáticamente con cada push a main

## Recursos

- 📖 [Guía Completa](./DEPLOY.md)
- 🚀 [Comandos Rápidos](./COMANDOS-RENDER.md)
- 🌐 [Documentación Render](https://render.com/docs)
- 💬 [Comunidad Render](https://community.render.com/)
