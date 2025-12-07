# 🚪 PLAN DE AUTENTICACIÓN SIMPLE - Frontend Only
## Login/Register con Auto-Login Temporal (Sin Backend)

**Versión:** 1.0.0  
**Fecha:** Diciembre 2024  
**Tipo:** Frontend Standalone

---

## 🎯 OBJETIVO

Crear un flujo de autenticación que:
- ✅ Siempre pida login al abrir la app (`/` → `/login`)
- ✅ Muestre páginas de login y registro mejoradas con banner informativo
- ✅ Mantenga la estética actual (gradientes indigo/purple)
- ✅ Auto-login temporal (mientras no hay backend)
- ✅ Redirija al **inicio** (home), NO al dashboard
- ✅ Mantenga las funciones actuales de registro y login

---

## 📋 REQUERIMIENTOS

### Funcionales
1. **Página de Login mejorada:**
   - Banner lateral/superior con información de la app
   - Formulario simple (email + contraseña)
   - Botón de Google (simulado)
   - Link a registro

2. **Página de Register mejorada:**
   - Banner lateral/superior con beneficios
   - Formulario (nombre + email + contraseña + confirmar)
   - Indicador de fortaleza de contraseña
   - Checkbox de términos
   - Link a login

3. **Auto-Login Temporal:**
   - Al hacer submit en login/register → Guardar usuario en contexto
   - Redirigir a `/` (página principal/home)
   - Mostrar navbar con usuario autenticado

4. **Protección de Rutas:**
   - Si no hay usuario → Redirigir a `/login`
   - Si hay usuario → Permitir acceso a toda la app

---

## 🏗️ ARQUITECTURA SIMPLE

### Flujo de Usuario:

```
Usuario abre app
    ↓
¿Tiene sesión?
    ├─ NO → Redirigir a /login
    │        ↓
    │   Usuario hace login/register
    │        ↓
    │   Guardar en localStorage + contexto
    │        ↓
    │   Redirigir a / (home)
    │
    └─ SÍ → Mostrar app completa
```

### Componentes Necesarios:

```
1. Auth Check Component
   - Verifica si hay sesión al cargar la app
   - Redirige a /login si no hay sesión

2. Login Page Mejorado
   - Banner informativo
   - Formulario limpio

3. Register Page Mejorado
   - Banner con beneficios
   - Formulario con validaciones

4. Auth Context (YA EXISTE)
   - Solo ajustar redirect: dashboard → home
```

---

## 🎨 DISEÑO DE PÁGINAS

### Layout Login/Register:

```
Desktop (≥1024px):
┌─────────────────────────────────────────────┐
│                                             │
│  ┌──────────────┐  ┌──────────────────┐   │
│  │              │  │                  │   │
│  │   BANNER     │  │   FORMULARIO     │   │
│  │   INFO       │  │   LOGIN/REGISTER │   │
│  │              │  │                  │   │
│  │  • Beneficio │  │  Email:          │   │
│  │  • Beneficio │  │  [__________]    │   │
│  │  • Beneficio │  │                  │   │
│  │              │  │  Contraseña:     │   │
│  │  [Imagen]    │  │  [__________]    │   │
│  │              │  │                  │   │
│  │              │  │  [Entrar]        │   │
│  │              │  │                  │   │
│  └──────────────┘  └──────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘

Mobile (≤768px):
┌─────────────────────┐
│                     │
│   Logo              │
│   Ruta Local        │
│                     │
│   Banner (pequeño)  │
│   • Info clave      │
│   • Info clave      │
│                     │
│   ───────────────   │
│                     │
│   Formulario        │
│   [__________]      │
│   [__________]      │
│   [Entrar]          │
│                     │
└─────────────────────┘
```

---

## 📝 IMPLEMENTACIÓN

### FASE 1: Auth Check Component (30 min)

**Objetivo:** Verificar sesión al cargar cualquier página

