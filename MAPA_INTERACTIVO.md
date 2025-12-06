# 🗺️ Especificaciones del Mapa Interactivo - SantiaGO

**Versión**: 2.0 - Mapbox GL con 3D Buildings
**Fecha**: 5 de Diciembre, 2025

---

## 📋 Decisiones de Diseño

### 1. Proveedor de Mapas
**Mapbox GL JS** (Free Tier)
- ✅ 50,000 cargas de mapa gratis/mes
- ✅ Edificios 3D incluidos
- ✅ Estilo personalizable
- ✅ Mejor rendimiento que Leaflet
- ✅ API similar a Google Maps

**Token**: Obtener en https://account.mapbox.com/

---

### 2. Geolocalización
**Flujo de Usuario**:
```
1. Usuario entra → Detecta ciudad por IP
2. Mostrar diálogo: "¿Permitir acceso a tu ubicación?"
3. Si acepta → Zoom preciso a ubicación actual
4. Si rechaza → Centrar en Plaza de Armas, Santiago
5. Mostrar negocios en radio de 3km inicial
```

---

### 3. Categorías de Negocios

**Todas las categorías con iconos únicos**:

| Categoría | Icono | Color | Destacado |
|-----------|-------|-------|-----------|
| Restaurante | 🍽️ | Naranja | ⭐ Dorado |
| Café | ☕ | Marrón | ⭐ Dorado |
| Bar | 🍺 | Rojo | ⭐ Dorado |
| Panadería | 🥖 | Amarillo | ⭐ Dorado |
| Artesanía | 🎨 | Púrpura | ⭐ Dorado |
| Librería | 📚 | Azul | ⭐ Dorado |
| Galería | 🖼️ | Rosa | ⭐ Dorado |
| Hotel | 🏨 | Verde | ⭐ Dorado |
| Hostal | 🛏️ | Verde claro | ⭐ Dorado |
| Tour | 🎒 | Índigo | ⭐ Dorado |
| Mercado | 🛒 | Lime | ⭐ Dorado |
| Tienda | 🏪 | Cyan | ⭐ Dorado |

**Negocios Destacados**:
- Pin dorado con animación pulse
- Badge "Verificado"
- Aparecen primero en búsquedas

---

### 4. Funcionalidades Implementadas

#### Navegación del Mapa
- [x] Zoom in/out con botones y rueda
- [x] Arrastrar para mover
- [x] Pitch/Tilt para vista 3D
- [x] Rotación del mapa
- [x] Doble click para zoom
- [x] Botón "Mi ubicación" (geolocalización)

#### Búsqueda Estilo Uber Eats/Airbnb
```typescript
// Barra de búsqueda superior flotante
[🔍 Buscar restaurantes, cafés, hoteles...]  [Filtros 🎛️]

Resultados:
┌─────────────────────────────────────┐
│                                     │
│         MAPA CON MARCADORES         │
│                                     │
└─────────────────────────────────────┘
┌───────────────────────────────────────┐
│  ◀  [Card 1] [Card 2] [Card 3]  ▶    │
│     Scroll horizontal de resultados    │
└───────────────────────────────────────┘
```

#### Filtros Avanzados
- [x] Por categoría (multi-select)
- [x] Por rating (4+, 4.5+)
- [x] Por distancia (500m, 1km, 2km, 5km)
- [x] Por precio ($, $$, $$$)
- [x] Abierto ahora
- [x] Características (WiFi, Pet-friendly, Terraza)

#### Marcadores Inteligentes
- [x] Clustering cuando hay muchos (>10 en área)
- [x] Iconos personalizados por categoría
- [x] Animación al hover
- [x] Popup con info básica
- [x] Click para ver detalles completos

#### Visualización 3D
- [x] Edificios en 3D (Mapbox default)
- [x] Vista isométrica con pitch
- [x] Sombras de edificios
- [x] Efectos de día/noche

---

### 5. Información por Negocio

#### Popup Pequeño (Hover)
```typescript
┌──────────────────────┐
│  📷 Foto             │
│  Café La Bohemia     │
│  ⭐⭐⭐⭐⭐ 4.8       │
│  ☕ Café • $$        │
│  📍 800m • Abierto   │
│  [Ver más]           │
└──────────────────────┘
```

#### Panel Lateral (Click)
```typescript
┌─────────────────────────────┐
│  [Galería de 5 fotos]       │
│  Café La Bohemia            │
│  ⭐⭐⭐⭐⭐ 4.8 (127)       │
│  ☕ Café • $$ • 800m        │
│  ✅ Abierto • Cierra 22:00  │
│  ─────────────────────      │
│  📍 Dirección completa      │
│  📞 +56 2 2345 6789         │
│  🌐 www.labohemia.cl        │
│  ─────────────────────      │
│  ℹ️ Descripción...          │
│  ─────────────────────      │
│  ✨ WiFi, Terraza, Pet OK   │
│  ─────────────────────      │
│  💬 Reviews (3 últimos)     │
│  ─────────────────────      │
│  [❤️ Favorito]              │
│  [➕ Agregar a Ruta]        │
│  [🧭 Cómo llegar]           │
│  [📤 Compartir]             │
└─────────────────────────────┘
```

