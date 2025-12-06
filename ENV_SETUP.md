# 🔧 Configuración de Variables de Entorno

Esta guía explica cómo configurar las variables de entorno para conectar el frontend de **Ruta Local** con el backend de Django.

---

## 📋 Tabla de Contenidos

1. [Archivos de Configuración](#archivos-de-configuración)
2. [Variables de Entorno](#variables-de-entorno)
3. [Configuración del Backend Django](#configuración-del-backend-django)
4. [Configuración de Google OAuth](#configuración-de-google-oauth)
5. [Ejemplo de Integración](#ejemplo-de-integración)
6. [Troubleshooting](#troubleshooting)

---

## 📁 Archivos de Configuración

### Archivos Creados

- **`.env.example`** - Plantilla con todas las variables disponibles (SÍ se sube a Git)
- **`.env.local`** - Configuración local de desarrollo (NO se sube a Git)
- **`.gitignore`** - Protege archivos sensibles
- **`lib/env.ts`** - Utilidad para acceder a variables de forma tipada
- **`lib/api.ts`** - Cliente HTTP configurado para Django

### Ubicación de Archivos

```
RUTALOCAL1V/
├── .env.example          # Plantilla (compartida en Git)
├── .env.local            # Tu configuración local (ignorado por Git)
├── .gitignore            # Configuración de archivos ignorados
├── lib/
│   ├── env.ts           # Configuración de variables
│   └── api.ts           # Cliente HTTP para Django
```

---

## 🔑 Variables de Entorno

### Backend Django

```bash
# URL completa del backend (sin / al final)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Ruta base de la API (donde están los endpoints)
NEXT_PUBLIC_API_BASE_PATH=/api
```

**Ejemplo**: Si tu backend está en `http://localhost:8000` y los endpoints en `/api/auth/login`, entonces:
- `NEXT_PUBLIC_API_URL` = `http://localhost:8000`
- `NEXT_PUBLIC_API_BASE_PATH` = `/api`

### Autenticación JWT

```bash
# Secret para firmar tokens (debe coincidir con Django)
NEXT_PUBLIC_JWT_SECRET=tu-secret-key-muy-seguro

# Tiempo de expiración del token
NEXT_PUBLIC_JWT_EXPIRATION=7d

# Claves para localStorage
NEXT_PUBLIC_STORAGE_KEY=santiago_user
NEXT_PUBLIC_TOKEN_KEY=santiago_token
```

### Google OAuth

```bash
# Cliente ID de Google Cloud Console
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456-abcdef.apps.googleusercontent.com

# Client Secret (NO exponer en el frontend)
GOOGLE_CLIENT_SECRET=GOCSPX-tu-secret

# URI de redirección autorizada
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### Modo Desarrollo

```bash
# Activa modo desarrollo (acepta cualquier credencial)
NEXT_PUBLIC_DEV_MODE=true

# URL del frontend
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🐍 Configuración del Backend Django

### 1. Endpoints Esperados

El frontend espera estos endpoints en Django:

#### Autenticación

```python
# Django URLs esperadas
POST   /api/auth/login           # Login con email/password
POST   /api/auth/register        # Registro de usuario
POST   /api/auth/logout          # Cerrar sesión
GET    /api/auth/me              # Obtener usuario actual
POST   /api/auth/refresh         # Refresh token
POST   /api/auth/google          # Login con Google
POST   /api/auth/github          # Login con GitHub
```

#### Negocios

```python
GET    /api/businesses           # Listar negocios
GET    /api/businesses/:id       # Detalle de negocio
GET    /api/businesses/search    # Buscar negocios
```

#### Rutas

```python
GET    /api/routes               # Listar rutas del usuario
POST   /api/routes               # Crear ruta
GET    /api/routes/:id           # Detalle de ruta
PUT    /api/routes/:id           # Actualizar ruta
DELETE /api/routes/:id           # Eliminar ruta
```

### 2. Configuración CORS en Django

En tu `settings.py`:

```python
# settings.py

INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Debe estar antes de CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    # ...
]

# Permitir requests del frontend Next.js
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# O en desarrollo permitir todos
CORS_ALLOW_ALL_ORIGINS = True  # Solo en desarrollo

# Headers permitidos
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'origin',
    'user-agent',
    'x-csrftoken',
]

# Métodos permitidos
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Permitir credenciales
CORS_ALLOW_CREDENTIALS = True
```

### 3. Ejemplo de Vista de Login en Django

```python
# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    # Autenticar usuario
    user = authenticate(username=email, password=password)

    if user is None:
        return Response({
            'message': 'Credenciales inválidas',
            'success': False
        }, status=401)

    # Generar tokens JWT
    refresh = RefreshToken.for_user(user)

    return Response({
        'success': True,
        'user': {
            'id': str(user.id),
            'email': user.email,
            'name': user.get_full_name(),
        },
        'token': str(refresh.access_token),
        'refresh': str(refresh),
    })
```

### 4. Respuestas Esperadas

#### Login Exitoso

```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "usuario@example.com",
    "name": "Juan Pérez"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error de Login

```json
{
  "success": false,
  "message": "Credenciales inválidas",
  "statusCode": 401
}
```

---

## 🔐 Configuración de Google OAuth

### 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services** > **Credentials**
4. Click en **Create Credentials** > **OAuth 2.0 Client ID**

### 2. Configurar OAuth Consent Screen

1. Selecciona **External** (o Internal si es para organización)
2. Completa la información:
   - **App name**: Ruta Local
   - **User support email**: Tu email
   - **Developer contact**: Tu email
3. Guarda y continúa

### 3. Crear OAuth 2.0 Client ID

1. **Application type**: Web application
2. **Name**: Ruta Local Frontend
3. **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/google/callback
   http://localhost:3000
   ```
4. Click **Create**
5. **Copia el Client ID y Client Secret**

### 4. Configurar en `.env.local`

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-tu-client-secret-aqui
```

### 5. Configurar en Django (Backend)

```python
# settings.py

# Google OAuth
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')

# O usa django-allauth
INSTALLED_APPS += ['allauth', 'allauth.account', 'allauth.socialaccount', 'allauth.socialaccount.providers.google']

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': GOOGLE_CLIENT_ID,
            'secret': GOOGLE_CLIENT_SECRET,
            'key': ''
        },
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    }
}
```

---

## 💻 Ejemplo de Integración

### Usar las Variables en el Código

```typescript
// En cualquier componente
import { env, apiRoutes } from '@/lib/env'
import { authApi } from '@/lib/api'

// Ejemplo: Login
async function handleLogin(email: string, password: string) {
  try {
    // Opción 1: Usar el servicio de API (recomendado)
    const response = await authApi.login(email, password)

    // Guardar token
    localStorage.setItem(env.storage.tokenKey, response.token)
    localStorage.setItem(env.storage.userKey, JSON.stringify(response.user))

    console.log('Login exitoso:', response.user)
  } catch (error) {
    console.error('Error de login:', error)
  }
}

// Ejemplo: Obtener negocios
import { businessApi } from '@/lib/api'

async function getBusinesses() {
  try {
    const businesses = await businessApi.list()
    console.log('Negocios:', businesses)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### Actualizar AuthContext para Usar Django

```typescript
// contexts/auth-context.tsx
import { authApi } from '@/lib/api'
import { env } from '@/lib/env'

const login = async (email: string, password: string) => {
  setIsLoading(true)

  try {
    // Llamada real al backend Django
    const response = await authApi.login(email, password)

    const user: User = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
    }

    // Guardar token JWT
    localStorage.setItem(env.storage.tokenKey, response.token)
    localStorage.setItem(env.storage.userKey, JSON.stringify(user))

    setUser(user)
    router.push('/dashboard')
  } catch (error) {
    throw new Error('Credenciales inválidas')
  } finally {
    setIsLoading(false)
  }
}
```

---

## 🔧 Troubleshooting

### Error: CORS Policy

**Síntoma**: `Access to fetch at 'http://localhost:8000/api/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solución**:
1. Instala `django-cors-headers` en Django
2. Configura CORS en `settings.py` (ver arriba)
3. Reinicia el servidor Django

### Error: Network Request Failed

**Síntoma**: `TypeError: Failed to fetch`

**Solución**:
1. Verifica que Django esté corriendo: `http://localhost:8000`
2. Verifica `NEXT_PUBLIC_API_URL` en `.env.local`
3. Revisa la consola del navegador para más detalles

### Error: 401 Unauthorized

**Síntoma**: Todas las peticiones autenticadas fallan

**Solución**:
1. Verifica que el token JWT esté en localStorage
2. Verifica que Django acepte el header `Authorization: Bearer {token}`
3. Revisa que el token no haya expirado

### Variables de Entorno No se Actualizan

**Síntoma**: Cambios en `.env.local` no se reflejan

**Solución**:
1. Reinicia el servidor de desarrollo: `npm run dev`
2. Las variables con `NEXT_PUBLIC_` son las únicas expuestas al navegador
3. Limpia cache: `rm -rf .next && npm run dev`

---

## 📊 Checklist de Configuración

### Frontend (Next.js)

- [ ] Copiar `.env.example` a `.env.local`
- [ ] Configurar `NEXT_PUBLIC_API_URL` con la URL de Django
- [ ] Configurar `NEXT_PUBLIC_API_BASE_PATH` (usualmente `/api`)
- [ ] (Opcional) Configurar Google OAuth client ID
- [ ] Reiniciar servidor: `npm run dev`

### Backend (Django)

- [ ] Instalar `django-cors-headers`
- [ ] Configurar CORS en `settings.py`
- [ ] Crear endpoints de autenticación (`/api/auth/login`, etc.)
- [ ] Configurar JWT con `djangorestframework-simplejwt`
- [ ] Reiniciar servidor: `python manage.py runserver`

### Integración

- [ ] Actualizar `auth-context.tsx` para usar `authApi`
- [ ] Probar login desde el frontend
- [ ] Verificar que el token JWT se guarde
- [ ] Verificar que las peticiones autenticadas incluyan el header `Authorization`

---

## 📚 Recursos Adicionales

- [Django CORS Headers](https://github.com/adamchainz/django-cors-headers)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Google OAuth Setup](https://console.cloud.google.com/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

**Última actualización**: 5 de Diciembre, 2025
**Estado**: ✅ Configuración lista para integración con Django
