import { GoogleWeatherData } from './googleWeatherService';

export interface WeatherImage {
  uri: string;
  type: 'background' | 'icon' | 'particle' | 'overlay';
  animation?: string;
}

export class DynamicImageService {
  // URLs de imágenes de Unsplash para diferentes condiciones climáticas
  private static readonly WEATHER_IMAGES = {
    // Cielo despejado
    clear: {
      background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      icon: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      particle: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    },
    // Nublado
    cloudy: {
      background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      icon: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      particle: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    },
    // Lluvia
    rain: {
      background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      icon: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      particle: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    },
    // Nieve
    snow: {
      background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      icon: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      particle: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    },
    // Tormenta
    storm: {
      background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      icon: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      particle: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    },
    // Niebla
    fog: {
      background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      icon: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      particle: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    },
    // Noche
    night: {
      background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      icon: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      particle: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    },
  };

  /**
   * Obtiene imágenes dinámicas basadas en las condiciones climáticas
   */
  static getWeatherImages(weatherData: GoogleWeatherData, isDay: boolean = true): WeatherImage[] {
    const condition = this.getWeatherCondition(weatherData.current.condition);
    const timeOfDay = isDay ? 'day' : 'night';
    
    const baseImages = this.WEATHER_IMAGES[condition] || this.WEATHER_IMAGES.clear;
    
    return [
      {
        uri: baseImages.background,
        type: 'background',
        animation: this.getBackgroundAnimation(condition, timeOfDay),
      },
      {
        uri: baseImages.icon,
        type: 'icon',
        animation: this.getIconAnimation(condition),
      },
      {
        uri: baseImages.particle,
        type: 'particle',
        animation: this.getParticleAnimation(condition),
      },
    ];
  }

  /**
   * Determina la condición climática principal
   */
  private static getWeatherCondition(condition: string): keyof typeof DynamicImageService.WEATHER_IMAGES {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return 'rain';
    } else if (conditionLower.includes('snow')) {
      return 'snow';
    } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
      return 'storm';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return 'fog';
    } else if (conditionLower.includes('cloud')) {
      return 'cloudy';
    } else {
      return 'clear';
    }
  }

  /**
   * Obtiene animación para el fondo
   */
  private static getBackgroundAnimation(condition: string, timeOfDay: string): string {
    switch (condition) {
      case 'rain':
        return 'rain-fall';
      case 'snow':
        return 'snow-fall';
      case 'storm':
        return 'lightning-flash';
      case 'fog':
        return 'fog-drift';
      case 'cloudy':
        return 'clouds-move';
      default:
        return timeOfDay === 'night' ? 'stars-twinkle' : 'sun-shine';
    }
  }

  /**
   * Obtiene animación para el icono
   */
  private static getIconAnimation(condition: string): string {
    switch (condition) {
      case 'rain':
        return 'rain-drops';
      case 'snow':
        return 'snow-flakes';
      case 'storm':
        return 'lightning-bolt';
      case 'wind':
        return 'wind-sway';
      case 'sun':
        return 'sun-rotate';
      default:
        return 'gentle-pulse';
    }
  }

  /**
   * Obtiene animación para partículas
   */
  private static getParticleAnimation(condition: string): string {
    switch (condition) {
      case 'rain':
        return 'rain-particles';
      case 'snow':
        return 'snow-particles';
      case 'storm':
        return 'lightning-particles';
      case 'fog':
        return 'fog-particles';
      default:
        return 'ambient-particles';
    }
  }

  /**
   * Obtiene gradientes dinámicos basados en el clima
   */
  static getWeatherGradients(condition: string, isDay: boolean = true): string[] {
    const gradients = {
      clear: {
        day: ['#87CEEB', '#98D8E8', '#B0E0E6'],
        night: ['#191970', '#4B0082', '#8A2BE2'],
      },
      cloudy: {
        day: ['#B0C4DE', '#C0C0C0', '#D3D3D3'],
        night: ['#2F4F4F', '#708090', '#A9A9A9'],
      },
      rain: {
        day: ['#4682B4', '#5F9EA0', '#87CEEB'],
        night: ['#1a1a2e', '#16213e', '#0f3460'],
      },
      snow: {
        day: ['#F0F8FF', '#E6E6FA', '#D3D3D3'],
        night: ['#2F2F2F', '#4F4F4F', '#6F6F6F'],
      },
      storm: {
        day: ['#2F4F4F', '#696969', '#A9A9A9'],
        night: ['#0a0a0a', '#1a1a2e', '#16213e'],
      },
      fog: {
        day: ['#D3D3D3', '#E6E6FA', '#F0F8FF'],
        night: ['#2F2F2F', '#4F4F4F', '#6F6F6F'],
      },
    };

    const conditionKey = condition as keyof typeof gradients;
    const timeKey = isDay ? 'day' : 'night';
    
    return gradients[conditionKey]?.[timeKey] || gradients.clear[timeKey];
  }

  /**
   * Obtiene colores de acento basados en el clima
   */
  static getWeatherAccentColors(condition: string): {
    primary: string;
    secondary: string;
    accent: string;
  } {
    const colors = {
      clear: { primary: '#FFD700', secondary: '#FFA500', accent: '#FF6347' },
      cloudy: { primary: '#C0C0C0', secondary: '#A9A9A9', accent: '#708090' },
      rain: { primary: '#4169E1', secondary: '#1E90FF', accent: '#00BFFF' },
      snow: { primary: '#FFFFFF', secondary: '#F0F8FF', accent: '#E6E6FA' },
      storm: { primary: '#FF4500', secondary: '#DC143C', accent: '#B22222' },
      fog: { primary: '#D3D3D3', secondary: '#E6E6FA', accent: '#F0F8FF' },
    };

    return colors[condition as keyof typeof colors] || colors.clear;
  }
}
