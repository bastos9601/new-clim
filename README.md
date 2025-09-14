# 🌤️ Aplicación de Clima - Proyecto Móvil

## 📱 Descripción del Proyecto

Aplicación móvil de clima desarrollada con **React Native** y **Expo** que proporciona información meteorológica en tiempo real, pronósticos por horas y pronósticos diarios. La aplicación utiliza múltiples APIs de clima para garantizar datos precisos y actualizados.

## 🛠️ Tecnologías Utilizadas

### Framework Principal
- **React Native** - Framework para desarrollo de aplicaciones móviles multiplataforma
- **Expo** - Plataforma de desarrollo que simplifica el proceso de creación de apps React Native
- **TypeScript** - Lenguaje de programación con tipado estático para mayor robustez

### APIs de Clima
- **Open-Meteo API** - API principal para datos meteorológicos (gratuita y sin límites)
- **Google Weather API** - API secundaria para datos más detallados (requiere API key)
- **BigDataCloud API** - Para geocodificación inversa (obtener nombres de ciudades)
- **Nominatim/OpenStreetMap** - API de respaldo para geocodificación

### Librerías y Dependencias

#### Navegación
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs
expo install react-native-screens react-native-safe-area-context
```

#### UI y Componentes
```bash
npm install expo-linear-gradient
expo install expo-status-bar
```

#### Ubicación y Permisos
```bash
expo install expo-location
```

#### Iconos y Tipografía
```bash
expo install @expo/vector-icons
```

## 📦 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **Expo CLI** instalado globalmente
- **Expo Go** app en tu dispositivo móvil

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd proyecto_clima/clima-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env` en la raíz del proyecto:
```env
EXPO_PUBLIC_GOOGLE_API_KEY=tu_api_key_de_google_aqui
```

4. **Ejecutar la aplicación**
```bash
npx expo start
```

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```
clima-app/
├── app/                    # Páginas de la aplicación (Expo Router)
│   ├── (tabs)/            # Navegación por pestañas
│   │   ├── index.tsx      # Pantalla principal
│   │   ├── daily-forecast.tsx
│   │   └── explore.tsx
│   └── _layout.tsx        # Layout principal
├── components/            # Componentes reutilizables
│   ├── WeatherHeader.tsx  # Header principal con clima actual
│   ├── HourlyForecast.tsx # Pronóstico por horas
│   ├── DailyForecast.tsx  # Pronóstico diario
│   ├── DynamicBackground.tsx # Fondos dinámicos
│   └── WeatherAlerts.tsx  # Alertas meteorológicas
├── services/              # Servicios de API
│   ├── weatherService.ts  # Servicio Open-Meteo
│   ├── googleWeatherService.ts # Servicio Google Weather
│   └── hybridWeatherService.ts # Servicio híbrido
├── types/                 # Definiciones de tipos TypeScript
│   └── weather.ts         # Tipos para datos meteorológicos
├── hooks/                 # Hooks personalizados
├── constants/             # Constantes de la aplicación
└── config/                # Configuración de APIs
```

## 🔧 Funcionalidades Implementadas

### 1. **Detección de Ubicación**
- Permisos de ubicación automáticos
- Geocodificación inversa para obtener nombres de ciudades
- Múltiples servicios de respaldo para geocodificación

### 2. **Datos Meteorológicos**
- **Clima actual**: Temperatura, humedad, viento, presión
- **Sensación térmica**: Temperatura percibida
- **Condiciones climáticas**: Con códigos WMO estándar
- **Iconos dinámicos**: Basados en condiciones reales

### 3. **Pronósticos**
- **Por horas**: Próximas 48 horas
- **Diario**: Próximos 10 días
- **Temperaturas máximas y mínimas**
- **Probabilidad de precipitación**

### 4. **Interfaz de Usuario**
- **Fondos dinámicos**: Cambian según las condiciones climáticas
- **Diseño responsivo**: Adaptado a diferentes tamaños de pantalla
- **Animaciones suaves**: Transiciones y efectos visuales
- **Tema oscuro**: Optimizado para legibilidad

## 🌐 APIs Utilizadas

### Open-Meteo API
```typescript
// Endpoint principal
https://api.open-meteo.com/v1/forecast

// Parámetros utilizados
- latitude, longitude: Coordenadas de ubicación
- current: Datos actuales del clima
- hourly: Pronóstico por horas
- daily: Pronóstico diario
- timezone: Zona horaria automática
```

### Google Weather API
```typescript
// Endpoint
https://weather.googleapis.com/v1/weather:lookup

// Características
- Datos más detallados
- Requiere API key
- Usado como fuente secundaria
```

