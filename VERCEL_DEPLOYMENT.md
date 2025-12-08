# Configuración de Deployment en Vercel

## Modo de Desarrollo para Testing

Este proyecto está configurado para usar **autenticación de desarrollo** en Vercel durante la fase de testing. Esto permite hacer login con cualquier credencial sin necesidad de un backend real.

## Variables de Entorno en Vercel

Para configurar el deployment en Vercel con modo desarrollo, sigue estos pasos:

### 1. Acceder a Configuración de Variables de Entorno

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona el proyecto `RUTALOCAL1V`
3. Ve a **Settings** → **Environment Variables**

### 2. Agregar Variables de Entorno

Agrega las siguientes variables de entorno con el valor especificado:

#### Variables Requeridas para Modo Dev:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `NEXT_PUBLIC_DEV_MODE` | `true` | Production, Preview, Development |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Production, Preview, Development |
| `NEXT_PUBLIC_API_BASE_PATH` | `/api` | Production, Preview, Development |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `pk.eyJ1IjoibmFjaG8yNTQiLCJhIjoiY21pdGxyZjhnMHRlYjNnb243bnA1OG81ayJ9.BPTKLir4w184eLNzsao9XQ` | Production, Preview, Development |
| `NEXT_PUBLIC_STORAGE_KEY` | `santiago_user` | Production, Preview, Development |
| `NEXT_PUBLIC_TOKEN_KEY` | `santiago_token` | Production, Preview, Development |
| `NEXT_PUBLIC_JWT_SECRET` | `dev-secret-key-change-in-production` | Production, Preview, Development |
| `NEXT_PUBLIC_JWT_EXPIRATION` | `7d` | Production, Preview, Development |

#### Variable Más Importante:

```
NEXT_PUBLIC_DEV_MODE=true
```

Esta variable habilita el modo de desarrollo que permite:
- ✅ Login con CUALQUIER email y contraseña
- ✅ Registro sin validación de backend
- ✅ Tokens mock generados automáticamente
- ✅ No requiere backend Django funcionando

### 3. Cómo Funciona el Modo Dev

Cuando `NEXT_PUBLIC_DEV_MODE=true`:

```typescript
// En lib/auth/auth.service.ts
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_DEV_MODE === 'true' ||
  process.env.NODE_ENV === 'development';
```

El sistema automáticamente:
1. Acepta cualquier credencial en login
2. Genera un usuario mock: `demo@rutalocal.cl`
3. Crea tokens de acceso ficticios
4. Almacena la sesión en localStorage
5. No hace llamadas al backend Django

### 4. Credenciales de Prueba (Modo Dev)

En modo desarrollo, puedes usar **CUALQUIER** combinación de email/password:

```
Email: test@example.com
Password: 123456

Email: admin@test.com
Password: password

Email: cualquier@email.com
Password: cualquiercontraseña
```

Todas funcionarán y crearán una sesión válida con el usuario mock.

### 5. Deployment

Una vez configuradas las variables de entorno:

```bash
git add .
git commit -m "chore: Configurar modo dev para Vercel"
git push origin main
```

Vercel automáticamente:
- ✅ Detecta el push
- ✅ Ejecuta el build
- ✅ Usa las variables de entorno configuradas
- ✅ Despliega la aplicación con autenticación mock

### 6. Verificar Deployment

1. Ve a la URL de Vercel: `https://rutalocal1v.vercel.app`
2. Haz clic en "Iniciar Sesión"
3. Ingresa cualquier email/password
4. Deberías ser redirigido al home autenticado

### 7. Modo Producción (Cuando el Backend esté listo)

Para cambiar a producción real:

1. En Vercel, cambia la variable:
   ```
   NEXT_PUBLIC_DEV_MODE=false
   ```

2. Configura la URL del backend real:
   ```
   NEXT_PUBLIC_API_URL=https://tu-backend.com
   ```

3. Redeploy automáticamente se activará

## Logs y Debugging

Para verificar qué modo está usando la app, revisa la consola del browser:

```javascript
// En modo dev verás:
🔧 [AuthService] Modo desarrollo - Login mock
📧 Email: test@example.com
✅ [AuthService] Credenciales aceptadas - Generando mock user
✅ [AuthService] Tokens guardados
```

## Estructura de Archivos

```
.
├── .env.local           # Variables locales (no se suben a Git)
├── .env.example         # Ejemplo de variables
├── .env.production      # Variables para Vercel (recién creado)
├── lib/auth/
│   ├── auth.service.ts  # Servicio con lógica dev/prod
│   └── token-manager.ts # Gestión de tokens
└── contexts/
    └── auth-context.tsx # Context de autenticación
```

## Notas Importantes

⚠️ **IMPORTANTE**: El archivo `.env.production` NO reemplaza las variables de entorno de Vercel. Debes configurarlas manualmente en el dashboard de Vercel.

✅ **Recomendación**: Mantén `NEXT_PUBLIC_DEV_MODE=true` hasta que el backend Django esté completamente funcional y probado.

🔒 **Seguridad**: En producción final, SIEMPRE cambiar a `NEXT_PUBLIC_DEV_MODE=false` y usar autenticación real con JWT del backend.
