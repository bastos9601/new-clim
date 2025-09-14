import { LocationData } from '@/types/weather';
import { getGoogleApiKey, isGoogleApiKeyConfigured } from '@/config/api';

export interface GoogleWeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
    condition: string;
    icon: string;
    feelsLike: number;
    dewPoint: number;
    cloudCover: number;
    precipitation: number;
    precipitationProbability: number;
    sunrise: string;
    sunset: string;
    moonPhase: string;
    airQuality: {
      pm25: number;
      pm10: number;
      o3: number;
      no2: number;
      so2: number;
      co: number;
      aqi: number;
    };
  };
  hourly: {
    time: string[];
    temperature: number[];
    humidity: number[];
    windSpeed: number[];
    windDirection: number[];
    pressure: number[];
    visibility: number[];
    uvIndex: number[];
    condition: string[];
    icon: string[];
    precipitation: number[];
    precipitationProbability: number[];
    dewPoint: number[];
    cloudCover: number[];
    feelsLike: number[];
    windGust: number[];
  };
  daily: {
    time: string[];
    temperatureMax: number[];
    temperatureMin: number[];
    humidity: number[];
    windSpeed: number[];
    windDirection: number[];
    pressure: number[];
    visibility: number[];
    uvIndex: number[];
    condition: string[];
    icon: string[];
    precipitation: number[];
    precipitationProbability: number[];
    sunrise: string[];
    sunset: string[];
    moonPhase: string[];
    dewPoint: number[];
    cloudCover: number[];
    windGust: number[];
  };
  alerts?: {
    title: string;
    description: string;
    severity: string;
    startTime: string;
    endTime: string;
  }[];
}

export class GoogleWeatherService {
  private static readonly BASE_URL = 'https://weather.googleapis.com/v1';
  private static readonly DAILY_FORECAST_URL = 'https://weather.googleapis.com/v1/weather:lookup';

