# 🚀 Desplegar Frontend en Render

## Tu Backend ya está en: https://juanflores200-4.onrender.com/

---

## Opción 1: Frontend como Static Site (Recomendado - Más Rápido)

### Paso 1: Subir cambios a GitHub
```bash
git add .
git commit -m "Configurar frontend para Render"
git push origin main
```

### Paso 2: Crear Static Site en Render

1. Ve a https://dashboard.render.com/
2. Click en **"New +"** → **"Static Site"**
3. Conecta tu repositorio de GitHub
4. Configura:

```
Name: ecommerce-frontend
Branch: main
Build Command: cd frontend && npm install && npm run build
Publish Directory: frontend/dist
```

5. En **"Environment Variables"** agrega:
```
VITE_API_URL=https://juanflores200-4.onrender.com/api
```

6. En **"Redirects/Rewrites"** (abajo en Advanced), agrega:
```
Source: /*
Destination: /index.html
Action: Rewrite
```

7. Click en **"Create Static Site"**

### Paso 3: Esperar
- El build tomará 3-5 minutos
- Tu frontend estará en: `https://ecommerce-frontend-[random].onrender.com`

---

## Opción 2: Todo-en-Uno (Backend sirve Frontend)

Si prefieres tener todo en un solo servicio:

### Paso 1: Actualizar el backend existente

1. Ve a tu servicio backend en Render: https://dashboard.render.com/
2. Click en tu servicio **"juanflores200-4"**
3. Ve a **"Settings"**
4. En **"Build Command"** cambia a:
```
npm install && npm run build
```

5. Asegúrate de que **"Start Command"** sea:
```
npm start
```

6. En **"Environment Variables"** agrega (si no está):
```
NODE_ENV=production
```

7. Click en **"Save Changes"**

### Paso 2: Subir cambios y redesplegar
```bash
git add .
git commit -m "Configurar fullstack para Render"
git push origin main
```

Render redesplegará automáticamente y tu app completa estará en:
**https://juanflores200-4.onrender.com/**

---

## Opción 3: Despliegue Manual del Frontend

Si prefieres construir localmente:

### Paso 1: Build local
```bash
cd frontend
npm install
npm run build
```

### Paso 2: Subir a Render
1. Crea un nuevo repositorio solo con la carpeta `dist`
2. Despliega como Static Site apuntando a ese repositorio

---

## ✅ Verificación

Después del despliegue, verifica:

### Si usaste Opción 1 (Static Site):
- Frontend: `https://tu-frontend.onrender.com`
- Backend: `https://juanflores200-4.onrender.com/api`

### Si usaste Opción 2 (Todo-en-Uno):
- Todo: `https://juanflores200-4.onrender.com`
- API: `https://juanflores200-4.onrender.com/api`

### Pruebas:
1. Abre tu frontend
2. Deberías ver la página de login
3. Registra un usuario
4. Verifica que se vean los productos
5. Prueba agregar al carrito

---

## 🔑 Crear Usuario Administrador

Una vez desplegado, crea un admin:

1. Ve a tu servicio backend en Render Dashboard
2. Click en **"Shell"** (menú lateral)
3. Ejecuta:

```bash
node -e "const db=require('./src/config/database');const bcrypt=require('bcryptjs');const pwd=bcrypt.hashSync('admin123',10);db.prepare('INSERT INTO usuarios (nombre,email,password,nivel) VALUES (?,?,?,?)').run('Admin','admin@tuapp.com',pwd,'admin');console.log('✅ Admin creado: admin@tuapp.com / admin123');"
```

Credenciales del admin:
- Email: `admin@tuapp.com`
- Password: `admin123`

---

## 🐛 Solución de Problemas

### Error: "Failed to fetch"
- Verifica que el backend esté corriendo
- Revisa la consola del navegador (F12)
- Verifica que `VITE_API_URL` esté configurado correctamente

### Error: CORS
- Ve a tu backend en Render
- Agrega variable de entorno:
```
FRONTEND_URL=https://tu-frontend.onrender.com
```
- Redesplega el backend

### El frontend no carga
- Verifica que el build se completó exitosamente
- Revisa los logs en Render Dashboard
- Verifica que `frontend/dist` se haya creado

---

## 📊 URLs Finales

Anota tus URLs aquí:

- **Backend API**: https://juanflores200-4.onrender.com
- **Frontend**: ___________________________
- **Admin Email**: admin@tuapp.com
- **Admin Password**: admin123

---

## 🔄 Actualizar en el Futuro

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Render redesplegará automáticamente ambos servicios.

---

## 💡 Recomendación

**Usa la Opción 2 (Todo-en-Uno)** porque:
- ✅ Más simple de mantener
- ✅ Un solo servicio = más barato
- ✅ No hay problemas de CORS
- ✅ Una sola URL para todo

Solo necesitas actualizar el Build Command de tu backend existente y listo!
