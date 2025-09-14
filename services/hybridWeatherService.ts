import { WeatherData, LocationData } from '@/types/weather';
import { GoogleWeatherService, GoogleWeatherData } from './googleWeatherService';
import { WeatherService } from './weatherService';
import { isGoogleApiKeyConfigured } from '@/config/api';

export class HybridWeatherService {
  /**
   * Obtiene datos del clima usando Google Weather API como principal y Open-Meteo como respaldo
   */
  static async getWeatherData(location: LocationData): Promise<WeatherData> {
    try {
      // Intentar usar Google Weather API primero
      if (isGoogleApiKeyConfigured()) {
        console.log('Usando Google Weather API...');
        const googleData = await GoogleWeatherService.getWeatherData(location);
        return this.transformGoogleToWeatherData(googleData);
      } else {
        console.log('Google API key no configurada, usando Open-Meteo...');
        return await WeatherService.getWeatherData(location);
      }
    } catch (error) {
      console.warn('Error con Google Weather API, usando Open-Meteo como respaldo:', error);
      // Si Google Weather API falla, usar Open-Meteo como respaldo
      return await WeatherService.getWeatherData(location);
    }
  }

  /**
   * Obtiene específicamente el pronóstico de 10 días usando Google Weather API
   */
  static async get10DayForecast(location: LocationData): Promise<any> {
    try {
      if (isGoogleApiKeyConfigured()) {
        console.log('Obteniendo pronóstico de 10 días con Google Weather API...');
        const googleData = await GoogleWeatherService.get10DayForecast(location);
        
        // Crear estructura de datos compatible
        const mockGoogleWeatherData = {
          current: {
            temperature: 25,
            humidity: 60,
            windSpeed: 10,
            windDirection: 180,
            pressure: 1013,
            visibility: 10,
            uvIndex: 5,
            condition: 'Clear',
            icon: '☀️',
            feelsLike: 27,
            dewPoint: 15,
            cloudCover: 20,
            precipitation: 0,
            precipitationProbability: 10,
            sunrise: '06:30',
            sunset: '18:30',
            moonPhase: 'Waxing Crescent',
            airQuality: {
              pm25: 15,
              pm10: 25,
              o3: 80,
              no2: 20,
              so2: 5,
              co: 1,
              aqi: 50,
            },
          },
          hourly: {
            time: [],
            temperature: [],
            humidity: [],
            windSpeed: [],
            windDirection: [],
            pressure: [],
            visibility: [],
            uvIndex: [],
            condition: [],
            icon: [],
            precipitation: [],
            precipitationProbability: [],
            dewPoint: [],
            cloudCover: [],
            feelsLike: [],
            windGust: [],
          },
          daily: {
            time: [],
            temperatureMax: [],
            temperatureMin: [],
            humidity: [],
            windSpeed: [],
            windDirection: [],
            pressure: [],
            visibility: [],
            uvIndex: [],
            condition: [],
            icon: [],
            precipitation: [],
            precipitationProbability: [],
            sunrise: [],
            sunset: [],
            moonPhase: [],
            dewPoint: [],
            cloudCover: [],
            windGust: [],
          },
          alerts: [],
          source: 'Google Weather API (Mock)',
          ...googleData,
        };
        
        return mockGoogleWeatherData;
      } else {
        console.log('Google API key no configurada, usando Open-Meteo para 10 días...');
        const weatherData = await WeatherService.getWeatherData(location);
        return {
          current: {
            temperature: weatherData.current.temperature_2m,
            humidity: weatherData.current.relative_humidity_2m,
            windSpeed: weatherData.current.wind_speed_10m,
            windDirection: weatherData.current.wind_direction_10m,
            pressure: weatherData.current.pressure_msl,
            visibility: 10,
            uvIndex: 5,
            condition: 'Clear',
            icon: '☀️',
            feelsLike: weatherData.current.apparent_temperature,
            dewPoint: 15,
            cloudCover: 20,
            precipitation: weatherData.current.precipitation,
            precipitationProbability: 10,
            sunrise: '06:30',
            sunset: '18:30',
            moonPhase: 'Waxing Crescent',
            airQuality: {
              pm25: 15,
              pm10: 25,
              o3: 80,
              no2: 20,
              so2: 5,
              co: 1,
              aqi: 50,
            },
          },
          dailyForecast: weatherData.daily,
          source: 'Open-Meteo'
        };
      }
    } catch (error) {
      console.warn('Error con Google Weather API para 10 días, usando Open-Meteo:', error);
      const weatherData = await WeatherService.getWeatherData(location);
      return {
        current: {
          temperature: weatherData.current.temperature_2m,
          humidity: weatherData.current.relative_humidity_2m,
          windSpeed: weatherData.current.wind_speed_10m,
          windDirection: weatherData.current.wind_direction_10m,
          pressure: weatherData.current.pressure_msl,
          visibility: 10,
          uvIndex: 5,
          condition: 'Clear',
          icon: '☀️',
          feelsLike: weatherData.current.apparent_temperature,
          dewPoint: 15,
          cloudCover: 20,
          precipitation: weatherData.current.precipitation,
          precipitationProbability: 10,
          sunrise: '06:30',
          sunset: '18:30',
          moonPhase: 'Waxing Crescent',
          airQuality: {
            pm25: 15,
            pm10: 25,
            o3: 80,
            no2: 20,
            so2: 5,
            co: 1,
            aqi: 50,
          },
        },
        dailyForecast: weatherData.daily,
        source: 'Open-Meteo (fallback)'
      };
    }
  }

