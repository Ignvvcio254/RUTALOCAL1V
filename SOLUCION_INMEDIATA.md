# 🚨 SOLUCIÓN INMEDIATA - Error 401 Persistente

## 📋 Situación Actual

- ✅ Código corregido y pusheado a GitHub
- ✅ Vercel detectará el cambio y hará redeploy automático
- ⏳ **Esperando deploy de Vercel** (toma 2-5 minutos)
- ❌ El código en producción **AÚN** es la versión vieja

---

## 🔍 PASO 1: Verificar Estado del Token

### Abre la consola del navegador (F12) y ejecuta:

```javascript
// Copia y pega SOLO esta línea:
console.log('Token:', localStorage.getItem('ruta_local_access_token') ? 'Existe ✅' : 'No existe ❌')
```

### Resultado esperado:

- **"Token: Existe ✅"** → Hay token, continúa al paso 2
- **"Token: No existe ❌"** → No hay token, ve directo al paso 3

---

## 🔍 PASO 2: Verificar si el Token está Expirado

```javascript
// Copia y pega TODO este bloque:
const token = localStorage.getItem('ruta_local_access_token');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiresAt = new Date(payload.exp * 1000);
  const isExpired = new Date() > expiresAt;
  console.log('Expira:', expiresAt.toLocaleString());
  console.log('Estado:', isExpired ? 'EXPIRADO ❌' : 'VÁLIDO ✅');
} else {
  console.log('No hay token');
}
```

### Si el token está EXPIRADO → Ve al PASO 3

---

## 🔄 PASO 3: Limpiar y Renovar Token

### Opción A: Limpiar desde consola

```javascript
// Copia y pega esto:
localStorage.removeItem('ruta_local_access_token');
localStorage.removeItem('ruta_local_refresh_token');
localStorage.removeItem('ruta_local_token_expiry');
sessionStorage.clear();
document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
console.log('✅ Limpiado! Recarga la página (F5)');
```

### Opción B: Limpiar desde la UI del navegador

1. **Chrome/Edge:**
   - F12 → Application → Storage
   - Clear site data

2. **Firefox:**
   - F12 → Storage
   - Eliminar todo para el sitio

### Después de limpiar:

1. **Recarga la página** (F5 o Ctrl+R)
2. **Haz logout** si aparece la opción
3. **Haz login nuevamente:**
   - Email: `elignacio2604@gmail.com`
   - Password: tu contraseña

---

## ⏰ PASO 4: Esperar Deploy de Vercel

### Verificar si el deploy terminó:

1. Ve a: https://vercel.com/tu-proyecto/deployments
2. O revisa: https://github.com/Ignvvcio254/RUTALOCAL1V/actions

### Cómo saber si ya deployó:

```javascript
// Ejecuta esto en la consola del navegador:
console.log('Versión:', document.querySelector('script[src*=".js"]')?.src);
```

Si ves **nuevos hashes** (diferentes de `3aacccd7b2faf975.js`), el deploy terminó.

---

## ✅ PASO 5: Probar Nuevamente

1. **Limpia caché** (Ctrl+Shift+R o Cmd+Shift+R)
2. **Haz login fresco**
3. **Ve a:** `/dashboard/my-business`

### Ahora deberías ver en la consola:

```
✅ Token found, fetching owner data...
✅ Profile loaded: { can_create_businesses: true, ... }
✅ Businesses loaded: []
```

---

## 🆘 Si TODAVÍA da 401 después del deploy:

### Debug completo:

1. **Copia TODO el contenido de `debug-token.js`**
2. **Pégalo en la consola del navegador**
3. **Comparte el output completo**

O simplemente ejecuta esto:

```javascript
fetch('https://web-production-f3cae.up.railway.app/api/businesses/owner/profile/', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('ruta_local_access_token')}` }
})
.then(r => console.log('Status:', r.status, r.statusText))
.catch(e => console.error('Error:', e));
```

---

## 📊 Timeline Esperado

```
Ahora (6:16 AM):
├─ [DONE] Código corregido y pusheado
├─ [IN PROGRESS] Vercel building...
└─ [PENDING] Deploy a producción

En 2-5 minutos:
├─ [DONE] Vercel deploy completo
├─ [TODO] Limpiar tokens del navegador
├─ [TODO] Login fresco
└─ [TODO] Probar /dashboard/my-business

✅ FUNCIONA
```

---

## 🎯 ¿Por qué pasó esto?

El cambio de código **NO** afecta tokens existentes. Los tokens en tu navegador son de cuando hiciste login ANTES del fix.

### Solución:
- **Login fresco** después del deploy = Token nuevo con el código correcto

---

## 💡 Para evitar esto en el futuro:

1. **Siempre usa `TokenManager`** en vez de acceso directo a localStorage
2. **Define tiempos de expiración cortos** durante desarrollo (ej: 15 min)
3. **Implementa auto-refresh de tokens** cuando estén por expirar

---

## 📝 Checklist Rápido:

- [ ] Verificar que Vercel deployó (esperar 2-5 min)
- [ ] Limpiar tokens del navegador
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Logout/Login fresco
- [ ] Probar /dashboard/my-business
- [ ] Verificar consola: debe mostrar logs ✅

---

## 🔗 Links Útiles:

- **Vercel Deployments:** https://vercel.com/
- **GitHub Actions:** https://github.com/Ignvvcio254/RUTALOCAL1V/actions
- **Backend Logs:** Railway dashboard
- **Django Admin:** https://web-production-f3cae.up.railway.app/admin/

---

**⏰ TIEMPO ESTIMADO HASTA SOLUCIÓN:** 5-10 minutos

1. ⏳ Espera deploy (2-5 min)
2. 🧹 Limpia tokens (30 seg)
3. 🔐 Login fresco (1 min)
4. ✅ Prueba (1 min)

---

**Si después de esto aún no funciona, ejecuta el script `debug-token.js` completo y comparte el output.**
