# Fix: Error al hacer login con Google en Vercel

## Problema

Al intentar hacer login con Google en el deployment de Vercel (producción), aparece un modal rojo con error.

## Causa

La variable de entorno `NEXT_PUBLIC_DEV_MODE=true` **NO está configurada** en Vercel, por lo que el sistema intenta hacer autenticación real en lugar de usar el modo mock de desarrollo.

## Solución Inmediata

### Paso 1: Verificar Variables de Entorno en Vercel

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto `RUTALOCAL1V`
3. Ve a **Settings** → **Environment Variables**
4. Verifica si existe la variable `NEXT_PUBLIC_DEV_MODE`

### Paso 2: Agregar la Variable Crítica

Si no existe o está en `false`, agrégala:

```
Name: NEXT_PUBLIC_DEV_MODE
Value: true
Environments: ✅ Production ✅ Preview ✅ Development
```

**IMPORTANTE**: Esta es LA variable más importante. Sin ella, el login con Google no funcionará.

### Paso 3: Redeploy

Después de agregar/actualizar la variable:

**Opción A: Automático**
- Haz cualquier push a GitHub y Vercel redeployará automáticamente

**Opción B: Manual**
1. Ve a **Deployments** en Vercel
2. Click en los 3 puntos del último deployment
3. Click en **Redeploy**
4. Selecciona **Use existing Build Cache** (más rápido)

### Paso 4: Verificar que Funcionó

1. Abre tu app en Vercel: `https://rutalocal1v.vercel.app`
2. Abre la consola del navegador (F12)
3. Click en "Continuar con Google"
4. Deberías ver en la consola:
   ```
   🔧 [AuthService] Modo desarrollo - Login mock
   ✅ [AuthService] Credenciales aceptadas
   ```
5. Deberías ser redirigido al home sin errores

## Diagnóstico del Error

### Si ves el modal rojo, probablemente dice:

- "Error al iniciar sesión"
- "No se pudo conectar con Google"
- "Credenciales inválidas"

### Esto sucede porque:

1. `NEXT_PUBLIC_DEV_MODE` no está en `true`
2. El sistema intenta hacer login real
3. No hay backend Django configurado
4. La llamada falla y muestra el error

## Variables de Entorno Completas para Vercel

Para evitar cualquier problema, asegúrate de tener TODAS estas variables:

```env
# CRÍTICA - Modo desarrollo
NEXT_PUBLIC_DEV_MODE=true

# API (mock, no se usa en dev mode pero debe existir)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_PATH=/api

# Mapbox (para mapas)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoibmFjaG8yNTQiLCJhIjoiY21pdGxyZjhnMHRlYjNnb243bnA1OG81ayJ9.BPTKLir4w184eLNzsao9XQ

# Storage (localStorage keys)
NEXT_PUBLIC_STORAGE_KEY=santiago_user
NEXT_PUBLIC_TOKEN_KEY=santiago_token

# JWT (mock tokens)
NEXT_PUBLIC_JWT_SECRET=dev-secret-key-change-in-production
NEXT_PUBLIC_JWT_EXPIRATION=7d

# App URL (ajustar a tu dominio de Vercel)
NEXT_PUBLIC_APP_URL=https://rutalocal1v.vercel.app
```

## Verificación en Tiempo Real

Para confirmar que las variables están correctas en producción:

1. Abre la consola del navegador en tu app de Vercel
2. Ejecuta:
   ```javascript
   console.log('DEV_MODE:', process.env.NEXT_PUBLIC_DEV_MODE)
   ```
3. NO funcionará porque `process.env` no está disponible en el browser después del build

Mejor forma:

1. Agrega temporalmente en `app/login/page.tsx` después de la línea 20:
   ```typescript
   console.log('🔍 DEV_MODE en cliente:', process.env.NEXT_PUBLIC_DEV_MODE)
   ```
2. Haz commit y push
3. Vercel redeployará
4. Abre la app y verifica la consola
5. Deberías ver: `🔍 DEV_MODE en cliente: true`

## Cómo Funciona el Login con Google en Dev Mode

Cuando `NEXT_PUBLIC_DEV_MODE=true`:

```typescript
// En app/login/page.tsx línea 45-63
const handleGoogleLogin = async () => {
  // En modo dev, hace login directo con credenciales mock
  await login({
    email: 'usuario.google@gmail.com',
    password: 'google-oauth-mock',
    remember: true
  });
};
```

El `AuthService` detecta que está en modo dev y acepta cualquier credencial sin llamar al backend.

## Si Sigue Sin Funcionar

1. **Revisa los logs de Vercel**:
   - Ve a **Deployments** → Click en el deployment → **Function Logs**
   - Busca errores relacionados con env variables

2. **Verifica el Build Log**:
   - En el deployment, revisa el **Build Log**
   - Confirma que las variables de entorno están siendo inyectadas

3. **Prueba con Login Normal**:
   - Si el login normal (email/password) funciona, el problema es específico de OAuth
   - Usa cualquier email/password (ej: `test@test.com` / `123456`)

4. **Clear Site Data**:
   - En la consola del browser: Application → Clear storage
   - Recarga la página e intenta de nuevo

## Notas Importantes

⚠️ **CRÍTICO**: `NEXT_PUBLIC_DEV_MODE=true` debe estar en **Production**, no solo en Preview/Development.

✅ **Todas las variables** que empiezan con `NEXT_PUBLIC_` deben agregarse en Vercel porque se inyectan en el build del cliente.

🔒 **Seguridad**: Cuando tengas el backend Django listo, cambiar a `NEXT_PUBLIC_DEV_MODE=false` y configurar OAuth real.

## Resumen Rápido

```bash
# 1. Ve a Vercel Dashboard
# 2. Settings → Environment Variables
# 3. Agrega:
NEXT_PUBLIC_DEV_MODE=true  # ← LA MÁS IMPORTANTE

# 4. Redeploy
# 5. Prueba login con Google
# 6. ✅ Debería funcionar
```
