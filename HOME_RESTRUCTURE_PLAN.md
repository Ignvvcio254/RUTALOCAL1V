# 🏠 Plan de Reestructuración: Página de Inicio Estilo Uber Eats

## 📋 Resumen Ejecutivo

Transformar la página raíz `/` de RutaLocal en una experiencia de exploración inspirada en Uber Eats, optimizada para descubrir **Hospedaje, Gastronomía y Turismo** local de forma intuitiva y visual, **manteniendo las funcionalidades clave** de acceso rápido a Mapa, Creación de Rutas y RutaBot.

---

## 🎯 Objetivos del Rediseño

1. **Exploración Inmediata**: El usuario puede comenzar a explorar sin fricción desde el primer segundo
2. **Filtrado Inteligente**: Sistema de filtros de 3 niveles (Principal → Experiencia → Atributos)
3. **Tarjetas Atractivas**: Diseño tipo feed con negocios destacados (similar a Uber Eats)
4. **Navegación Sticky**: Filtros siempre visibles mientras se hace scroll
5. **Acciones Rápidas Integradas**: Mantener botones de Mapa, Crear Ruta y RutaBot adaptados a la nueva estética
6. **Responsive & Mobile-First**: Optimizado para dispositivos móviles

---

## 🏗️ Arquitectura de la Nueva Estructura

```
/ (Página Raíz)
├── Navbar (Sticky Top)
│   ├── Logo + Ubicación actual
│   ├── Acciones Rápidas: [🗺️ Mapa] [🛤️ Crear Ruta] [🤖 RutaBot]
│   ├── Notificaciones
│   └── Avatar/Login
│
├── Filtros Principales (Sticky, debajo del Navbar)
│   └── [Todos] [Hospedaje] [Gastronomía] [Turismo]
│
├── Filtros de Experiencia (Scroll horizontal)
│   ├── Para Hospedaje: [Boutique/Lujo] [Hostal/Económico] [Familiar] [Pet Friendly]
│   ├── Para Gastronomía: [Tradicional] [Vegano] [Cafeterías] [Street Food]
│   └── Para Turismo: [Historia] [Naturaleza] [Aventura] [Miradores]
│
├── Filtros de Atributos (Pills)
│   └── [Accesible] [⭐⭐⭐⭐+] [Abierto Ahora] [Para llevar] [Ofertas]
│
└── Feed de Negocios Destacados (Grid infinito)
│   └── [NegocioCard] [NegocioCard] [NegocioCard]...
│       └── Cada card con botón "+ Agregar a Ruta"
│
└── RutaBot (Modal flotante abajo a la izquierda)
    └── Ícono flotante que abre chat modal
```

---

## 🎨 Diseño de Componentes

### 1. **Navbar Mejorado con Acciones Rápidas** (`components/navbar-home.tsx`)

**Características:**
- **Logo + Ubicación** del usuario (ej: "Providencia ▾")
- **Acciones Rápidas Centrales**: 3 botones compactos para funciones principales
  - 🗺️ **Ver Mapa** → Redirige a `/map-interactive`
  - 🛤️ **Crear Ruta** → Redirige a `/builder`
  - 🤖 **RutaBot** → Abre modal del chatbot (scroll al componente)
- **Búsqueda** rápida (modal al hacer click)
- **Notificaciones** con contador
- **Avatar/Login**

```tsx
┌────────────────────────────────────────────────────────────────────┐
│ 🗺️RL  📍Providencia▾  [🗺️ Mapa][🛤️ Ruta][🤖 Bot]  🔍 🔔(1) 👤 │
└────────────────────────────────────────────────────────────────────┘
```

**Responsive:**
- **Desktop**: Todos los botones visibles en línea
- **Tablet**: Botones con iconos + texto reducido
- **Mobile**: Solo iconos, texto en tooltip

---

### 2. **Filtros Principales** (`components/filters/main-category-filter.tsx`)

Sistema de pestañas sticky que define el tipo de búsqueda principal.

```tsx
┌─────────────────────────────────────────────────────┐
│ [🌐 Todos] [🏠 Hospedaje] [🍽️ Gastronomía] [🎒 Turismo] │
└─────────────────────────────────────────────────────┘
```

**Estado:**
- `selectedCategory: 'all' | 'hospedaje' | 'gastronomia' | 'turismo'`

---

### 3. **Filtros de Experiencia** (`components/filters/experience-filter.tsx`)

Scroll horizontal con iconos + texto, cambia dinámicamente según categoría principal.

