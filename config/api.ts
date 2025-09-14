// Configuración de APIs
export const API_CONFIG = {
  // Google Weather API
  GOOGLE_WEATHER_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_API_KEY || 'AIzaSyBCKa2i9Nqj2CMiZJMe2OSUV-1VMqf_jvg',
  
  // Open-Meteo API (como respaldo)
  OPEN_METEO_BASE_URL: 'https://api.open-meteo.com/v1',
  
  // Configuración de la aplicación
  APP_CONFIG: {
    DEFAULT_LANGUAGE: 'es',
    DEFAULT_UNITS: 'metric',
    CACHE_DURATION: 10 * 60 * 1000, // 10 minutos en milisegundos
  }
};

// Función para validar si la API key de Google está configurada
export const isGoogleApiKeyConfigured = (): boolean => {
  return API_CONFIG.GOOGLE_WEATHER_API_KEY !== 'YOUR_GOOGLE_API_KEY_HERE' && 
         API_CONFIG.GOOGLE_WEATHER_API_KEY.length > 0;
};

// Función para obtener la API key de Google
export const getGoogleApiKey = (): string => {
  if (!isGoogleApiKeyConfigured()) {
    console.warn('Google API key no está configurada. Usando Open-Meteo como respaldo.');
  }
  return API_CONFIG.GOOGLE_WEATHER_API_KEY;
};
