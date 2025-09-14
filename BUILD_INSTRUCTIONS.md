# Instrucciones para Generar APK

## Aplicación de Clima - Open-Meteo API

Esta aplicación muestra el clima actual y pronósticos utilizando la API gratuita de Open-Meteo.

### Características:
- 🌍 Ubicación automática
- 🌤️ Clima actual con temperatura, humedad y condiciones
- ⏰ Pronóstico por horas (12 horas)
- 📅 Pronóstico de 10 días
- 🎨 Interfaz moderna con gradientes
- 🔄 Actualización manual (pull-to-refresh)

### Para generar el APK:

#### Opción 1: Build Local (Recomendado para desarrollo)
```bash
# Instalar EAS CLI si no está instalado
npm install -g @expo/cli

# Iniciar el servidor de desarrollo
npm start

# En otra terminal, ejecutar en Android
npx expo run:android
```

#### Opción 2: Build en la nube con EAS
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Iniciar sesión en Expo (necesitas cuenta)
eas login

# Configurar el proyecto
eas build:configure

# Generar APK para preview
eas build --platform android --profile preview

# O generar APK de producción
eas build --platform android --profile production
```

#### Opción 3: Expo Development Build
```bash
# Crear un development build
eas build --profile development --platform android
```

### Permisos requeridos:
- `ACCESS_FINE_LOCATION`: Para obtener ubicación precisa
- `ACCESS_COARSE_LOCATION`: Para obtener ubicación aproximada

### API utilizada:
- **Open-Meteo**: https://open-meteo.com/en/docs
- **Geocoding**: BigDataCloud (para nombres de ciudades)

### Estructura del proyecto:
```
clima-app/
├── app/
│   └── (tabs)/
│       └── index.tsx          # Pantalla principal
├── components/
│   ├── WeatherCard.tsx        # Tarjeta de clima actual
│   ├── HourlyForecast.tsx     # Pronóstico por horas
│   └── DailyForecast.tsx      # Pronóstico de 10 días
├── services/
│   └── weatherService.ts      # Servicio de API
├── types/
│   └── weather.ts             # Tipos TypeScript
└── eas.json                   # Configuración de build
```

### Notas importantes:
1. La aplicación requiere conexión a internet
2. Los permisos de ubicación son necesarios para funcionar correctamente
3. Si no se puede obtener la ubicación, usa Lima, Perú como ubicación por defecto
4. La API de Open-Meteo es gratuita y no requiere API key

### Solución de problemas:
- Si hay errores de permisos, verifica que `app.json` tenga los permisos configurados
- Si la ubicación no funciona, verifica que el dispositivo tenga GPS habilitado
- Para builds en la nube, necesitas una cuenta de Expo (gratuita)