**Cuando `selectedCategory = 'hospedaje'`:**
```tsx
┌──────────────────────────────────────────────────────────────────┐
│ 👁️ [✨ Boutique/Lujo] [💰 Hostal/Económico] [👨‍👩‍👧 Familiar] [🐾 Pet Friendly] │
└──────────────────────────────────────────────────────────────────┘
```

**Cuando `selectedCategory = 'gastronomia'`:**
```tsx
┌──────────────────────────────────────────────────────────────────┐
│ 👁️ [🇨🇱 Tradicional] [🥗 Vegano] [☕ Cafeterías] [🌮 Street Food] │
└──────────────────────────────────────────────────────────────────┘
```

**Cuando `selectedCategory = 'turismo'`:**
```tsx
┌──────────────────────────────────────────────────────────────────┐
│ 👁️ [🏛️ Historia] [🌲 Naturaleza] [⛰️ Aventura] [🌅 Miradores] │
└──────────────────────────────────────────────────────────────────┘
```

---

### 4. **Filtros de Atributos** (`components/filters/attribute-filter.tsx`)

Pills de acción rápida aplicables a cualquier categoría.

```tsx
┌────────────────────────────────────────────────────────────┐
│ [♿ Accesible] [⭐⭐⭐⭐ 4.0+] [🟢 Abierto] [🎁 Ofertas] [⚡ -30min] │
└────────────────────────────────────────────────────────────┘
```

---

### 5. **Feed de Negocios** (`components/business-feed.tsx`)

Grid de tarjetas (NegocioCard) con información destacada y **botón de acción rápida**.

**Cada tarjeta muestra:**
- Imagen del negocio
- Nombre + Categoría badge
- Calificación ⭐ + N° reviews
- Distancia del usuario
- Características (ej: "Abierto", "Pet Friendly", "Accesible")
- Precio promedio ($ - $$$$)
- Promociones destacadas (si aplica)
- **Botón "+ Agregar a Ruta"** (hover action)

```tsx
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   [Imagen]      │  │   [Imagen]      │  │   [Imagen]      │
│  [+ Ruta] 🗺️   │  │  [+ Ruta] 🗺️   │  │  [+ Ruta] 🗺️   │
│                 │  │                 │  │                 │
│ Café Vinilo     │  │ Hostal Centro   │  │ Tour Bellavista │
│ 🍽️ CAFÉ        │  │ 🏠 HOSPEDAJE   │  │ 🎒 TURISMO     │
│ ⭐ 4.8 (127)   │  │ ⭐ 4.9 (89)    │  │ ⭐ 5.0 (156)   │
│ 📍 800m        │  │ 📍 1.2km       │  │ 📍 Desde aquí  │
│ 🟢 Abierto     │  │ ♿ Accesible    │  │ ⏱️ 2.5 hrs     │
│ $$ · ☕ WiFi   │  │ $ · 🐾 Pets    │  │ $$ · 👨‍🏫 Guiado │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Interacciones de Tarjeta:**
- **Click en imagen/título** → Modal con detalles completos
- **Click en "+ Agregar a Ruta"** → Agregar negocio a ruta activa
- **Click en icono 🗺️** → Ver ubicación en mapa 3D

---

### 6. **RutaBot Modal Flotante** (`components/ruta-bot.tsx`)

**MANTENER funcionalidad existente** con mejoras visuales:

**Posición:** Fijo, abajo a la izquierda (z-index alto)

```tsx
Desktop/Tablet:
┌────────────────────────┐
│                        │
│  [Feed de negocios]    │
│                        │
│                        │
└────────────────────────┘
🤖 ← Botón flotante (bottom-left)
    Click → Abre modal chat