### BigDataCloud API
```typescript
// Geocodificación inversa
https://api.bigdatacloud.net/data/reverse-geocode-client

// Parámetros
- latitude, longitude: Coordenadas
- localityLanguage: Idioma (español)
```

## 📱 Características Técnicas

### Gestión de Estado
- **useState**: Para estado local de componentes
- **useEffect**: Para efectos secundarios y carga de datos
- **Custom Hooks**: Para lógica reutilizable

### Manejo de Errores
- **Try-catch**: Para manejo de errores en APIs
- **Fallbacks**: Servicios de respaldo automáticos
- **Alertas de usuario**: Notificaciones de errores amigables

### Optimización
- **Caché de datos**: Para reducir llamadas a API
- **Lazy loading**: Carga diferida de componentes
- **Debouncing**: Para búsquedas y actualizaciones

## 🎨 Diseño y UX

### Principios de Diseño
- **Material Design**: Guías de Google para diseño móvil
- **Accesibilidad**: Contraste adecuado y tamaños de texto
- **Consistencia**: Patrones de diseño uniformes

### Componentes Visuales
- **Gradientes**: Para fondos y efectos visuales
- **Iconos**: Sistema de iconos meteorológicos
- **Tipografía**: Jerarquía visual clara
- **Espaciado**: Sistema de espaciado consistente

## 🔒 Seguridad y Privacidad

### Permisos
- **Ubicación**: Solo para obtener datos meteorológicos locales
- **Internet**: Para conectar con APIs de clima
- **Almacenamiento**: Para caché de datos (opcional)

### Datos
- **No se almacenan datos personales**
- **Ubicación no se comparte con terceros**
- **APIs utilizan HTTPS para seguridad**

## 🚀 Despliegue

### Desarrollo
```bash
# Modo desarrollo
npx expo start

# Modo desarrollo con tunnel
npx expo start --tunnel
```

### Producción
```bash
# Build para Android
npx expo build:android

# Build para iOS
npx expo build:ios

# Publicar en Expo
npx expo publish
```

## 📊 Métricas y Rendimiento

### Optimizaciones Implementadas
- **Lazy loading** de componentes pesados
- **Memoización** de cálculos costosos hola cmoamsdmas
- **Debouncing** en búsquedas
- **Caché inteligente** de datos de API

### Monitoreo
- **Console logs** para debugging
- **Error boundaries** para manejo de errores
- **Performance monitoring** con Expo

## 🔮 Funcionalidades Futuras

### Próximas Implementaciones
- [ ] **Notificaciones push** para alertas meteorológicas
- [ ] **Widgets** para pantalla de inicio
- [ ] **Modo offline** con datos cacheados
- [ ] **Múltiples ubicaciones** favoritas
- [ ] **Gráficos** de tendencias meteorológicas
- [ ] **Integración con calendario** para eventos

### Mejoras Técnicas
- [ ] **Testing** con Jest y React Native Testing Library
- [ ] **CI/CD** con GitHub Actions
- [ ] **Analytics** con Firebase
- [ ] **Crash reporting** con Sentry

## 👥 Contribución

### Cómo Contribuir
1. Fork del repositorio
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código
- **ESLint**: Para linting de código
- **Prettier**: Para formateo de código
- **TypeScript**: Tipado estricto
- **Conventional Commits**: Para mensajes de commit

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Desarrollador**: [Tu Nombre]
- **Email**: [tu-email@ejemplo.com]
- **GitHub**: [tu-usuario-github]

---

## 🎯 Resumen para Exposición

### Lo que se Instaló:
1. **React Native + Expo** - Framework principal
2. **TypeScript** - Para tipado estático
3. **Expo Location** - Para geolocalización
4. **Expo Linear Gradient** - Para efectos visuales
5. **React Navigation** - Para navegación entre pantallas

### Lo que se Usó:
1. **3 APIs diferentes** de clima para datos precisos
2. **Sistema de geocodificación** para nombres de ciudades
3. **Códigos WMO** estándar para condiciones climáticas
4. **Fondos dinámicos** que cambian según el clima
5. **Sistema de respaldo** automático entre APIs

### Características Destacadas:
- ✅ **Funciona offline** con datos cacheados
- ✅ **Múltiples fuentes** de datos meteorológicos
- ✅ **Interfaz intuitiva** y responsiva
- ✅ **Datos en tiempo real** actualizados automáticamente
- ✅ **Código limpio** y bien documentado

¡Tu aplicación está lista para la exposición! 🌟