---

### 6. Layout del Mapa (Responsive)

#### Desktop
```
┌───────────────────────────────────────────────┐
│ [Logo]  [🔍 Búsqueda amplia...]    [Usuario] │
├───────────────────────────────────────────────┤
│                                               │
│                                               │
│              MAPA 100% HEIGHT                 │
│           (con edificios 3D)                  │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │ ◀ [Card] [Card] [Card] [Card] ▶     │    │
│  │   Carrusel horizontal resultados     │    │
│  └──────────────────────────────────────┘    │
└───────────────────────────────────────────────┘

[Botones flotantes]
┌─┐  Zoom +
├─┤  Zoom -
├─┤  Mi ubicación
├─┤  3D View
└─┘  Filtros
```

#### Mobile
```
┌─────────────────┐
│ [Logo] [Search] │
├─────────────────┤
│                 │
│      MAPA       │
│   FULLSCREEN    │
│                 │
│                 │
└─────────────────┘
     ↑ Swipe ↑
┌─────────────────┐
│  [Card Detail]  │
│  Deslizable     │
└─────────────────┘

[Botón flotante]
🗺️/📋 Toggle Mapa/Lista
```

---

### 7. Búsqueda Inteligente

#### Tipo 1: Búsqueda por Texto
```typescript
Usuario escribe: "café con terraza providencia"

Procesamiento:
1. Detectar keywords:
   - "café" → Categoría
   - "terraza" → Característica
   - "providencia" → Barrio

2. Filtrar mapa:
   - Mostrar solo cafés
   - Con característica "terraza"
   - En Providencia

3. Resultados en tiempo real
```

#### Tipo 2: Búsqueda por Categoría
```typescript
[Dropdown de categorías]
- Todos los tipos
- 🍽️ Restaurantes
- ☕ Cafés
- 🏨 Alojamiento
- 🎨 Artesanía
- ...

Al seleccionar → Filtrar mapa instantáneamente
```

#### Tipo 3: Búsqueda por Mapa
```typescript
Mover mapa → Automáticamente buscar en área visible
"Buscar en esta área" [Botón]
```

---

### 8. Sistema de Marcadores

#### Estados de Marcadores

**1. Normal**
```typescript
// Negocio no registrado (data de API externa)
🔵 Pin azul básico
```

**2. Registrado**
```typescript
// Negocio en nuestra base de datos
⭐ Pin dorado con brillo
Badge "Verificado"
Prioridad en búsquedas
```

**3. Seleccionado**
```typescript
// Usuario hizo click
🔴 Pin rojo con animación bounce
Zoom automático
Panel lateral se abre
```

**4. En mi ruta**
```typescript
// Agregado a ruta del usuario
🟢 Pin verde con número
Línea conectando rutas
```

**5. Favorito**
```typescript
// Marcado como favorito
❤️ Pin con corazón
Guardado en perfil
```

---

### 9. Clustering de Marcadores

```typescript
// Cuando zoom out y hay muchos negocios cercanos
┌────┐
│ 15 │  → Cluster de 15 negocios
└────┘

Click en cluster → Zoom in automático
Hasta que se vean individuales
```

**Reglas**:
- Cluster si >10 negocios en 100px
- Color por densidad:
  - Verde: 2-10
  - Amarillo: 11-50
  - Rojo: >50

---

### 10. Efectos Visuales 3D

#### Edificios 3D
```typescript
// Mapbox incluye datos de altura de edificios
- Vista 3D con pitch de 60°
- Sombras realistas
- Extrusión de edificios
```

#### Animaciones
```typescript
// Al seleccionar negocio
1. Zoom suave (500ms)
2. Pitch a 45° si está en edificio
3. Marcador bounce
4. Highlight del área
```

#### Temas del Mapa
```typescript
// Cambiar según hora del día
- 6am-8pm: Mapbox Streets (día claro)
- 8pm-10pm: Mapbox Dusk (atardecer)
- 10pm-6am: Mapbox Dark (nocturno)
```

---

### 11. Rendimiento

#### Optimizaciones
```typescript
// Carga progresiva
1. Cargar mapa base primero
2. Cargar marcadores del área visible
3. Lazy load de imágenes
4. Cache de datos visitados

// Límites de rendimiento
- Máximo 500 marcadores visibles
- Clustering automático si >100
- Debounce de búsqueda (300ms)
- Throttle de scroll (100ms)
```

---

### 12. Mobile-Specific Features

