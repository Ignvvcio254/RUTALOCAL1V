# ▲ Guía de Despliegue en Vercel - Frontend Next.js

Esta guía te ayudará a desplegar tu frontend Next.js en Vercel y conectarlo con tu backend en Railway.

## 📋 Pre-requisitos

- Cuenta en [Vercel](https://vercel.com/)
- Backend desplegado en Railway (URL disponible)
- GitHub Desktop o Git instalado
- Código del frontend subido a GitHub

---

## 🚀 Paso 1: Preparar el Proyecto

### 1.1 Actualizar `.env.production`

Ya tienes el archivo `.env.production` configurado. Ahora necesitas actualizarlo con la URL real de Railway:

1. Abre el archivo `.env.production`
2. Reemplaza `https://tu-proyecto-backend.up.railway.app` con tu URL real de Railway
3. Ejemplo:
   ```bash
   NEXT_PUBLIC_API_URL=https://santiago-backend-production.up.railway.app
   ```

### 1.2 Verificar archivo `.gitignore`

Asegúrate de que tu `.gitignore` incluya:

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

**IMPORTANTE:** `.env.production` **SÍ** debe subirse a Git para que Vercel lo use.

---

## 🎯 Paso 2: Subir a GitHub

1. Abre **GitHub Desktop**
2. Selecciona tu repositorio del frontend (`RUTALOCAL1V`)
3. Verifica que `.env.production` esté en los cambios
4. Asegúrate de que `.env.local` **NO** esté (debe estar en .gitignore)
5. Haz commit con mensaje: "Configure production environment for Vercel deployment"
6. Push al repositorio remoto

---

## ▲ Paso 3: Crear Proyecto en Vercel

### 3.1 Iniciar sesión en Vercel

1. Ve a [vercel.com](https://vercel.com/)
2. Inicia sesión con GitHub
3. Click en **"Add New..."** → **"Project"**

### 3.2 Importar repositorio

1. Busca tu repositorio `RUTALOCAL1V`
2. Click en **"Import"**

### 3.3 Configurar proyecto

Vercel detectará automáticamente que es un proyecto Next.js:

- **Framework Preset:** Next.js
- **Root Directory:** `./` (raíz del proyecto)
- **Build Command:** `npm run build` (automático)
- **Output Directory:** `.next` (automático)
- **Install Command:** `npm install` (automático)

---

## 🔧 Paso 4: Configurar Variables de Entorno

### 4.1 Agregar variables de entorno

En la sección **"Environment Variables"**, agrega las siguientes:

#### **Variables obligatorias:**

| Variable | Value | Ejemplo |
|----------|-------|---------|
| `NEXT_PUBLIC_API_URL` | URL de tu backend en Railway | `https://santiago-backend.up.railway.app` |
| `NEXT_PUBLIC_API_BASE_PATH` | `/api` | `/api` |
| `NEXT_PUBLIC_DEV_MODE` | `false` | `false` |
| `NEXT_PUBLIC_APP_URL` | URL de tu app en Vercel | `https://rutalocal1v.vercel.app` |
| `NEXT_PUBLIC_JWT_SECRET` | La misma que en Railway | (clave segura) |

#### **Variables opcionales (según tu proyecto):**

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Tu token de Mapbox |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Tu Google Client ID |
| `GOOGLE_CLIENT_SECRET` | Tu Google Client Secret |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Tu Google Maps API Key |
| `NEXT_PUBLIC_SENTRY_DSN` | Tu Sentry DSN |

### 4.2 Copiar desde `.env.production`

**Tip:** Puedes copiar las variables desde tu archivo `.env.production` y pegarlas en Vercel.

1. En Vercel, click en **"Environment Variables"**
2. Para cada variable, haz click en **"Add Another"**
3. Pega el nombre y valor de la variable

### 4.3 Variables para todos los entornos

Asegúrate de seleccionar:
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 🚀 Paso 5: Deploy

1. Verifica que todas las variables de entorno estén configuradas
2. Click en **"Deploy"**
3. Vercel comenzará a construir y desplegar tu aplicación

### 5.1 Proceso de Deploy

Vercel hará lo siguiente:
1. ✓ Clonar el repositorio
2. ✓ Instalar dependencias (`npm install`)
3. ✓ Construir la aplicación (`npm run build`)
4. ✓ Optimizar y desplegar

### 5.2 Obtener URL

Una vez desplegado, Vercel te dará URLs como:
- **Production:** `https://rutalocal1v.vercel.app`
- **Preview:** `https://rutalocal1v-git-branch.vercel.app`

---

## 🔄 Paso 6: Actualizar Backend (Railway)

Ahora que tienes tu URL de Vercel, necesitas actualizar el backend:

1. Ve a Railway
2. Selecciona tu proyecto Django
3. Ve a **"Variables"**
4. Actualiza estas variables:

```bash
CORS_ALLOWED_ORIGINS=https://rutalocal1v.vercel.app
FRONTEND_URL=https://rutalocal1v.vercel.app
```

5. Si usas Google OAuth, actualiza también:
```bash
GOOGLE_REDIRECT_URI=https://rutalocal1v.vercel.app/auth/google/callback
```

6. Railway redesplegará automáticamente con los nuevos valores

---

## 🔐 Paso 7: Configurar Google OAuth (Opcional)

Si usas Google OAuth:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a **Credentials**
4. Edita tu **OAuth 2.0 Client ID**
5. En **Authorized JavaScript origins**, agrega:
   ```
   https://rutalocal1v.vercel.app
   ```
6. En **Authorized redirect URIs**, agrega:
   ```
   https://rutalocal1v.vercel.app/auth/google/callback
   ```
7. Guarda los cambios

---

## ✅ Paso 8: Verificar Deployment

### 8.1 Probar la aplicación

1. Abre tu navegador
2. Ve a tu URL de Vercel: `https://rutalocal1v.vercel.app`
3. Verifica que la aplicación cargue correctamente

### 8.2 Probar conexión con backend

1. Intenta hacer login o cualquier acción que requiera el backend
2. Abre las **DevTools** del navegador (F12)
3. Ve a la pestaña **Network**
4. Verifica que las peticiones al backend sean exitosas

### 8.3 Ver Logs

Si hay errores:
1. En Vercel, ve a tu proyecto
2. Click en **"Deployments"**
3. Selecciona el último deployment
4. Click en **"View Function Logs"** o **"View Build Logs"**

---

## 🔧 Paso 9: Configurar Dominio Personalizado (Opcional)

### 9.1 Agregar dominio

1. En Vercel, ve a tu proyecto
2. Ve a **"Settings"** → **"Domains"**
3. Click en **"Add"**
4. Ingresa tu dominio (ejemplo: `www.miapp.com`)
5. Sigue las instrucciones de Vercel para configurar DNS

### 9.2 Actualizar variables

Si agregaste un dominio personalizado, actualiza:

**En Vercel:**
```bash
NEXT_PUBLIC_APP_URL=https://www.miapp.com
```

**En Railway:**
```bash
CORS_ALLOWED_ORIGINS=https://www.miapp.com,https://rutalocal1v.vercel.app
FRONTEND_URL=https://www.miapp.com
```

**En Google OAuth:**
- Agrega `https://www.miapp.com` a los orígenes autorizados
- Agrega `https://www.miapp.com/auth/google/callback` a las URIs de redireccionamiento

---

## 🔄 Paso 10: Deploy Automático (CI/CD)

Por defecto, Vercel ya está configurado para deploy automático:

- **Push a `main`:** Deploy a Production
- **Pull Request:** Deploy a Preview
- **Push a otra rama:** Deploy a Preview

### 10.1 Deshabilitar deploy automático (opcional)

Si prefieres despliegues manuales:
1. Ve a **"Settings"** → **"Git"**
2. Deshabilita **"Production Branch"** o **"Preview Branches"**

---

## 🚨 Troubleshooting

### Error: "Failed to compile"

**Solución:**
- Verifica los logs de build en Vercel
- Asegúrate de que `npm run build` funcione localmente
- Verifica que todas las dependencias estén en `package.json`

### Error: "API connection failed" o CORS

**Solución:**
- Verifica que `NEXT_PUBLIC_API_URL` esté correctamente configurado en Vercel
- Verifica que `CORS_ALLOWED_ORIGINS` en Railway incluya tu dominio de Vercel
- Asegúrate de que el backend esté corriendo en Railway

### Error: "Environment variable not found"

**Solución:**
- Ve a **"Settings"** → **"Environment Variables"** en Vercel
- Verifica que todas las variables necesarias estén configuradas
- Redespliega después de agregar variables

### Cambios no se reflejan

**Solución:**
- Verifica que los cambios estén en la rama `main` en GitHub
- Ve a **"Deployments"** en Vercel para ver el estado
- Puedes hacer **"Redeploy"** manualmente desde Vercel

---

## 📝 Checklist Final

Antes de considerar el deployment completo, verifica:

- ✅ Backend desplegado en Railway y funcionando
- ✅ Frontend desplegado en Vercel y funcionando
- ✅ `NEXT_PUBLIC_API_URL` apunta a Railway
- ✅ `CORS_ALLOWED_ORIGINS` en Railway incluye Vercel
- ✅ Google OAuth configurado (si aplica)
- ✅ Dominio personalizado configurado (si aplica)
- ✅ Todas las variables de entorno configuradas
- ✅ Login/autenticación funciona
- ✅ API requests funcionan correctamente

---

## 🔗 Enlaces Útiles

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)

---

## 🎉 ¡Listo!

Tu aplicación completa ahora está desplegada:
- **Frontend:** Vercel ▲
- **Backend:** Railway 🚂

**URLs:**
- Frontend: `https://rutalocal1v.vercel.app`
- Backend: `https://tu-backend.up.railway.app`

---

## 💡 Próximos Pasos

1. **Monitoreo:** Configura Sentry para rastrear errores
2. **Analytics:** Vercel Analytics ya está incluido
3. **Performance:** Usa Vercel Speed Insights
4. **SEO:** Configura meta tags y sitemap
5. **Testing:** Prueba todas las funcionalidades en producción

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel y Railway
2. Verifica las variables de entorno
3. Prueba la conexión entre frontend y backend
4. Revisa la documentación oficial de Vercel
