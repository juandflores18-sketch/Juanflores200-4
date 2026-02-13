# 📖 Guía: Configurar Redirects/Rewrites en Render

## ¿Por qué es necesario?

Tu aplicación React usa **React Router** para manejar rutas como:
- `/login`
- `/productos`
- `/carrito`
- `/admin/productos`

El problema es que estas rutas solo existen en el **frontend** (JavaScript), no son archivos reales en el servidor.

### ❌ Sin Redirects:
1. Usuario visita: `https://tu-app.onrender.com/productos`
2. Render busca el archivo: `productos.html`
3. No lo encuentra → **Error 404**

### ✅ Con Redirects:
1. Usuario visita: `https://tu-app.onrender.com/productos`
2. Render redirige a: `index.html`
3. React Router carga y muestra la página de productos → **Funciona!**

---

## 📋 Paso a Paso con Capturas

### Paso 1: Ir a la Configuración del Static Site

Después de crear tu Static Site en Render:

1. Ve a tu servicio en el Dashboard
2. Busca la sección **"Redirects/Rewrites"**
3. Está en la parte de abajo, puede que necesites hacer scroll

```
┌─────────────────────────────────────────┐
│  Settings                               │
├─────────────────────────────────────────┤
│  Name: ecommerce-frontend               │
│  Branch: main                           │
│  Build Command: ...                     │
│  Publish Directory: frontend/dist       │
│                                         │
│  ▼ Advanced                             │  ← Click aquí para expandir
│                                         │
│  Redirects/Rewrites                     │  ← Aquí está la sección
└─────────────────────────────────────────┘
```

---

### Paso 2: Expandir "Advanced"

Si no ves "Redirects/Rewrites", busca un botón o sección que diga **"Advanced"** y haz click para expandirlo.

---

### Paso 3: Agregar la Regla de Redirect

Verás un formulario con 3 campos:

```
┌─────────────────────────────────────────────────────────┐
│  Redirects/Rewrites                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Source:      [___________________]                     │
│               ↑ Escribe aquí: /*                        │
│                                                         │
│  Destination: [___________________]                     │
│               ↑ Escribe aquí: /index.html               │
│                                                         │
│  Action:      [▼ Rewrite        ]                       │
│               ↑ Selecciona: Rewrite                     │
│                                                         │
│  [+ Add Redirect/Rewrite]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Paso 4: Llenar los Campos

#### Campo 1: **Source**
```
/*
```
- El asterisco `*` significa "cualquier ruta"
- Esto captura todas las URLs como `/productos`, `/login`, `/carrito`, etc.

#### Campo 2: **Destination**
```
/index.html
```
- Todas las rutas se redirigen al archivo principal `index.html`
- Este archivo contiene tu aplicación React

#### Campo 3: **Action**
```
Rewrite
```
- Selecciona **"Rewrite"** del menú desplegable
- **NO** selecciones "Redirect" (eso cambiaría la URL en el navegador)

---

### Paso 5: Guardar

1. Click en el botón **"Add Redirect/Rewrite"** o **"Save"**
2. Render aplicará la configuración automáticamente

---

## 🎯 Ejemplo Visual Completo

```
┌──────────────────────────────────────────────────────────────┐
│  Redirects/Rewrites                                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Source:      /*                                        │ │
│  │ Destination: /index.html                               │ │
│  │ Action:      Rewrite                                   │ │
│  │                                                        │ │
│  │ [Remove]                                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [+ Add Redirect/Rewrite]                                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔍 Diferencia entre Redirect y Rewrite

### Redirect (❌ No usar)
```
Usuario visita: https://tu-app.com/productos
Navegador muestra: https://tu-app.com/index.html
```
- La URL cambia en el navegador
- El usuario ve que fue redirigido
- React Router no funciona correctamente

### Rewrite (✅ Usar este)
```
Usuario visita: https://tu-app.com/productos
Navegador muestra: https://tu-app.com/productos
Servidor sirve: index.html
```
- La URL NO cambia en el navegador
- El usuario no nota nada
- React Router funciona perfectamente

---

## 🧪 Cómo Probar que Funciona

Después de configurar:

1. Abre tu app: `https://tu-app.onrender.com`
2. Navega a productos
3. Copia la URL: `https://tu-app.onrender.com/productos`
4. Abre una nueva pestaña
5. Pega la URL y presiona Enter
6. ✅ Debería cargar la página de productos (no error 404)

---

## 🐛 Si No Encuentras la Sección

### Alternativa 1: Crear archivo `_redirects`

Si no encuentras la opción en la interfaz, crea un archivo en tu proyecto:

**Ubicación:** `frontend/public/_redirects`

**Contenido:**
```
/*    /index.html   200
```

Luego:
```bash
git add frontend/public/_redirects
git commit -m "Agregar redirects para SPA"
git push origin main
```

Render detectará este archivo automáticamente.

---

### Alternativa 2: Usar render.yaml

Si usas el archivo `render.yaml`, agrega:

```yaml
services:
  - type: web
    name: ecommerce-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

---

## 📝 Resumen

**Lo que necesitas hacer:**

1. ✅ Ir a tu Static Site en Render Dashboard
2. ✅ Buscar "Redirects/Rewrites" (puede estar en "Advanced")
3. ✅ Agregar:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
4. ✅ Guardar

**Resultado:**
- Todas las rutas de tu app funcionarán correctamente
- No más errores 404 al recargar la página
- React Router funcionará perfectamente

---

## ❓ Preguntas Frecuentes

### ¿Por qué `/*` y no `/`?
- `/` solo captura la raíz
- `/*` captura todas las rutas incluyendo subrutas

### ¿Puedo usar otro nombre en vez de index.html?
- No, debe ser `index.html` porque es el archivo principal que genera Vite

### ¿Esto afecta las rutas de la API?
- No, porque la API está en otro servicio (tu backend)
- Solo afecta las rutas del frontend

### ¿Necesito hacer esto si uso la opción Todo-en-Uno?
- No, el backend ya maneja esto automáticamente en el código

---

## 🎉 ¡Listo!

Con esta configuración, tu aplicación React funcionará perfectamente en Render, incluso cuando los usuarios accedan directamente a rutas específicas o recarguen la página.