#### Gestos Touch
```typescript
- Pinch: Zoom in/out
- Swipe: Pan del mapa
- Tap: Seleccionar marcador
- Long press: Agregar a ruta
- Two-finger rotate: Rotar mapa
- Two-finger tilt: Cambiar pitch
```

#### Bottom Sheet
```typescript
// Panel deslizable desde abajo
[Handle para arrastrar]
┌─────────────────┐
│  Peek (preview) │  ← Estado inicial
├─────────────────┤
│                 │
│  Half (lista)   │  ← Swipe up
│                 │
├─────────────────┤
│                 │
│  Full (detalles)│  ← Swipe up más
│                 │
└─────────────────┘
```

---

### 13. Integración con Rutas

#### Desde el Mapa
```typescript
Click en negocio → [Agregar a Ruta]

Opciones:
1. Agregar a ruta existente
   [Dropdown: Mis rutas]

2. Crear nueva ruta
   [Crear ruta con este negocio]

3. Ver en constructor
   [Abrir Route Builder]
```

#### Visualización de Ruta
```typescript
// Si usuario está viendo una ruta
- Marcadores numerados (1, 2, 3...)
- Línea conectando puntos
- Tiempo estimado de caminata
- Distancia total

[Optimizar ruta] → Reorganizar óptimamente
[Navegar] → Abrir Google/Apple Maps
```

---

### 14. Datos Mockeados Iniciales

```typescript
// 50 negocios de ejemplo en Santiago
const MOCK_BUSINESSES = [
  // Lastarria
  { name: "Café Literario", lat: -33.4372, lng: -70.6386, category: "cafe" },
  { name: "Galería Arte Vivo", lat: -33.4380, lng: -70.6390, category: "galeria" },

  // Providencia
  { name: "Pizzería Napoletana", lat: -33.4260, lng: -70.6100, category: "restaurante" },

  // Barrio Italia
  { name: "Tienda Vintage", lat: -33.4450, lng: -70.6280, category: "tienda" },

  // Bellavista
  { name: "Hostal Bellavista", lat: -33.4291, lng: -70.6390, category: "hostal" },

  // Centro
  { name: "Librería Qué Leo", lat: -33.4410, lng: -70.6517, category: "libreria" },

  // ... 44 más distribuidos por Santiago
]

// 5-10 negocios "verificados" (en nuestra BD)
const VERIFIED_BUSINESSES = [
  { id: 1, name: "Café La Bohemia", verified: true },
  { id: 2, name: "Galería Mestiza", verified: true },
  // ...
]
```

---

## 🛠️ Stack Técnico

### Mapa
```bash
npm install mapbox-gl
npm install @types/mapbox-gl
npm install react-map-gl  # Wrapper de React
```

### Geolocalización
```typescript
// Nativo del navegador
navigator.geolocation.getCurrentPosition()
```

### Íconos
```bash
npm install lucide-react  # Ya instalado
```

### Búsqueda
```bash
npm install fuse.js  # Fuzzy search
```

---

## 📱 Vistas Previas

### Vista Desktop
```
Búsqueda: "cafés en lastarria"
→ Mapa centrado en Lastarria
→ 8 marcadores de cafés
→ Carrusel con 8 cards abajo
→ Click en marcador → Panel lateral
```

### Vista Mobile
```
Búsqueda: "restaurantes"
→ Mapa fullscreen
→ 20+ marcadores (clustered)
→ Bottom sheet con 3 mejores resultados
→ Swipe para ver más
→ Tap marcador → Full detail
```

---

## 🎯 Métricas de Éxito

### Performance
- ⚡ First Load: <2s
- ⚡ Zoom/Pan: 60fps
- ⚡ Búsqueda: <300ms
- ⚡ Clustering: <100ms

### UX
- 📱 Touch gestos intuitivos
- 🎨 Animaciones suaves
- 📍 Geolocalización precisa
- 🔍 Búsqueda inteligente

---

## 📋 Próximos Pasos

### Fase 1: Setup Básico (Hoy)
- [ ] Instalar Mapbox GL
- [ ] Configurar token
- [ ] Mapa básico centrado en Santiago
- [ ] Botones de zoom y geolocalización

### Fase 2: Marcadores (Mañana con Backend)
- [ ] Sistema de marcadores por categoría
- [ ] Íconos personalizados
- [ ] Popups básicos
- [ ] Clustering

### Fase 3: Búsqueda (Día 3)
- [ ] Barra de búsqueda flotante
- [ ] Filtros avanzados
- [ ] Resultados en tiempo real
- [ ] Carrusel de resultados

### Fase 4: 3D y Efectos (Día 4)
- [ ] Vista 3D de edificios
- [ ] Animaciones de zoom
- [ ] Temas día/noche
- [ ] Optimizaciones de rendimiento

---

**¿Empezamos con la implementación?** 🚀

Puedo crear todo el código ahora o esperar hasta mañana cuando tengas el backend listo. ¿Qué prefieres?