Mobile:
┌──────────────┐
│              │
│  [Feed]      │
│              │
│              │
└──────────────┘
🤖 ← Más pequeño
```

**Características:**
- **Ícono animado** con efecto de "breathing" (pulso suave)
- **Badge "Online 24/7"** al lado del ícono
- **Modal expandible** al hacer click (mantener lógica actual)
- **Acceso rápido** desde navbar también (duplicado para UX)

---

## 🗂️ Estructura de Archivos a Crear/Modificar

```
/app/page.tsx                                    [MODIFICAR - Layout principal]
├── components/
│   ├── navbar-home.tsx                          [CREAR - Navbar con acciones rápidas]
│   ├── filters/
│   │   ├── main-category-filter.tsx            [CREAR]
│   │   ├── experience-filter.tsx               [CREAR]
│   │   ├── attribute-filter.tsx                [CREAR]
│   │   └── filter-context.tsx                  [CREAR - Context API]
│   │
│   ├── business-feed.tsx                       [CREAR - Feed principal]
│   ├── negocio-card.tsx                        [MODIFICAR - Agregar botón "+ Ruta"]
│   ├── ruta-bot.tsx                            [MANTENER - Solo ajustes visuales]
│   │
│   └── quick-actions/
│       └── quick-action-buttons.tsx            [CREAR - Botones Mapa/Ruta/Bot]
│
├── lib/
│   ├── filters/
│   │   ├── filter-config.ts                    [CREAR - Configuración de filtros]
│   │   └── filter-utils.ts                     [CREAR - Utilidades]
│   │
│   └── data/
│       └── mock-businesses.ts                  [CREAR - Data de prueba]
```

---

## 📊 Configuración de Filtros

### `lib/filters/filter-config.ts`

```typescript
export const MAIN_CATEGORIES = {
  all: {
    id: 'all',
    label: 'Todos',
    icon: '🌐',
    description: 'Explorar todo'
  },
  hospedaje: {
    id: 'hospedaje',
    label: 'Hospedaje',
    icon: '🏠',
    description: 'Lugares para descansar'
  },
  gastronomia: {
    id: 'gastronomia',
    label: 'Gastronomía',
    icon: '🍽️',
    description: 'Comida y bebida'
  },
  turismo: {
    id: 'turismo',
    label: 'Turismo',
    icon: '🎒',
    description: 'Experiencias y actividades'
  }
} as const;

export const EXPERIENCE_FILTERS = {
  hospedaje: [
    { id: 'boutique', label: 'Boutique/Lujo', icon: '✨' },
    { id: 'economico', label: 'Hostal/Económico', icon: '💰' },
    { id: 'familiar', label: 'Familiar/Cabañas', icon: '👨‍👩‍👧' },
    { id: 'pet-friendly', label: 'Pet Friendly', icon: '🐾' },
  ],
  gastronomia: [
    { id: 'tradicional', label: 'Cocina Tradicional', icon: '🇨🇱' },
    { id: 'vegano', label: 'Vegano/Saludable', icon: '🥗' },
    { id: 'cafeterias', label: 'Cafeterías/Brunch', icon: '☕' },
    { id: 'street-food', label: 'Street Food', icon: '🌮' },
  ],
  turismo: [
    { id: 'historia', label: 'Historia y Cultura', icon: '🏛️' },
    { id: 'naturaleza', label: 'Naturaleza/Outdoors', icon: '🌲' },
    { id: 'aventura', label: 'Aventura/Deporte', icon: '⛰️' },
    { id: 'miradores', label: 'Miradores/Paisajes', icon: '🌅' },
  ],
} as const;

export const ATTRIBUTE_FILTERS = [
  { id: 'accessible', label: 'Accesible', icon: '♿' },
  { id: 'top-rated', label: '4.0+ ⭐', icon: '⭐' },
  { id: 'open-now', label: 'Abierto Ahora', icon: '🟢' },
  { id: 'offers', label: 'Ofertas', icon: '🎁' },
  { id: 'quick', label: 'Menos 30min', icon: '⚡' },
] as const;
```

---

## 🎭 Estado Global con Context API

### `components/filters/filter-context.tsx`

```typescript
interface FilterState {
  mainCategory: 'all' | 'hospedaje' | 'gastronomia' | 'turismo';
  experiences: string[];
  attributes: string[];
  searchQuery: string;
  location: string;
}

interface FilterContextType {
  filters: FilterState;
  setMainCategory: (category: FilterState['mainCategory']) => void;
  toggleExperience: (id: string) => void;
  toggleAttribute: (id: string) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}
