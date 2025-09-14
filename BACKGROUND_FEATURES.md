# 🌅 Características de Fondo Dinámico

## Imágenes de Fondo Según el Clima

La aplicación ahora incluye un sistema de fondos dinámicos que cambian según las condiciones climáticas actuales.

### 🎨 Tipos de Fondos Implementados:

#### ☀️ **Cielo Despejado (Códigos 0, 1)**
- **Imagen**: Cielo azul despejado
- **Gradiente**: Azul claro a azul cielo
- **Colores**: `#87CEEB → #98D8E8 → #B0E0E6`

#### ⛅ **Parcialmente Nublado (Código 2)**
- **Imagen**: Cielo con nubes dispersas
- **Gradiente**: Azul acero a gris claro
- **Colores**: `#B0C4DE → #C0C0C0 → #D3D3D3`

#### ☁️ **Nublado (Código 3)**
- **Imagen**: Cielo completamente nublado
- **Gradiente**: Gris pizarra a gris claro
- **Colores**: `#708090 → #A9A9A9 → #C0C0C0`

#### 🌫️ **Niebla (Códigos 45, 48)**
- **Imagen**: Paisaje con niebla
- **Gradiente**: Gris claro a azul muy claro
- **Colores**: `#D3D3D3 → #E6E6FA → #F0F8FF`

#### 🌧️ **Lluvia (Códigos 51, 53, 55, 61, 63, 65)**
- **Imagen**: Paisaje lluvioso
- **Gradiente**: Azul acero a azul cielo
- **Colores**: `#4682B4 → #5F9EA0 → #87CEEB`

#### ❄️ **Nieve (Códigos 71, 73, 75)**
- **Imagen**: Paisaje nevado
- **Gradiente**: Azul muy claro a blanco
- **Colores**: `#E6E6FA → #F0F8FF → #FFFFFF`

#### ⛈️ **Tormenta (Códigos 95, 96, 99)**
- **Imagen**: Cielo tormentoso
- **Gradiente**: Negro a púrpura
- **Colores**: `#2F2F2F → #4B0082 → #8A2BE2`

### 🌙 **Modo Nocturno**
- Los fondos se oscurecen automáticamente durante la noche
- Los gradientes se ajustan para crear una atmósfera nocturna
- Se detecta automáticamente si es día o noche según la API

### 🎬 **Transiciones Suaves**
- **Fade In/Out**: Transiciones de 300ms entre fondos
- **Animaciones**: Usando React Native Animated
- **Sin interrupciones**: Las transiciones no afectan la funcionalidad

### 🖼️ **Fuente de Imágenes**
- **Unsplash**: Imágenes de alta calidad y gratuitas
- **Optimización**: Imágenes optimizadas para móviles
- **Cache**: Las imágenes se cachean automáticamente

### 🔧 **Componentes Técnicos**

#### `BackgroundService`
- Maneja la lógica de selección de fondos
- Convierte gradientes de día a noche
- Proporciona fondos por defecto

#### `DynamicBackground`
- Componente wrapper para fondos dinámicos
- Combina imagen de fondo + gradiente
- Incluye overlay para legibilidad del texto

#### `useBackgroundTransition`
- Hook personalizado para transiciones
- Maneja animaciones de fade
- Optimiza el rendimiento

### 📱 **Optimizaciones de Rendimiento**
- **Lazy Loading**: Las imágenes se cargan solo cuando es necesario
- **Cache**: Reutilización de imágenes ya cargadas
- **Compresión**: Imágenes optimizadas para móviles
- **Blur**: Ligero desenfoque para mejor legibilidad del texto

### 🎯 **Personalización**
Puedes personalizar los fondos modificando `backgroundService.ts`:

```typescript
// Agregar nuevo tipo de clima
private static backgroundImages: { [key: number]: BackgroundImage } = {
  // Tu nuevo código de clima
  100: {
    uri: 'https://tu-imagen-url.com/imagen.jpg',
    gradient: ['#color1', '#color2', '#color3']
  }
};
```

### 🌍 **Compatibilidad**
- ✅ **Android**: Totalmente compatible
- ✅ **iOS**: Totalmente compatible
- ✅ **Web**: Compatible (con limitaciones de red)
- ✅ **Offline**: Usa fondos por defecto si no hay conexión

### 🚀 **Próximas Mejoras**
- [ ] Fondos locales para modo offline
- [ ] Más variedad de imágenes por tipo de clima
- [ ] Fondos animados (GIFs)
- [ ] Personalización por usuario
- [ ] Fondos según la ubicación geográfica