  /**
   * Obtiene el nombre de la ciudad usando múltiples servicios como respaldo
   */
  static async getCityName(location: LocationData): Promise<string> {
    console.log('Obteniendo nombre de ciudad para:', location);
    
    // Intentar con Google Geocoding API primero
    if (isGoogleApiKeyConfigured()) {
      try {
        console.log('Intentando con Google Geocoding API...');
        const cityName = await GoogleWeatherService.getCityName(location);
        if (cityName && cityName !== 'Ubicación desconocida') {
          console.log('Ciudad obtenida con Google:', cityName);
          return cityName;
        }
      } catch (error) {
        console.warn('Error con Google Geocoding API:', error);
      }
    }

    // Intentar con Open-Meteo (BigDataCloud)
    try {
      console.log('Intentando con BigDataCloud...');
      const cityName = await WeatherService.getCityName(location.latitude, location.longitude);
      if (cityName && cityName !== 'Ubicación desconocida') {
        console.log('Ciudad obtenida con BigDataCloud:', cityName);
        return cityName;
      }
    } catch (error) {
      console.warn('Error con BigDataCloud:', error);
    }

    // Intentar con Nominatim (OpenStreetMap) como último respaldo
    try {
      console.log('Intentando con Nominatim...');
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&accept-language=es`
      );
      
      if (response.ok) {
        const data = await response.json();
        const cityName = data.address?.city || 
                        data.address?.town || 
                        data.address?.village || 
                        data.address?.municipality ||
                        data.address?.county ||
                        data.display_name?.split(',')[0];
        
        if (cityName) {
          console.log('Ciudad obtenida con Nominatim:', cityName);
          return cityName;
        }
      }
    } catch (error) {
      console.warn('Error con Nominatim:', error);
    }

    // Si todo falla, usar ubicación por defecto basada en coordenadas aproximadas
    console.log('Usando ubicación por defecto basada en coordenadas...');
    return this.getDefaultLocationName(location);
  }

  /**
   * Obtiene un nombre de ubicación por defecto basado en coordenadas aproximadas
   */
  private static getDefaultLocationName(location: LocationData): string {
    const { latitude, longitude } = location;
    
    // Coordenadas aproximadas de ciudades principales
    const cities = [
      { name: 'Lima', lat: -12.0464, lon: -77.0428, tolerance: 0.5 },
      { name: 'Arequipa', lat: -16.4090, lon: -71.5375, tolerance: 0.5 },
      { name: 'Trujillo', lat: -8.1116, lon: -79.0288, tolerance: 0.5 },
      { name: 'Chiclayo', lat: -6.7714, lon: -79.8409, tolerance: 0.5 },
      { name: 'Piura', lat: -5.1945, lon: -80.6328, tolerance: 0.5 },
      { name: 'Iquitos', lat: -3.7491, lon: -73.2538, tolerance: 0.5 },
      { name: 'Cusco', lat: -13.5319, lon: -71.9675, tolerance: 0.5 },
      { name: 'Pucallpa', lat: -8.3833, lon: -74.5333, tolerance: 0.5 },
      { name: 'Tacna', lat: -18.0066, lon: -70.2469, tolerance: 0.5 },
      { name: 'Juliaca', lat: -15.5000, lon: -70.1333, tolerance: 0.5 },
    ];

    for (const city of cities) {
      const latDiff = Math.abs(latitude - city.lat);
      const lonDiff = Math.abs(longitude - city.lon);
      
      if (latDiff <= city.tolerance && lonDiff <= city.tolerance) {
        return city.name;
      }
    }

    // Si no coincide con ninguna ciudad conocida, devolver coordenadas
    return `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
  }

  /**
   * Transforma los datos de Google Weather API al formato de WeatherData
   */
  private static transformGoogleToWeatherData(googleData: GoogleWeatherData): WeatherData {
    return {
      latitude: 0,
      longitude: 0,
      elevation: 0,
      generationtime_ms: 0,
      utc_offset_seconds: 0,
      timezone: 'UTC',
      timezone_abbreviation: 'UTC',
      hourly_units: {
        temperature_2m: '°C',
        relative_humidity_2m: '%',
        apparent_temperature: '°C',
        precipitation_probability: '%',
        precipitation: 'mm',
        rain: 'mm',
        showers: 'mm',
        snowfall: 'cm',
        weather_code: 'wmo code',
        cloud_cover: '%',
        pressure_msl: 'hPa',
        surface_pressure: 'hPa',
        wind_speed_10m: 'km/h',
        wind_direction_10m: '°',
        wind_gusts_10m: 'km/h',
      },
      daily_units: {
        weather_code: 'wmo code',
        temperature_2m_max: '°C',
        temperature_2m_min: '°C',
        apparent_temperature_max: '°C',
        apparent_temperature_min: '°C',
        sunrise: 'iso8601',
        sunset: 'iso8601',
        precipitation_sum: 'mm',
        rain_sum: 'mm',
        showers_sum: 'mm',
        snowfall_sum: 'cm',
        precipitation_hours: 'h',
        precipitation_probability_max: '%',
        wind_speed_10m_max: 'km/h',
        wind_gusts_10m_max: 'km/h',
        wind_direction_10m_dominant: '°',
        daylight_duration: 's',
        sunshine_duration: 's',
        uv_index_max: '',
      },
      current: {
        time: new Date().toISOString(),
        interval: 0,
        temperature_2m: googleData.current.temperature,
        relative_humidity_2m: googleData.current.humidity,
        apparent_temperature: googleData.current.feelsLike,
        is_day: new Date().getHours() >= 6 && new Date().getHours() < 18 ? 1 : 0,
        precipitation: 0,
        rain: 0,
        showers: 0,
        snowfall: 0,
        weather_code: this.conditionToWeatherCode(googleData.current.condition),
        cloud_cover: 0,
        pressure_msl: googleData.current.pressure,
        surface_pressure: googleData.current.pressure,
        wind_speed_10m: googleData.current.windSpeed,
        wind_direction_10m: googleData.current.windDirection,
        wind_gusts_10m: googleData.current.windSpeed,
      },
      hourly: {
        time: googleData.hourly.time,
        temperature_2m: googleData.hourly.temperature,
        relative_humidity_2m: googleData.hourly.humidity,
        apparent_temperature: googleData.hourly.temperature,
        precipitation_probability: googleData.hourly.precipitationProbability,
        precipitation: googleData.hourly.precipitation,
        rain: googleData.hourly.precipitation,
        showers: googleData.hourly.precipitation,
        snowfall: new Array(googleData.hourly.precipitation.length).fill(0),
        weather_code: googleData.hourly.condition.map(condition => this.conditionToWeatherCode(condition)),
        cloud_cover: new Array(googleData.hourly.precipitation.length).fill(0),
        pressure_msl: googleData.hourly.pressure,
        surface_pressure: googleData.hourly.pressure,
        wind_speed_10m: googleData.hourly.windSpeed,
        wind_direction_10m: googleData.hourly.windDirection,
        wind_gusts_10m: googleData.hourly.windSpeed,
      },
      daily: {
        time: googleData.daily.time,
        weather_code: googleData.daily.condition.map(condition => this.conditionToWeatherCode(condition)),
        temperature_2m_max: googleData.daily.temperatureMax,
        temperature_2m_min: googleData.daily.temperatureMin,
        apparent_temperature_max: googleData.daily.temperatureMax,
        apparent_temperature_min: googleData.daily.temperatureMin,
        sunrise: new Array(googleData.daily.time.length).fill('06:00'),
        sunset: new Array(googleData.daily.time.length).fill('18:00'),
        precipitation_sum: googleData.daily.precipitation,
        rain_sum: googleData.daily.precipitation,
        showers_sum: googleData.daily.precipitation,
        snowfall_sum: new Array(googleData.daily.time.length).fill(0),
        precipitation_hours: new Array(googleData.daily.time.length).fill(0),
        precipitation_probability_max: googleData.daily.precipitationProbability,
        wind_speed_10m_max: googleData.daily.windSpeed,
        wind_gusts_10m_max: googleData.daily.windSpeed,
        wind_direction_10m_dominant: googleData.daily.windDirection,
        daylight_duration: new Array(googleData.daily.time.length).fill(12),
        sunshine_duration: new Array(googleData.daily.time.length).fill(8),
        uv_index_max: googleData.daily.uvIndex,
      },
    };
  }

  /**
   * Convierte las condiciones de Google Weather a códigos de clima de Open-Meteo
   */
  private static conditionToWeatherCode(condition: string): number {
    const conditionMap: { [key: string]: number } = {
      'Clear': 0,
      'Sunny': 0,
      'Mostly Clear': 1,
      'Partly Cloudy': 2,
      'Cloudy': 3,
      'Overcast': 3,
      'Fog': 45,
      'Mist': 45,
      'Light Rain': 51,
      'Moderate Rain': 53,
      'Heavy Rain': 55,
      'Light Drizzle': 51,
      'Moderate Drizzle': 53,
      'Heavy Drizzle': 55,
      'Light Snow': 71,
      'Moderate Snow': 73,
      'Heavy Snow': 75,
      'Thunderstorm': 95,
      'Light Thunderstorm': 95,
      'Moderate Thunderstorm': 95,
      'Heavy Thunderstorm': 95,
    };

    return conditionMap[condition] || 0; // Default to clear weather
  }

  /**
   * Obtiene la ubicación actual del usuario
   */
  static async getCurrentLocation(): Promise<LocationData> {
    return await WeatherService.getCurrentLocation();
  }

  /**
   * Formatea la temperatura
   */
  static formatTemperature(temp: number): string {
    return WeatherService.formatTemperature(temp);
  }

  /**
   * Formatea la velocidad del viento
   */
  static formatWindSpeed(speed: number): string {
    return WeatherService.formatWindSpeed(speed);
  }

  /**
   * Formatea la hora
   */
  static formatTime(timeString: string): string {
    return WeatherService.formatTime(timeString);
  }

  /**
   * Formatea la fecha
   */
  static formatDate(dateString: string): string {
    return WeatherService.formatDate(dateString);
  }
}
