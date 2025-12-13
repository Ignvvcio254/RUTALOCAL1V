# 🔧 Configuración de Supabase para Google OAuth

## ⚠️ Problema Actual

Supabase está redirigiendo a la raíz (`/`) con tokens en el hash en lugar de a `/auth/callback`.

**URL actual (incorrecta):**
```
http://localhost:3000/#access_token=...&expires_at=...&refresh_token=...
```

**URL esperada (correcta):**
```
http://localhost:3000/auth/callback
```

---

## ✅ Solución Implementada (Temporal)

He agregado un **handler en la home page** que detecta tokens en el hash y redirige automáticamente a `/auth/callback`.

**Archivo:** `app/page.tsx`
- Detecta si hay `access_token` en el hash
- Redirige automáticamente a `/auth/callback` con el hash completo
- El callback procesa los tokens normalmente

---

## 🔧 Configuración Correcta en Supabase (Recomendado)

Para evitar la necesidad del handler temporal, configura las Redirect URLs en Supabase:

### 1. **Ve a Supabase Dashboard**
   - https://supabase.com/dashboard
   - Selecciona tu proyecto

### 2. **Ve a Authentication → URL Configuration**
   - Menú lateral: **Authentication**
   - Click en **"URL Configuration"**

### 3. **Configura las URLs**

#### **Site URL:**
```
https://rutago-nine.vercel.app
```
*(Para desarrollo local: `http://localhost:3000`)*

#### **Redirect URLs** (agregar ambas):
```
https://rutago-nine.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

**💡 Importante:** Puedes tener múltiples Redirect URLs. Agrega una línea por URL.

### 4. **Click en "Save"**

---

## 🧪 Verificación

Después de configurar:

1. **Limpia caché del navegador** (importante!)
2. **Ve a:** https://rutago-nine.vercel.app/login
3. **Click en "Continuar con Google"**
4. **Después de autorizar, deberías ir directamente a:**
   ```
   https://rutago-nine.vercel.app/auth/callback
   ```
   Sin pasar por la home.

---

## 📋 Flujo Actual (Con Handler Temporal)

```
Usuario click Google → Supabase OAuth → Google autoriza
           ↓
Redirige a: /?#access_token=...
           ↓
Home detecta tokens → Redirige a /auth/callback#access_token=...
           ↓
Callback procesa tokens → Envía al backend → Redirige a home/onboarding
```

## 📋 Flujo Ideal (Después de Configurar)

```
Usuario click Google → Supabase OAuth → Google autoriza
           ↓
Redirige DIRECTAMENTE a: /auth/callback
           ↓
Callback procesa tokens → Envía al backend → Redirige a home/onboarding
```

---

## 🐛 Troubleshooting

### "Sigue redirigiendo a home con tokens"
1. Verifica que las Redirect URLs estén guardadas en Supabase
2. Limpia caché del navegador (CTRL+SHIFT+DEL)
3. Cierra sesión en Google y vuelve a intentar
4. Verifica que la URL esté EXACTAMENTE como: `https://tu-dominio.com/auth/callback`

### "Error: redirect_uri_mismatch"
- La Redirect URL en Supabase NO coincide con la que se envía en el código
- Verifica que `https://rutago-nine.vercel.app/auth/callback` esté en la lista
- Asegúrate de no tener espacios extras o caracteres especiales

### "Funciona en local pero no en producción"
- Agrega AMBAS URLs en Supabase:
  - `http://localhost:3000/auth/callback` (desarrollo)
  - `https://rutago-nine.vercel.app/auth/callback` (producción)

---

## 📝 Nota sobre el Handler Temporal

El handler en `app/page.tsx` es una **solución temporal** que funcionará incluso si no configuras las Redirect URLs correctamente en Supabase.

**Ventajas:**
- ✅ Funciona inmediatamente sin configuración adicional
- ✅ No rompe el flujo existente

**Desventajas:**
- ⚠️ Requiere una redirección extra (home → callback)
- ⚠️ Puede causar un flash visual en la home antes de redirigir

**Recomendación:** Configura las Redirect URLs en Supabase para eliminar la necesidad del handler.

---

**Fecha:** 13 de Diciembre de 2025
**Status:** ✅ Funcionando con handler temporal, configuración de Supabase pendiente