  /**
   * Obtiene datos del clima actual y pronóstico usando Google Weather API
   */
  static async getWeatherData(location: LocationData): Promise<GoogleWeatherData> {
    try {
      if (!isGoogleApiKeyConfigured()) {
        throw new Error('Google API key no está configurada');
      }

      const apiKey = getGoogleApiKey();
      const url = `${this.DAILY_FORECAST_URL}?location=${location.latitude},${location.longitude}&key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.transformGoogleWeatherData(data);
    } catch (error) {
      console.error('Error fetching Google Weather data:', error);
      throw new Error('No se pudieron obtener los datos del clima de Google');
    }
  }

  /**
   * Transforma los datos de Google Weather API al formato de nuestra aplicación
   */
  private static transformGoogleWeatherData(data: any): GoogleWeatherData {
    console.log('Google Weather API Response:', JSON.stringify(data, null, 2));

    // Transformar datos actuales
    const current = {
      temperature: data.current?.temperature || data.current?.temperatureCelsius || 0,
      humidity: data.current?.humidity || data.current?.relativeHumidity || 0,
      windSpeed: data.current?.windSpeed || data.current?.windSpeedKmh || 0,
      windDirection: data.current?.windDirection || data.current?.windDirectionDegrees || 0,
      pressure: data.current?.pressure || data.current?.pressureMb || 0,
      visibility: data.current?.visibility || data.current?.visibilityKm || 0,
      uvIndex: data.current?.uvIndex || data.current?.uvIndexValue || 0,
      condition: data.current?.condition || data.current?.conditionText || 'Desconocido',
      icon: data.current?.icon || data.current?.conditionIcon || '☀️',
      feelsLike: data.current?.feelsLike || data.current?.feelsLikeCelsius || data.current?.temperature || 0,
    };

    // Transformar datos horarios (si están disponibles)
    const hourly = {
      time: data.hourly?.time || data.hourlyForecast?.map((h: any) => h.time) || [],
      temperature: data.hourly?.temperature || data.hourlyForecast?.map((h: any) => h.temperature) || [],
      humidity: data.hourly?.humidity || data.hourlyForecast?.map((h: any) => h.humidity) || [],
      windSpeed: data.hourly?.windSpeed || data.hourlyForecast?.map((h: any) => h.windSpeed) || [],
      windDirection: data.hourly?.windDirection || data.hourlyForecast?.map((h: any) => h.windDirection) || [],
      pressure: data.hourly?.pressure || data.hourlyForecast?.map((h: any) => h.pressure) || [],
      visibility: data.hourly?.visibility || data.hourlyForecast?.map((h: any) => h.visibility) || [],
      uvIndex: data.hourly?.uvIndex || data.hourlyForecast?.map((h: any) => h.uvIndex) || [],
      condition: data.hourly?.condition || data.hourlyForecast?.map((h: any) => h.condition) || [],
      icon: data.hourly?.icon || data.hourlyForecast?.map((h: any) => h.icon) || [],
      precipitation: data.hourly?.precipitation || data.hourlyForecast?.map((h: any) => h.precipitation) || [],
      precipitationProbability: data.hourly?.precipitationProbability || data.hourlyForecast?.map((h: any) => h.precipitationProbability) || [],
    };

    // Transformar datos diarios (pronóstico de 10 días)
    const daily = {
      time: data.daily?.time || data.dailyForecast?.map((d: any) => d.time) || [],
      temperatureMax: data.daily?.temperatureMax || data.dailyForecast?.map((d: any) => d.temperatureMax) || [],
      temperatureMin: data.daily?.temperatureMin || data.dailyForecast?.map((d: any) => d.temperatureMin) || [],
      humidity: data.daily?.humidity || data.dailyForecast?.map((d: any) => d.humidity) || [],
      windSpeed: data.daily?.windSpeed || data.dailyForecast?.map((d: any) => d.windSpeed) || [],
      windDirection: data.daily?.windDirection || data.dailyForecast?.map((d: any) => d.windDirection) || [],
      pressure: data.daily?.pressure || data.dailyForecast?.map((d: any) => d.pressure) || [],
      visibility: data.daily?.visibility || data.dailyForecast?.map((d: any) => d.visibility) || [],
      uvIndex: data.daily?.uvIndex || data.dailyForecast?.map((d: any) => d.uvIndex) || [],
      condition: data.daily?.condition || data.dailyForecast?.map((d: any) => d.condition) || [],
      icon: data.daily?.icon || data.dailyForecast?.map((d: any) => d.icon) || [],
      precipitation: data.daily?.precipitation || data.dailyForecast?.map((d: any) => d.precipitation) || [],
      precipitationProbability: data.daily?.precipitationProbability || data.dailyForecast?.map((d: any) => d.precipitationProbability) || [],
    };

    return { current, hourly, daily };
  }

  /**
   * Obtiene solo el pronóstico de 10 días usando Google Weather API
   */
  static async get10DayForecast(location: LocationData): Promise<any> {
    try {
      if (!isGoogleApiKeyConfigured()) {
        throw new Error('Google API key no está configurada');
      }

      const apiKey = getGoogleApiKey();
      const url = `${this.DAILY_FORECAST_URL}?location=${location.latitude},${location.longitude}&key=${apiKey}`;
      
      console.log('Fetching Google Weather API:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Weather API Error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Google Weather API Success:', data);
      return data;
    } catch (error) {
      console.error('Error fetching Google Weather 10-day forecast:', error);
      throw new Error('No se pudieron obtener los datos del pronóstico de 10 días de Google');
    }
  }

  /**
   * Obtiene el nombre de la ciudad usando Google Geocoding API
   */
  static async getCityName(location: LocationData): Promise<string> {
    try {
      if (!isGoogleApiKeyConfigured()) {
        throw new Error('Google API key no está configurada');
      }

      const apiKey = getGoogleApiKey();
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${apiKey}&language=es`;
      
      console.log('Google Geocoding URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Google Geocoding response:', data);

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const result = data.results[0];
        
        // Buscar diferentes tipos de componentes de dirección
        const cityComponent = result.address_components.find((component: any) => 
          component.types.includes('locality') || 
          component.types.includes('administrative_area_level_2') ||
          component.types.includes('administrative_area_level_1') ||
          component.types.includes('sublocality') ||
          component.types.includes('sublocality_level_1')
        );
        
        if (cityComponent) {
          console.log('Ciudad encontrada:', cityComponent.long_name);
          return cityComponent.long_name;
        }
        
        // Si no hay componente de ciudad específico, usar la dirección formateada
        if (result.formatted_address) {
          console.log('Usando dirección formateada:', result.formatted_address);
          // Extraer solo la primera parte de la dirección (generalmente la ciudad)
          const addressParts = result.formatted_address.split(',');
          return addressParts[0].trim();
        }
      }

      console.warn('No se encontraron resultados en Google Geocoding');
      return 'Ubicación desconocida';
    } catch (error) {
      console.error('Error fetching city name from Google:', error);
      return 'Ubicación desconocida';
    }
  }

  /**
   * Formatea la temperatura según las preferencias del usuario
   */
  static formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
    if (unit === 'fahrenheit') {
      return `${Math.round((temp * 9/5) + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  }

  /**
   * Formatea la velocidad del viento
   */
  static formatWindSpeed(speed: number, unit: 'kmh' | 'mph' = 'kmh'): string {
    if (unit === 'mph') {
      return `${Math.round(speed * 0.621371)} mph`;
    }
    return `${Math.round(speed)} km/h`;
  }

  /**
   * Formatea la hora
   */
  static formatTime(timeString: string): string {
    const date = new Date(timeString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  /**
   * Formatea la fecha
   */
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
