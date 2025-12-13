# 🔐 Google Auth con Supabase - Frontend Implementation

## ✅ Cambios Implementados

### 1. Instalación de Supabase
```bash
npm install @supabase/supabase-js
```

### 2. Archivos Creados/Modificados

#### ✨ Nuevos Archivos:
- **`lib/supabase/client.ts`** - Cliente de Supabase inicializado
- **`app/auth/callback/page.tsx`** - Página de callback con logs extensivos

#### 📝 Archivos Modificados:
- **`lib/auth/oauth.service.ts`** - Ahora usa Supabase en lugar de mock
- **`app/login/page.tsx`** - Logs de debug añadidos al botón de Google

---

## 🔄 Flujo de Autenticación

```
Usuario click "Google" → OAuthService.loginWithGoogle()
           ↓
Supabase Auth inicia OAuth → Redirige a Google
           ↓
Usuario autoriza en Google → Google redirige a /auth/callback
           ↓
Callback obtiene session de Supabase → Extrae access_token
           ↓
POST /api/auth/google al backend → Backend valida con SUPABASE_JWT_SECRET
           ↓
Backend crea/actualiza usuario → Devuelve tokens JWT propios
           ↓
Frontend guarda tokens → Redirige a home o onboarding
```

---

## 📋 Variables de Entorno Necesarias

### En Vercel (Ya configuradas ✅):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://hdshccvnvizoaumqpepq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=https://web-production-f3cae.up.railway.app
NEXT_PUBLIC_DEV_MODE=false
```

### En Railway Backend (Pendiente ⚠️):
```bash
SUPABASE_URL=https://[tu-proyecto-id].supabase.co
SUPABASE_JWT_SECRET=tu_jwt_secret_de_supabase
GOOGLE_CLIENT_ID=[tu-client-id].apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-[tu-secret]
```

---

## 🐛 Debug Logs

El sistema ahora incluye logs extensivos en la consola del navegador:

### Durante el Login:
```
🚀 [Login Page] Click en botón Google Auth
🔧 [Login Page] Importando OAuthService...
🔐 [Login Page] Llamando a OAuthService.loginWithGoogle()...
🚀 [OAuth] Iniciando login con Google...
🔍 [OAuth] DEV_MODE: false
🔍 [OAuth] NEXT_PUBLIC_SUPABASE_URL: ✅ Configurado
🔍 [OAuth] NEXT_PUBLIC_SUPABASE_ANON_KEY: ✅ Configurado
🔐 [OAuth] Iniciando flujo OAuth con Supabase...
✅ [OAuth] Redirección a Google iniciada correctamente
```

### Durante el Callback:
```
🔄 [Callback] Iniciando proceso de callback...
📍 [Callback] URL actual: http://localhost:3000/auth/callback?code=...
📡 [Callback] Obteniendo sesión de Supabase...
✅ [Callback] Sesión obtenida correctamente
👤 [Callback] Usuario: usuario@gmail.com
🔑 [Callback] Access token recibido
🌐 [Callback] Enviando token al backend
✅ [Callback] Respuesta del backend exitosa
💾 [Callback] Guardando tokens en localStorage...
➡️ [Callback] Redirigiendo a home...
```

### En Caso de Error:
La página de callback mostrará todos los logs y el error específico antes de redirigir al login.

---

## 🧪 Testing

### Desarrollo Local:
```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
npm run dev
```

1. Ve a http://localhost:3000/login
2. Abre la consola del navegador (F12)
3. Click en "Continuar con Google"
4. Observa los logs en la consola
5. Verifica que redirija correctamente

### Producción (Vercel):
1. Asegúrate de que `NEXT_PUBLIC_DEV_MODE=false` en Vercel
2. Agrega las variables de Supabase en Railway
3. Haz push y espera el deploy
4. Prueba en https://rutago-nine.vercel.app/login

---

## ⚠️ Importante

### Modo Desarrollo vs Producción

**Desarrollo (`NEXT_PUBLIC_DEV_MODE=true`):**
- Usa login mock (no Supabase)
- No redirige a Google
- Útil para desarrollo sin internet

**Producción (`NEXT_PUBLIC_DEV_MODE=false`):**
- Usa Supabase Auth real
- Redirige a Google OAuth
- Requiere todas las variables configuradas

---

## 🔧 Troubleshooting

### "Missing Supabase environment variables"
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén configuradas

### "Error al iniciar sesión con Supabase"
- Verifica que Google Auth esté habilitado en Supabase Dashboard
- Verifica que las credenciales de Google sean correctas

### "Token de Supabase inválido o expirado" (Backend)
- Verifica que `SUPABASE_JWT_SECRET` esté configurado en Railway
- Verifica que coincida con el JWT Secret de Supabase

### "CORS error"
- Verifica que el dominio del frontend esté en `CORS_ALLOWED_ORIGINS` del backend

---

## 📝 Próximos Pasos

1. ✅ Frontend implementado con Supabase
2. ⚠️ Agregar variables de entorno en Railway
3. ⚠️ Hacer push del frontend a producción
4. ⚠️ Probar el flujo completo
5. ⚠️ Agregar más usuarios de prueba en Google Cloud Console si es necesario

---

**Fecha**: 13 de Diciembre de 2025
**Status**: ✅ Listo para deployment