**Archivo:** `components/auth/auth-check.tsx`

```typescript
"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

const PUBLIC_ROUTES = ['/login', '/register']

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // Esperar a que termine de cargar
    if (isLoading) return

    // Si no está autenticado y no está en ruta pública
    if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.push('/login')
    }

    // Si está autenticado y está en ruta de auth
    if (isAuthenticated && PUBLIC_ROUTES.includes(pathname)) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, pathname, router])

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // No mostrar nada si está redirigiendo
  if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
    return null
  }

  return <>{children}</>
}
```

**Uso en Layout:**

```typescript
// app/layout.tsx
import { AuthProvider } from '@/contexts/auth-context'
import { AuthCheck } from '@/components/auth/auth-check'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <AuthCheck>
            {children}
          </AuthCheck>
        </AuthProvider>
      </body>
    </html>
  )
}
```

---

### FASE 2: Actualizar Auth Context (15 min)

**Objetivo:** Cambiar redirect de dashboard → home (página principal)

**Archivo:** `contexts/auth-context.tsx`

**Cambios:**

```typescript
// Línea ~53 - Función login
const login = async (email: string, password: string) => {
  setIsLoading(true)

  await new Promise((resolve) => setTimeout(resolve, 800))

  const mockUser: User = {
    id: "1",
    email: email,
    name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
  }

  setUser(mockUser)
  localStorage.setItem("santiago_user", JSON.stringify(mockUser))
  setIsLoading(false)
  router.push("/") // CAMBIAR: era "/dashboard"
}

// Línea ~73 - Función register
const register = async (name: string, email: string, password: string) => {
  setIsLoading(true)

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const mockUser: User = {
    id: Date.now().toString(),
    email: email,
    name: name,
  }

  setUser(mockUser)
  localStorage.setItem("santiago_user", JSON.stringify(mockUser))
  setIsLoading(false)
  router.push("/") // CAMBIAR: era "/dashboard"
}

// Línea ~91 - Función loginWithGoogle
const loginWithGoogle = async () => {
  setIsLoading(true)

  await new Promise((resolve) => setTimeout(resolve, 1500))

  const mockUser: User = {
    id: Date.now().toString(),
    email: "usuario@gmail.com",
    name: "Usuario de Google",
  }

  setUser(mockUser)
  localStorage.setItem("santiago_user", JSON.stringify(mockUser))
  setIsLoading(false)
  router.push("/") // CAMBIAR: era "/dashboard"
}
```

---

### FASE 3: Login Page con Banner (1-1.5 horas)

**Objetivo:** Página de login mejorada con información de la app

**Archivo:** `app/login/page.tsx`

**Estructura:**

```tsx
<div className="min-h-screen flex">
  {/* Banner Lateral - Hidden en mobile */}
  <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700">
    {/* Logo + Título */}
    {/* Lista de beneficios */}
    {/* Imagen ilustrativa */}
  </div>

  {/* Formulario Login - Full width en mobile */}
  <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
    {/* Card con formulario */}
  </div>
</div>
```

**Banner Content:**

```typescript
const benefits = [
  {
    icon: "🗺️",
    title: "Descubre Lugares Auténticos",
    description: "Explora negocios locales únicos en Santiago"
  },
  {
    icon: "🎯",
    title: "Crea Rutas Personalizadas",
    description: "Planifica tu día visitando emprendimientos locales"
  },
  {
    icon: "💡",
    title: "Apoya la Economía Local",
    description: "Contribuye al crecimiento de tu barrio"
  }
]
```

---

### FASE 4: Register Page con Banner (1-1.5 horas)

**Objetivo:** Página de registro con información de beneficios

**Archivo:** `app/register/page.tsx`

**Estructura:** Similar a login pero con:
- Más campos (nombre, email, contraseña, confirmar contraseña)
- Indicador de fortaleza de contraseña (YA EXISTE)
- Checkbox de términos
- Banner con diferentes beneficios

