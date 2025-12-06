# 🔗 Guía Rápida de Integración con Backend Django

Esta guía te ayudará a conectar rápidamente el frontend de **Ruta Local** con tu backend Django.

---

## 🚀 Inicio Rápido (5 minutos)

### 1. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local con tu configuración
nano .env.local  # o usa tu editor favorito
```

Configura estas variables esenciales:

```bash
# URL de tu backend Django
NEXT_PUBLIC_API_URL=http://localhost:8000

# Ruta base de la API
NEXT_PUBLIC_API_BASE_PATH=/api

# Modo desarrollo (desactivar cuando conectes el backend real)
NEXT_PUBLIC_DEV_MODE=false
```

### 2. Actualizar AuthContext

Reemplaza las funciones mock en `contexts/auth-context.tsx`:

```typescript
import { authApi } from '@/lib/api'
import { env } from '@/lib/env'

// Reemplazar la función login existente
const login = async (email: string, password: string) => {
  setIsLoading(true)

  try {
    // ✅ Llamada real al backend
    const response = await authApi.login(email, password)

    const user: User = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
    }

    // Guardar token y usuario
    localStorage.setItem(env.storage.tokenKey, response.token)
    localStorage.setItem(env.storage.userKey, JSON.stringify(user))

    setUser(user)
    router.push('/dashboard')
  } catch (error) {
    throw error
  } finally {
    setIsLoading(false)
  }
}

// Reemplazar la función register
const register = async (name: string, email: string, password: string) => {
  setIsLoading(true)

  try {
    // ✅ Llamada real al backend
    const response = await authApi.register(name, email, password)

    const user: User = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
    }

    localStorage.setItem(env.storage.tokenKey, response.token)
    localStorage.setItem(env.storage.userKey, JSON.stringify(user))

    setUser(user)
    router.push('/dashboard')
  } catch (error) {
    throw error
  } finally {
    setIsLoading(false)
  }
}
```

### 3. Reiniciar el Servidor

```bash
# Reinicia Next.js para cargar las nuevas variables
npm run dev
```

---

## 🐍 Configuración del Backend Django

### Endpoints Requeridos

Tu backend Django debe implementar estos endpoints:

```python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Autenticación
    path('api/auth/login', views.login, name='login'),
    path('api/auth/register', views.register, name='register'),
    path('api/auth/logout', views.logout, name='logout'),
    path('api/auth/me', views.get_current_user, name='me'),

    # Google OAuth (opcional)
    path('api/auth/google', views.google_login, name='google-login'),
]
```

### Formato de Respuesta Esperado

#### Login / Register Exitoso

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

#### Error

```json
{
  "success": false,
  "message": "Credenciales inválidas",
  "errors": {
    "email": ["Este campo es requerido"],
    "password": ["La contraseña debe tener al menos 6 caracteres"]
  }
}
```

### Configurar CORS

```bash
# Instalar django-cors-headers
pip install django-cors-headers
```

```python
# settings.py

INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

# Permitir requests del frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'authorization',
    'content-type',
]
```

### Ejemplo de Vista de Login

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

    user = authenticate(username=email, password=password)

    if not user:
        return Response({
            'success': False,
            'message': 'Credenciales inválidas'
        }, status=401)

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

@api_view(['POST'])
def register(request):
    from django.contrib.auth.models import User

    name = request.data.get('name')
    email = request.data.get('email')
    password = request.data.get('password')

    # Validar datos
    if User.objects.filter(email=email).exists():
        return Response({
            'success': False,
            'message': 'Este email ya está registrado',
            'errors': {'email': ['Email ya existe']}
        }, status=400)

    # Crear usuario
    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name
    )

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

---

## 🔍 Verificación

### Checklist Frontend

- [ ] `.env.local` creado con `NEXT_PUBLIC_API_URL`
- [ ] `NEXT_PUBLIC_DEV_MODE=false` para usar backend real
- [ ] `auth-context.tsx` actualizado con `authApi`
- [ ] Servidor reiniciado: `npm run dev`

### Checklist Backend

- [ ] Django corriendo en `http://localhost:8000`
- [ ] CORS configurado correctamente
- [ ] Endpoints `/api/auth/login` y `/api/auth/register` funcionando
- [ ] Respuestas en formato JSON correcto

### Probar Integración

```bash
# Desde el frontend, probar login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Debe retornar JSON con user y token
```

---

## 📚 Documentación Completa

Para guías más detalladas:

- **[ENV_SETUP.md](ENV_SETUP.md)** - Configuración completa de variables de entorno
- **[LOGIN_IMPLEMENTATION.md](LOGIN_IMPLEMENTATION.md)** - Implementación del sistema de autenticación

---

## 🆘 Problemas Comunes

### "Failed to fetch"

**Causa**: Backend no está corriendo o URL incorrecta

**Solución**:
```bash
# Verifica que Django esté corriendo
curl http://localhost:8000/api/auth/login

# Verifica .env.local
cat .env.local | grep API_URL
```

### "CORS policy error"

**Causa**: CORS no configurado en Django

**Solución**: Revisa la sección "Configurar CORS" arriba

### "401 Unauthorized" en peticiones autenticadas

**Causa**: Token no se envía correctamente

**Solución**:
```typescript
// Verifica que el token esté en localStorage
console.log(localStorage.getItem('santiago_token'))

// La librería lib/api.ts automáticamente incluye el header:
// Authorization: Bearer {token}
```

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la consola del navegador (F12)
2. Revisa los logs de Django
3. Verifica que las URLs en `.env.local` sean correctas
4. Asegúrate de que Django y Next.js estén corriendo

---

**Última actualización**: 5 de Diciembre, 2025
