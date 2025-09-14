import { WeatherData, LocationData } from '@/types/weather';
import * as Location from 'expo-location';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export class WeatherService {
  static async getCurrentLocation(): Promise<LocationData> {
    try {
      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Permisos de ubicación denegados');
      }

      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({});
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      // Ubicación por defecto (Lima, Perú)
      return {
        latitude: -12.0464,
        longitude: -77.0428,
        city: 'Lima',
        country: 'Perú',
      };
    }
  }

  static async getWeatherData(location: LocationData): Promise<WeatherData> {
    try {
      const params = new URLSearchParams({
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'is_day',
          'precipitation',
          'rain',
          'showers',
          'snowfall',
          'weather_code',
          'cloud_cover',
          'pressure_msl',
          'surface_pressure',
          'wind_speed_10m',
          'wind_direction_10m',
          'wind_gusts_10m',
        ].join(','),
        hourly: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'precipitation_probability',
          'precipitation',
          'rain',
          'showers',
          'snowfall',
          'weather_code',
          'cloud_cover',
          'pressure_msl',
          'surface_pressure',
          'wind_speed_10m',
          'wind_direction_10m',
          'wind_gusts_10m',
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'apparent_temperature_max',
          'apparent_temperature_min',
          'sunrise',
          'sunset',
          'daylight_duration',
          'sunshine_duration',
          'uv_index_max',
          'precipitation_sum',
          'rain_sum',
          'showers_sum',
          'snowfall_sum',
          'precipitation_hours',
          'precipitation_probability_max',
          'wind_speed_10m_max',
          'wind_gusts_10m_max',
          'wind_direction_10m_dominant',
        ].join(','),
        timezone: 'auto',
        forecast_days: 10,
        forecast_hours: 24,
      });

      const response = await fetch(`${OPEN_METEO_BASE_URL}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data: WeatherData = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo datos del clima:', error);
      throw error;
    }
  }

  static async getCityName(latitude: number, longitude: number): Promise<string> {
    try {
      // Usar geocoding inverso para obtener el nombre de la ciudad
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`
      );
      
      if (!response.ok) {
        throw new Error('Error en geocoding');
      }

      const data = await response.json();
      return data.city || data.locality || 'Ubicación desconocida';
    } catch (error) {
      console.error('Error obteniendo nombre de ciudad:', error);
      return 'Ubicación desconocida';
    }
  }

  static formatTemperature(temp: number): string {
    return `${Math.round(temp)}°`;
  }

  static formatWindSpeed(speed: number): string {
    return `${Math.round(speed)} km/h`;
  }

  static formatTime(timeString: string): string {
    const date = new Date(timeString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  static formatDate(timeString: string): string {
    const date = new Date(timeString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', { 
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    }
  }
}
