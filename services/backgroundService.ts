import { WEATHER_CODES } from '@/types/weather';
import { BackgroundImageService } from './backgroundImageService';

export interface BackgroundImage {
  uri: string;
  gradient: string[];
}

export class BackgroundService {
  // URLs de imágenes de fondo (puedes usar imágenes locales o URLs de internet)
  private static backgroundImages: { [key: number]: BackgroundImage } = {
    // Cielo despejado
    0: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#87CEEB', '#98D8E8', '#B0E0E6']
    },
    // Principalmente despejado
    1: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#87CEEB', '#98D8E8', '#B0E0E6']
    },
    // Parcialmente nublado
    2: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#B0C4DE', '#C0C0C0', '#D3D3D3']
    },
    // Nublado
    3: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#708090', '#A9A9A9', '#C0C0C0']
    },
    // Niebla
    45: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#D3D3D3', '#E6E6FA', '#F0F8FF']
    },
    48: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#D3D3D3', '#E6E6FA', '#F0F8FF']
    },
    // Lluvia ligera
    51: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#4682B4', '#5F9EA0', '#87CEEB']
    },
    53: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#4682B4', '#5F9EA0', '#87CEEB']
    },
    55: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#4682B4', '#5F9EA0', '#87CEEB']
    },
    // Lluvia
    61: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#2F4F4F', '#4682B4', '#5F9EA0']
    },
    63: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#2F4F4F', '#4682B4', '#5F9EA0']
    },
    65: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#2F4F4F', '#4682B4', '#5F9EA0']
    },
    // Nieve
    71: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#E6E6FA', '#F0F8FF', '#FFFFFF']
    },
    73: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#E6E6FA', '#F0F8FF', '#FFFFFF']
    },
    75: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#E6E6FA', '#F0F8FF', '#FFFFFF']
    },
    // Tormenta
    95: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#2F2F2F', '#4B0082', '#8A2BE2']
    },
    96: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#2F2F2F', '#4B0082', '#8A2BE2']
    },
    99: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: ['#2F2F2F', '#4B0082', '#8A2BE2']
    },
  };

  // Imagen por defecto
  private static defaultBackground: BackgroundImage = {
    uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    gradient: ['#1a1a2e', '#16213e', '#0f3460']
  };

  // Fondos específicos para diferentes condiciones climáticas
  private static nightMountainBackground: BackgroundImage = {
    uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    gradient: ['#0a0a0a', '#1a1a2e', '#16213e']
  };

  private static cloudyNightBackground: BackgroundImage = {
    uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    gradient: ['#2c3e50', '#34495e', '#2c3e50']
  };

  private static rainyNightBackground: BackgroundImage = {
    uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    gradient: ['#1a1a2e', '#16213e', '#0f3460']
  };

  // Fondo de respaldo con gradiente sólido
  private static fallbackBackground: BackgroundImage = {
    uri: '', // Sin imagen, solo gradiente
    gradient: ['#1a1a2e', '#16213e', '#0f3460']
  };

  // Método para obtener solo gradiente sin imagen
  static getGradientOnly(weatherCode: number, isDay: boolean = true): BackgroundImage {
    if (!isDay) {
      // Nublado nocturno
      if (weatherCode >= 2 && weatherCode <= 3) {
        return {
          uri: '',
          gradient: ['#2c3e50', '#34495e', '#2c3e50']
        };
      }
      // Lluvia nocturna
      if (weatherCode >= 51 && weatherCode <= 67) {
        return {
          uri: '',
          gradient: ['#1a1a2e', '#16213e', '#0f3460']
        };
      }
      // Noche despejada
      return {
        uri: '',
        gradient: ['#0a0a0a', '#1a1a2e', '#16213e']
      };
    }

    // Para el día, usar gradientes específicos
    const background = this.backgroundImages[weatherCode] || this.defaultBackground;
    return {
      uri: '',
      gradient: background.gradient
    };
  }

  static getBackgroundForWeather(weatherCode: number, isDay: boolean = true): BackgroundImage {
    // Convertir código del clima a descripción
    const weatherDescription = this.getWeatherDescriptionFromCode(weatherCode);
    
    // Obtener imagen dinámica del nuevo servicio
    const dynamicImage = BackgroundImageService.getBackgroundImage(weatherDescription, isDay);
    const fallbackGradient = BackgroundImageService.getFallbackGradient(weatherDescription, isDay);
    
    console.log('BackgroundService - Weather Code:', weatherCode, 'Description:', weatherDescription, 'IsDay:', isDay);
    console.log('BackgroundService - Dynamic Image URL:', dynamicImage);
    console.log('BackgroundService - Fallback Gradient:', fallbackGradient);
    
    return {
      uri: dynamicImage,
      gradient: fallbackGradient
    };
  }

  /**
   * Convierte código del clima a descripción
   */
  private static getWeatherDescriptionFromCode(weatherCode: number): string {
    const descriptions: { [key: number]: string } = {
      0: 'Cielo despejado',
      1: 'Principalmente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Niebla',
      48: 'Niebla',
      51: 'Lluvia ligera',
      53: 'Lluvia moderada',
      55: 'Lluvia densa',
      61: 'Lluvia',
      63: 'Lluvia',
      65: 'Lluvia',
      71: 'Nieve',
      73: 'Nieve',
      75: 'Nieve',
      80: 'Chubascos',
      81: 'Chubascos',
      82: 'Chubascos',
      95: 'Tormenta',
      96: 'Tormenta',
      99: 'Tormenta',
    };
    return descriptions[weatherCode] || 'Cielo despejado';
  }

  private static getNightGradient(dayGradient: string[]): string[] {
    // Convertir gradientes de día a noche (más oscuros)
    return dayGradient.map(color => {
      // Convertir hex a RGB y oscurecer
      const hex = color.replace('#', '');
      const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 50);
      const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 50);
      const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 50);
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    });
  }

  static getBackgroundForTimeOfDay(hour: number): BackgroundImage {
    // Cambiar fondo según la hora del día
    if (hour >= 6 && hour < 12) {
      // Mañana
      return {
        uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        gradient: ['#FFB347', '#FFA500', '#FF8C00']
      };
    } else if (hour >= 12 && hour < 18) {
      // Tarde
      return {
        uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        gradient: ['#87CEEB', '#98D8E8', '#B0E0E6']
      };
    } else if (hour >= 18 && hour < 20) {
      // Atardecer
      return {
        uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        gradient: ['#FF6347', '#FF4500', '#FF1493']
      };
    } else {
      // Noche
      return {
        uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        gradient: ['#191970', '#4B0082', '#8A2BE2']
      };
    }
  }
}
