# 🔧 Corrección Error 401 - My Business Dashboard

## 📋 Problema Identificado

El usuario veía este error en la consola al intentar acceder a `/dashboard/my-business`:

```
❌ Failed to load resource: the server responded with a status of 401 ()
   /api/businesses/owner/profile/
   /api/businesses/owner/my-businesses/
```

A pesar de:
- ✅ Usuario autenticado correctamente
- ✅ AuthContext cargando usuario: `elignacio2604@gmail.com`
- ✅ Sesión activa
- ✅ Permisos creados en Django Admin

---

## 🔍 Causa Raíz

**Inconsistencia en el nombre de la clave del token JWT:**

```typescript
// ❌ INCORRECTO - app/dashboard/my-business/page.tsx (línea 48)
const token = localStorage.getItem('accessToken')

// ✅ CORRECTO - lib/auth/token-manager.ts (línea 4)
private static readonly ACCESS_TOKEN_KEY = 'ruta_local_access_token'
```

El código estaba intentando obtener el token con la clave `'accessToken'`, pero el `TokenManager` lo guardaba con la clave `'ruta_local_access_token'`.

**Resultado:** El token siempre era `null` → Backend recibía peticiones sin autenticación → Error 401

---

## ✅ Solución Aplicada

### 1. Usar TokenManager en lugar de acceso directo a localStorage

**Antes:**
```typescript
const token = localStorage.getItem('accessToken')
```

**Después:**
```typescript
import { TokenManager } from '@/lib/auth/token-manager'

const token = TokenManager.getAccessToken()
```

### 2. Mejoras adicionales implementadas:

```typescript
✅ Validación de token antes de hacer peticiones
✅ Manejo correcto de errores 401 (token expirado)
✅ Redirección automática a /login si no hay token
✅ Logs de depuración para facilitar troubleshooting
✅ Limpieza de tokens cuando expiran
```

---

## 📦 Archivos Modificados

### Frontend (RUTALOCAL1V):

```
app/dashboard/my-business/page.tsx
```

**Cambios:**
1. Importar `TokenManager`
2. Usar `TokenManager.getAccessToken()` 
3. Agregar validación de token
4. Manejar errores 401
5. Logs de debug mejorados

---

## 🧪 Testing

### Verificar que la corrección funciona:

1. **Login del usuario:**
   ```
   Email: elignacio2604@gmail.com
   Password: ****
   ```

2. **Verificar en Django Admin:**
   - `/admin/businesses/businessownerprofile/`
   - Usuario debe tener:
     - ✅ can_create_businesses: True
     - ✅ max_businesses_allowed: 1
     - ✅ is_verified_owner: True

3. **Acceder al Dashboard:**
   ```
   https://tu-dominio/dashboard/my-business
   ```

4. **Verificar consola del navegador:**
   ```javascript
   ✅ Token found, fetching owner data...
   ✅ Profile loaded: { can_create_businesses: true, ... }
   ✅ Businesses loaded: []
   ```

---

## 🎯 Comportamiento Esperado

### Caso 1: Usuario CON permisos
```
1. Token válido ✅
2. GET /api/businesses/owner/profile/ → 200 OK
3. GET /api/businesses/owner/my-businesses/ → 200 OK
4. Mostrar dashboard con opción "Crear Negocio"
```

### Caso 2: Usuario SIN permisos
```
1. Token válido ✅
2. GET /api/businesses/owner/profile/ → 200 OK
3. profile.can_create_businesses = false
4. Mostrar mensaje: "Acceso Denegado"
```

### Caso 3: Token expirado
```
1. Token inválido/expirado ❌
2. GET /api/businesses/owner/profile/ → 401 Unauthorized
3. Limpiar tokens con TokenManager.clearTokens()
4. Redirigir a /login
```

### Caso 4: Sin token
```
1. No hay token ❌
2. Redirigir a /login inmediatamente
3. No hacer peticiones al backend
```

