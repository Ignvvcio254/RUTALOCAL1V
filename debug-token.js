/**
 * 🔍 Script de Debugging para Token JWT
 * 
 * Copia y pega este código en la consola del navegador (F12)
 * para diagnosticar problemas con el token de autenticación.
 */

console.log('🔍 === DEBUGGING TOKEN JWT ===\n');

// 1. Verificar tokens en localStorage
console.log('📦 1. Tokens en localStorage:');
const accessToken = localStorage.getItem('ruta_local_access_token');
const refreshToken = localStorage.getItem('ruta_local_refresh_token');
const tokenExpiry = localStorage.getItem('ruta_local_token_expiry');

console.log('   Access Token:', accessToken ? '✅ Existe' : '❌ No existe');
console.log('   Refresh Token:', refreshToken ? '✅ Existe' : '❌ No existe');
console.log('   Token Expiry:', tokenExpiry ? '✅ Existe' : '❌ No existe');

if (accessToken) {
  console.log('\n   📄 Access Token (primeros 50 chars):', accessToken.substring(0, 50) + '...');
  
  // Decodificar el token
  try {
    const parts = accessToken.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      console.log('\n   🔓 Token Payload:', payload);
      
      const expiresAt = new Date(payload.exp * 1000);
      const now = new Date();
      const isExpired = now > expiresAt;
      
      console.log('\n   ⏰ Expira en:', expiresAt.toLocaleString());
      console.log('   ⏰ Hora actual:', now.toLocaleString());
      console.log('   ⏰ Estado:', isExpired ? '❌ EXPIRADO' : '✅ VÁLIDO');
      
      if (!isExpired) {
        const minutesLeft = Math.floor((expiresAt - now) / 1000 / 60);
        console.log('   ⏰ Tiempo restante:', minutesLeft, 'minutos');
      }
    }
  } catch (e) {
    console.error('   ❌ Error decodificando token:', e);
  }
}

// 2. Verificar tokens en sessionStorage
console.log('\n📦 2. Tokens en sessionStorage:');
const sessionAccessToken = sessionStorage.getItem('ruta_local_access_token');
const sessionRefreshToken = sessionStorage.getItem('ruta_local_refresh_token');

console.log('   Access Token:', sessionAccessToken ? '✅ Existe' : '❌ No existe');
console.log('   Refresh Token:', sessionRefreshToken ? '✅ Existe' : '❌ No existe');

// 3. Verificar cookies
console.log('\n🍪 3. Cookies:');
const cookies = document.cookie.split(';').map(c => c.trim());
const accessTokenCookie = cookies.find(c => c.startsWith('access_token='));
console.log('   access_token cookie:', accessTokenCookie ? '✅ Existe' : '❌ No existe');
if (accessTokenCookie) {
  console.log('   Cookie:', accessTokenCookie.substring(0, 50) + '...');
}

// 4. Probar petición con el token actual
console.log('\n🌐 4. Probando petición a /api/businesses/owner/profile/');
const API_URL = 'https://web-production-f3cae.up.railway.app';

if (accessToken) {
  fetch(`${API_URL}/api/businesses/owner/profile/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('\n   📡 Response Status:', response.status, response.statusText);
    
    if (response.status === 200) {
      console.log('   ✅ Token VÁLIDO - Petición exitosa');
      return response.json();
    } else if (response.status === 401) {
      console.log('   ❌ Token INVÁLIDO o EXPIRADO');
      console.log('   💡 Solución: Hacer logout y login nuevamente');
    } else {
      console.log('   ⚠️  Error inesperado:', response.status);
    }
    return response.text();
  })
  .then(data => {
    console.log('\n   📦 Response Data:', data);
  })
  .catch(error => {
    console.error('\n   ❌ Error en petición:', error);
  });
} else {
  console.log('   ⚠️  No se puede probar - No hay token');
  console.log('   💡 Solución: Hacer login primero');
}

// 5. Resumen
console.log('\n📋 5. RESUMEN:');
if (!accessToken && !sessionAccessToken) {
  console.log('   ❌ NO HAY TOKENS - Necesitas hacer login');
  console.log('   💡 Ve a /login y autentícate');
} else if (accessToken) {
  console.log('   ✅ Token encontrado');
  console.log('   🔍 Revisa arriba si está expirado');
  console.log('   💡 Si está expirado, haz logout y login nuevamente');
}

console.log('\n=== FIN DEBUG ===');

// 6. Funciones útiles
console.log('\n🛠️  FUNCIONES ÚTILES:');
console.log('   Para limpiar tokens: clearTokens()');
console.log('   Para ver token completo: showFullToken()');

window.clearTokens = function() {
  localStorage.removeItem('ruta_local_access_token');
  localStorage.removeItem('ruta_local_refresh_token');
  localStorage.removeItem('ruta_local_token_expiry');
  sessionStorage.removeItem('ruta_local_access_token');
  sessionStorage.removeItem('ruta_local_refresh_token');
  sessionStorage.removeItem('ruta_local_token_expiry');
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  console.log('✅ Tokens limpiados. Recarga la página y haz login nuevamente.');
};

window.showFullToken = function() {
  const token = localStorage.getItem('ruta_local_access_token');
  if (token) {
    console.log('🔑 Token completo:', token);
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      console.log('📄 Payload:', JSON.stringify(payload, null, 2));
    } catch (e) {
      console.error('❌ Error:', e);
    }
  } else {
    console.log('❌ No hay token');
  }
};

console.log('\n');