**Banner Content:**

```typescript
const registerBenefits = [
  {
    icon: "🎁",
    title: "Cuenta 100% Gratuita",
    description: "Sin costos ocultos, siempre gratis"
  },
  {
    icon: "⭐",
    title: "Guarda tus Favoritos",
    description: "Crea listas de negocios que te gustan"
  },
  {
    icon: "📱",
    title: "Acceso desde Cualquier Lugar",
    description: "Sincroniza tus datos en todos tus dispositivos"
  }
]
```

---

### FASE 5: Componentes Reutilizables (30 min)

**Objetivo:** Extraer componentes comunes

#### 5.1 Banner Component

```typescript
// components/auth/info-banner.tsx
interface BannerProps {
  title: string
  subtitle: string
  benefits: Array<{
    icon: string
    title: string
    description: string
  }>
  imageSrc?: string
}

export function InfoBanner({ title, subtitle, benefits, imageSrc }: BannerProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white p-12">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-2xl">SG</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
            </div>
          </div>
          <p className="text-indigo-100 text-lg">{subtitle}</p>
        </div>

        {/* Benefits List */}
        <div className="space-y-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                {benefit.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                <p className="text-indigo-100 text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Optional Image */}
        {imageSrc && (
          <div className="mt-12">
            <img
              src={imageSrc}
              alt="Illustration"
              className="w-full max-w-md mx-auto opacity-90"
            />
          </div>
        )}
      </div>
    </div>
  )
}
```

#### 5.2 Auth Layout Wrapper

```typescript
// components/auth/auth-layout.tsx
interface AuthLayoutProps {
  children: React.ReactNode
  banner: React.ReactNode
  showBannerOnMobile?: boolean
}

export function AuthLayout({ 
  children, 
  banner, 
  showBannerOnMobile = false 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Banner - Hidden on mobile by default */}
      <div className={`${showBannerOnMobile ? '' : 'hidden'} lg:flex lg:w-1/2`}>
        {banner}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
```

---

## 📂 ESTRUCTURA DE ARCHIVOS

### Archivos Nuevos (2):
```
components/auth/
├── auth-check.tsx           # NEW - Verificación de sesión
└── info-banner.tsx          # NEW - Banner informativo
└── auth-layout.tsx          # NEW - Layout compartido
```

### Archivos Modificados (3):
```
app/layout.tsx               # MODIFY - Agregar AuthCheck
contexts/auth-context.tsx    # MODIFY - Cambiar redirects a "/"
app/login/page.tsx           # MODIFY - Agregar banner
app/register/page.tsx        # MODIFY - Agregar banner
```

---

## ⏱️ CRONOGRAMA

| Fase | Tarea | Tiempo | Prioridad |
|------|-------|---------|-----------|
| 1 | AuthCheck Component | 30 min | 🔴 Alta |
| 2 | Actualizar Auth Context | 15 min | 🔴 Alta |
| 3 | Login Page con Banner | 1-1.5h | 🟡 Media |
| 4 | Register Page con Banner | 1-1.5h | 🟡 Media |
| 5 | Componentes Reutilizables | 30 min | 🟢 Baja |

**Total: 3-4 horas**

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1 - Auth Check
- [ ] Crear `AuthCheck` component
- [ ] Integrar en `app/layout.tsx`
- [ ] Probar redirección a `/login`
- [ ] Probar loading state

### Fase 2 - Auth Context
- [ ] Cambiar redirect en `login()` → `/`
- [ ] Cambiar redirect en `register()` → `/`
- [ ] Cambiar redirect en `loginWithGoogle()` → `/`
- [ ] Probar flujo completo

### Fase 3 - Login Mejorado
- [ ] Crear `InfoBanner` component
- [ ] Definir beneficios del login
- [ ] Layout responsive (desktop/mobile)
- [ ] Mantener funcionalidad actual

