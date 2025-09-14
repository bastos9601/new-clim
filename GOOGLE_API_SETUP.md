# Configuración de Google Weather API

## 📋 Pasos para configurar Google Weather API

### 1. Obtener API Key de Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Navega a **APIs y servicios** > **Biblioteca**
4. Busca y habilita las siguientes APIs:
   - **Weather API**
   - **Geocoding API**
   - **Maps JavaScript API**

### 2. Crear credenciales

1. Ve a **APIs y servicios** > **Credenciales**
2. Haz clic en **Crear credenciales** > **Clave de API**
3. Copia tu API key

### 3. Configurar en la aplicación

#### Opción A: Variable de entorno (Recomendado)
1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega la siguiente línea:
```
EXPO_PUBLIC_GOOGLE_API_KEY=tu_api_key_aqui
```

#### Opción B: Configuración directa
1. Abre `clima-app/config/api.ts`
2. Reemplaza `'YOUR_GOOGLE_API_KEY_HERE'` con tu API key real

### 4. Restringir la API key (Opcional pero recomendado)

1. En Google Cloud Console, ve a **APIs y servicios** > **Credenciales**
2. Haz clic en tu API key
3. En **Restricciones de aplicación**, selecciona:
   - **Restricciones de API**: Selecciona solo las APIs que necesitas
   - **Restricciones de aplicación**: Configura según tu caso de uso

### 5. Reiniciar la aplicación

```bash
npm start
```

## 🔧 Funcionalidades disponibles con Google Weather API

- ✅ **Datos más precisos**: Información meteorológica hiperlocal
- ✅ **Pronósticos de 10 días**: Predicciones detalladas
- ✅ **Pronósticos de 240 horas**: Hasta 10 días de anticipación
- ✅ **Datos históricos**: Últimas 24 horas
- ✅ **Geocoding**: Nombres de ciudades más precisos
- ✅ **Respaldo automático**: Si Google API falla, usa Open-Meteo

## 🚨 Notas importantes

- **Costo**: Google Weather API tiene un costo por uso
- **Límites**: Revisa los límites de cuota en Google Cloud Console
- **Respaldo**: La aplicación funciona sin Google API usando Open-Meteo
- **Seguridad**: Nunca subas tu API key a repositorios públicos

## 🔍 Verificar configuración

Si la API key está configurada correctamente, verás en la consola:
```
Usando Google Weather API...
```

Si no está configurada, verás:
```
Google API key no configurada, usando Open-Meteo...
```