```

---

## 🚀 Fases de Implementación

### **Fase 1: Infraestructura Base**
1. Crear configuración de filtros (`filter-config.ts`)
2. Crear Context API para estado de filtros (`filter-context.tsx`)
3. Crear utilidades de filtrado (`filter-utils.ts`)
4. Crear data de prueba (`mock-businesses.ts`)

### **Fase 2: Navbar y Acciones Rápidas**
1. Crear `NavbarHome.tsx` con ubicación y acciones rápidas
2. Crear componente `QuickActionButtons.tsx` (Mapa/Ruta/Bot)
3. Integrar lógica de scroll al RutaBot desde navbar
4. Agregar responsive para mobile/tablet/desktop

### **Fase 3: Sistema de Filtros**
1. Crear `MainCategoryFilter.tsx` (Todos/Hospedaje/Gastronomía/Turismo)
2. Crear `ExperienceFilter.tsx` (filtros secundarios dinámicos)
3. Crear `AttributeFilter.tsx` (pills de atributos)
4. Integrar todos con Context API y layout sticky

### **Fase 4: Feed de Negocios**
1. Modificar `NegocioCard.tsx` para agregar botón "+ Agregar a Ruta"
2. Crear `BusinessFeed.tsx` con grid responsive
3. Implementar lógica de filtrado en el feed
4. Agregar interacciones (modal, vista mapa, agregar a ruta)

### **Fase 5: RutaBot Flotante**
1. Mantener componente `RutaBot.tsx` existente
2. Ajustar estilos para nueva estética (breathing animation)
3. Agregar badge "Online 24/7"
4. Verificar funcionalidad de scroll desde navbar

### **Fase 6: Integración Final**
1. Modificar `/app/page.tsx` con nuevo layout
2. Conectar todos los componentes
3. Configurar layout sticky para navbar y filtros
4. Testing responsive completo

### **Fase 7: Optimizaciones**
1. Lazy loading para imágenes
2. Infinite scroll para feed
3. Animaciones suaves (Framer Motion)
4. Performance optimization

---

## 💡 Mejoras Propuestas vs Uber Eats

### ✅ Conservamos de Uber Eats:
- Sistema de filtros de múltiples niveles
- Tarjetas visuales con información clave
- Navegación sticky
- Pills de acción rápida
- Feed tipo scroll infinito

### 🚀 Mejoramos para RutaLocal:
1. **Geolocalización Real**: Mostrar distancia precisa desde ubicación actual
2. **Filtros por Dimensión**: Hospedaje/Gastronomía/Turismo en lugar de tipos de comida
3. **Atributos de Accesibilidad**: Importante para turismo inclusivo
4. **Integración con Mapa 3D**: Click en tarjeta → abrir en mapa 3D interactivo
5. **Modo Ruta**: Botón "+ Agregar a Ruta" en cada tarjeta
6. **Acciones Rápidas en Navbar**: Acceso directo a Mapa, Crear Ruta y RutaBot
7. **RutaBot AI Asistente**: Modal flotante con IA para planificación personalizada
8. **Horarios Dinámicos**: "Abierto ahora" actualizado en tiempo real
9. **Verificación Local**: Badge "Verificado por Local" para negocios auténticos
10. **Multiidioma**: Preparado para inglés/español (importante para turistas)

---

## 📱 Diseño Responsive

### Mobile (< 768px)
- Filtros en scroll horizontal
- Tarjetas en 1 columna
- Navbar compacto
- Bottom sheet para filtros avanzados

### Tablet (768px - 1024px)
- Tarjetas en 2 columnas
- Filtros sticky visibles

### Desktop (> 1024px)
- Tarjetas en 3-4 columnas
- Sidebar opcional con mapa preview
- Filtros siempre visibles

---

## 🎨 Paleta de Colores

```css
/* Hospedaje */
--hospedaje-primary: #3B82F6; /* Blue */
--hospedaje-light: #DBEAFE;

/* Gastronomía */
--gastronomia-primary: #F59E0B; /* Amber */
--gastronomia-light: #FEF3C7;

/* Turismo */
--turismo-primary: #10B981; /* Green */
--turismo-light: #D1FAE5;