### Fase 4 - Register Mejorado
- [ ] Reutilizar `InfoBanner`
- [ ] Definir beneficios del registro
- [ ] Layout responsive
- [ ] Mantener validaciones actuales

### Fase 5 - Componentes
- [ ] Extraer banner a componente
- [ ] Crear `AuthLayout` wrapper
- [ ] Refactorizar login/register

---

## 🎨 DISEÑO - BENEFICIOS

### Login Benefits:
```typescript
const loginBenefits = [
  {
    icon: "🗺️",
    title: "Descubre Santiago Auténtico",
    description: "Explora lugares únicos y emprendimientos locales verificados"
  },
  {
    icon: "🎯",
    title: "Rutas Personalizadas",
    description: "Crea itinerarios adaptados a tus gustos y preferencias"
  },
  {
    icon: "💡",
    title: "Apoya lo Local",
    description: "Contribuye al crecimiento de la economía de tu barrio"
  },
  {
    icon: "⭐",
    title: "Descuentos Exclusivos",
    description: "Accede a ofertas especiales en negocios aliados"
  }
]
```

### Register Benefits:
```typescript
const registerBenefits = [
  {
    icon: "🎁",
    title: "Totalmente Gratuito",
    description: "Crea tu cuenta sin costos, ahora y siempre"
  },
  {
    icon: "🔖",
    title: "Guarda tus Favoritos",
    description: "Marca y organiza tus lugares preferidos"
  },
  {
    icon: "📱",
    title: "Sincronización en la Nube",
    description: "Accede desde cualquier dispositivo, en cualquier momento"
  },
  {
    icon: "🌟",
    title: "Comunidad Activa",
    description: "Únete a miles de exploradores urbanos"
  }
]
```

---

## 🎯 RESULTADO ESPERADO

### Flujo Completo:

1. **Usuario abre la app** → Ve `/login` (no puede acceder a nada más)

2. **Usuario hace login/register** → 
   - Se guarda en localStorage + contexto
   - Redirect a `/` (página principal)

3. **Usuario navega por la app** →
   - Navbar muestra su nombre y avatar
   - Puede acceder a todas las rutas (/map-interactive, /builder, etc)
   - Dashboard sigue disponible en navbar

4. **Usuario hace logout** →
   - Se limpia localStorage
   - Redirect a `/login`

### Sin Backend:
- ✅ Cualquier email/contraseña es válida (modo desarrollo)
- ✅ Se muestra el banner de "Modo desarrollo" (opcional, puede quitarse)
- ✅ Usuario persiste en localStorage
- ✅ Al recargar página, mantiene sesión

---

## 📝 NOTAS IMPORTANTES

### Estética Actual:
- ✅ Mantener gradientes indigo/purple
- ✅ Mantener animaciones blob existentes
- ✅ Mantener tipografía y espaciado
- ✅ Agregar banner sin romper diseño

### Simplicidad:
- ✅ No agregar dependencias nuevas
- ✅ Usar componentes existentes (Card, Button, Input)
- ✅ Código limpio y mantenible
- ✅ Reutilizar lógica actual

### Mobile First:
- ✅ Banner oculto en mobile (solo mostrar en desktop)
- ✅ Formulario full-width en mobile
- ✅ Logo pequeño arriba en mobile

---

## 🚀 PRÓXIMOS PASOS

1. **Implementar Fase 1 y 2** - AuthCheck + Redirects (45 min)
2. **Probar flujo básico** - Login → Home → Logout (15 min)
3. **Implementar Fase 3** - Login con banner (1-1.5h)
4. **Implementar Fase 4** - Register con banner (1-1.5h)
5. **Testing completo** - Probar en mobile y desktop (30 min)

**Tiempo total: 3-4 horas**

---

**Última actualización:** Diciembre 2024  
**Estado:** 📋 Planificado - Sin dependencias de backend  
**Complejidad:** Baja - Cambios mínimos