---

## 🔐 Cómo Funciona TokenManager

### Guardar Tokens:
```typescript
TokenManager.saveTokens(tokens, remember)
// Guarda en: 'ruta_local_access_token'
```

### Obtener Token:
```typescript
TokenManager.getAccessToken()
// Busca en localStorage y sessionStorage
// Retorna: token | null
```

### Verificar Expiración:
```typescript
TokenManager.isTokenExpired()
// Compara con: 'ruta_local_token_expiry'
```

### Limpiar Tokens:
```typescript
TokenManager.clearTokens()
// Limpia localStorage, sessionStorage y cookies
```

---

## 📊 Flujo Completo de Autenticación

```mermaid
Usuario → Login
    ↓
AuthService.login()
    ↓
TokenManager.saveTokens() → localStorage: 'ruta_local_access_token'
    ↓
AuthContext.setUser()
    ↓
Navegar a /dashboard/my-business
    ↓
TokenManager.getAccessToken()
    ↓
Fetch con Authorization: Bearer <token>
    ↓
Backend valida JWT
    ↓
200 OK → Mostrar datos
401 → Limpiar tokens → Redirect /login
```

---

## 🐛 Debugging

### Ver tokens en consola:
```javascript
// En consola del navegador
console.log('Access Token:', localStorage.getItem('ruta_local_access_token'))
console.log('Refresh Token:', localStorage.getItem('ruta_local_refresh_token'))
console.log('Token Expiry:', localStorage.getItem('ruta_local_token_expiry'))
```

### Ver si el token es válido:
```javascript
const token = localStorage.getItem('ruta_local_access_token')
if (token) {
  const parts = token.split('.')
  const payload = JSON.parse(atob(parts[1]))
  console.log('Token payload:', payload)
  console.log('Expires at:', new Date(payload.exp * 1000))
}
```

### Ver logs del backend:
```bash
# En Railway
railway logs --tail 100

# Buscar errores 401
railway logs | grep "401\|Unauthorized"
```

---

## ✅ Checklist de Verificación

- [x] TokenManager usado correctamente
- [x] Validación de token antes de peticiones
- [x] Manejo de errores 401
- [x] Redirección a login cuando falla
- [x] Logs de debug agregados
- [x] Código pusheado a GitHub
- [ ] Verificar en producción
- [ ] Confirmar que usuario puede acceder
- [ ] Confirmar que puede crear negocios

---

## 🚀 Deployment

### Frontend ya está desplegado automáticamente

Vercel/Netlify detectará el push y deployará automáticamente.

**URL de prueba:**
```
https://tu-dominio/dashboard/my-business
```

---

## 📝 Próximos Pasos

1. ✅ **Verificar en producción** que no hay más errores 401
2. ✅ **Probar crear un negocio** con el usuario autorizado
3. ✅ **Verificar que el negocio queda** en status "pending_review"
4. ✅ **Aprobar desde admin** y verificar que se publica
5. ✅ **Verificar que aparece** en el mapa del frontend

---

## 💡 Lecciones Aprendidas

### Problema común en aplicaciones con JWT:

1. **Siempre usar una librería/clase centralizada** para manejar tokens
2. **No acceder directamente a localStorage** en múltiples lugares
3. **Definir constantes** para nombres de claves
4. **Validar tokens** antes de hacer peticiones
5. **Manejar errores 401** para renovar o pedir re-login

### Best Practice:

```typescript
// ✅ CORRECTO
import { TokenManager } from '@/lib/auth/token-manager'
const token = TokenManager.getAccessToken()

// ❌ INCORRECTO
const token = localStorage.getItem('accessToken')
const token = localStorage.getItem('token')
const token = localStorage.getItem('jwt')
```

---

**✅ Corrección aplicada y pusheada**
**🚀 Frontend deployando automáticamente**
**🎯 Listo para probar en producción**