/* General */
--accent: #8B5CF6; /* Purple - para destacados */
--background: #F9FAFB;
--text-primary: #111827;
--text-secondary: #6B7280;
```

---

## 📊 Métricas de Éxito

1. **Tiempo hasta primera interacción**: < 2 segundos
2. **Tasa de clics en tarjetas**: > 40%
3. **Uso de filtros**: > 60% de usuarios aplican al menos 1 filtro
4. **Mobile usability score**: > 90/100
5. **Tasa de conversión a mapa/ruta**: > 25%

---

## 🔄 Comparación Visual

### **ANTES** (Actual)
```
┌─────────────────────────────────────────┐
│         Navbar                          │
├─────────────────────────────────────────┤
│                                         │
│    🗺️  Descubre Santiago Auténtico     │
│                                         │
│    [Barra de búsqueda grande]          │
│                                         │
│    [☕ Cafés] [🎨 Arte] [🏠 Hostales]  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  📦 ¿Cómo quieres explorar?            │
│  [Explorar Mapa] [Crear Ruta] [Bot]   │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  🤖 Recomendado para ti ahora          │
│  [Card] [Card] [Card]                  │
│                                         │
└─────────────────────────────────────────┘
```

### **DESPUÉS** (Propuesto)
```
┌───────────────────────────────────────────────────────┐
│ 🗺️RL 📍Providencia▾ [🗺️Mapa][🛤️Ruta][🤖Bot] 🔍🔔👤│ ← Navbar sticky
├───────────────────────────────────────────────────────┤
│ [🌐 Todos][🏠 Hospedaje][🍽️ Gastronomía][🎒 Turismo]│ ← Filtros principales
├───────────────────────────────────────────────────────┤
│ 👁️ [✨ Boutique][💰 Económico][��‍👩‍👧 Familiar][🐾 Pet]  │ ← Filtros experiencia
├───────────────────────────────────────────────────────┤
│ [♿ Accesible][⭐4.0+][🟢 Abierto][🎁 Ofertas]        │ ← Atributos
├───────────────────────────────────────────────────────┤
│                                                       │
│  ✨ Destacados en RutaLocal                          │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ [Imagen] │  │ [Imagen] │  │ [Imagen] │          │
│  │ [+Ruta]🗺│  │ [+Ruta]🗺│  │ [+Ruta]🗺│          │
│  │ Café     │  │ Hostal   │  │ Tour     │          │
│  │ ⭐4.8    │  │ ⭐4.9    │  │ ⭐5.0    │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                       │
│  [Cargar más resultados...]                          │
│                                                       │
│                                       🤖 ← RutaBot   │
│                                       (flotante)      │
└───────────────────────────────────────────────────────┘
```

---

## 🧪 Plan de Testing

1. **Test de Usabilidad**:
   - Usuarios puedan encontrar un negocio en < 30 segundos
   - Filtros se apliquen sin latencia perceptible

2. **Test de Performance**:
   - Lighthouse score > 90
   - First Contentful Paint < 1.5s
   - Time to Interactive < 3.5s

3. **Test Responsive**:
   - Verificar en iPhone SE, iPhone 14, iPad, Desktop
   - Scroll horizontal fluido en móvil
   - Touch targets > 44px

4. **Test de Accesibilidad**:
   - WCAG 2.1 AA compliance
   - Navegación por teclado
   - Screen reader friendly

---

## 📝 Notas de Implementación

1. **Priorizar Mobile**: 70% del tráfico será móvil
2. **Lazy Loading**: Imágenes con `loading="lazy"` y placeholders
3. **Infinite Scroll**: Implementar con `IntersectionObserver`
4. **Analytics**: Trackear uso de cada filtro
5. **A/B Testing**: Probar orden de filtros y layout de tarjetas

---

## 🎉 Resultado Esperado

Una experiencia de homepage que permite:
- ✅ Exploración inmediata sin fricción
- ✅ Descubrimiento visual de negocios tipo Uber Eats
- ✅ Filtrado intuitivo por dimensiones de turismo (Hospedaje/Gastronomía/Turismo)
- ✅ Acceso rápido a funciones clave: Ver Mapa, Crear Ruta, RutaBot
- ✅ Agregar negocios a rutas desde cada tarjeta
- ✅ RutaBot flotante siempre disponible (abajo izquierda)
- ✅ Diseño moderno y profesional competitivo con apps líderes

---

## 🚦 Criterios de Éxito Final

- [ ] Usuario puede aplicar filtros en < 5 segundos
- [ ] Feed carga primera vista en < 2 segundos
- [ ] > 60% de usuarios interactúan con filtros
- [ ] Botones de acción rápida (Mapa/Ruta/Bot) son visibles y accesibles
- [ ] RutaBot modal funciona correctamente desde navbar y botón flotante
- [ ] Tasa de rebote < 30%
- [ ] Mobile usability score > 90
- [ ] Feedback positivo de 8/10 usuarios en pruebas

---

## 📝 Resumen de Funcionalidades Preservadas

### ✅ Mantenemos:
1. **Ver Mapa** → Acceso directo desde navbar a `/map-interactive`
2. **Crear Ruta** → Acceso directo desde navbar a `/builder`
3. **RutaBot** → Doble acceso:
   - Botón en navbar (scroll + abrir)
   - Ícono flotante abajo izquierda (siempre visible)
4. **Agregar a Ruta** → Botón en cada tarjeta de negocio
5. **Modal de RutaBot** → Funcionalidad existente preservada

### 🆕 Agregamos:
1. Sistema de filtros de 3 niveles (Uber Eats style)
2. Feed infinito de negocios
3. Navegación sticky
4. Acciones rápidas integradas en navbar
5. Animaciones y transiciones suaves

---

**🎯 Plan Listo para Implementación**

El plan está completo y sólido. Podemos comenzar por:
- **Fase 1**: Infraestructura base (configuración de filtros, Context API)
- **Fase 2**: Navbar con acciones rápidas (resultados visuales inmediatos)
- **Tu elección**: ¿Por dónde prefieres empezar?
