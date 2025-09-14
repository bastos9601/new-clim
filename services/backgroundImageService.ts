export class BackgroundImageService {
  // Mapeo de condiciones climáticas a imágenes de fondo específicas
  private static readonly WEATHER_BACKGROUNDS = {
    // Cielo despejado - día
    'Cielo despejado': {
      day: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop&crop=center',
      night: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=1200&fit=crop&crop=center'
    },
    // Principalmente despejado
    'Principalmente despejado': {
      day: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1200&fit=crop&crop=center',
      night: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=1200&fit=crop&crop=center'
    },
    // Parcialmente nublado
    'Parcialmente nublado': {
      day: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1200&fit=crop&crop=center',
      night: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop&crop=center'
    },
    // Nublado
    'Nublado': {
      day: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=1200&fit=crop&crop=center',
      night: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=1200&fit=crop&crop=center'
    },
    // Niebla
    'Niebla': {
      day: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop&crop=center',
      night: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=1200&fit=crop&crop=center'
    },
    // Lluvia ligera
    'Lluvia ligera': {
      day: 'https://images.unsplash.com/photo-1433863448220-78aaa064ff47?w=800&h=1200&fit=crop&crop=center',
      night: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=1200&fit=crop&crop=center'
    },
    // Lluvia moderada
    'Lluvia moderada': {
      day: 'https://images.unsplash.com/photo-1433863448220-78aaa064ff47?w=800&h=1200&fit=crop&crop=center',
      night: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=1200&fit=crop&crop=center'
    },
    // Lluvia densa
    'Lluvia densa': {
      day: 'https://images.unsplash.com/photo-1433863448220-78aaa064ff47?w=800&h=1200&fit=crop&crop=center',
      night: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop&crop=center'
    },
    // Lluvia
    'Lluvia': {
      day: 'https://images.unsplash.com/photo-1433863448220-78aaa064ff47?w=800&h=1200&fit=crop&crop=center',
      night: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=1200&fit=crop&crop=center'
    },
    // Nieve
    'Nieve': {
      day: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop&crop=center',
      night: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=1200&fit=crop&crop=center'
    },
    // Chubascos
    'Chubascos': {
      day: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1200&fit=crop&crop=center',
      night: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=1200&fit=crop&crop=center'
    },
    // Tormenta
    'Tormenta': {
      day: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop&crop=center',
      night: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop&crop=center'
    },
    // Despejado (fallback)
    'Despejado': {
      day: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop&crop=center',
      night: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=1200&fit=crop&crop=center'
    }
  };

  /**
   * Obtiene la imagen de fondo según la condición climática y el momento del día
   */
  static getBackgroundImage(condition: string, isDay: boolean): string {
    const weatherKey = condition as keyof typeof this.WEATHER_BACKGROUNDS;
    const weatherData = this.WEATHER_BACKGROUNDS[weatherKey];
    
    if (weatherData) {
      return isDay ? weatherData.day : weatherData.night;
    }
    
    // Fallback a despejado si no se encuentra la condición
    return isDay 
      ? this.WEATHER_BACKGROUNDS['Despejado'].day 
      : this.WEATHER_BACKGROUNDS['Despejado'].night;
  }

  /**
   * Obtiene un gradiente de respaldo para cuando la imagen no carga
   */
  static getFallbackGradient(condition: string, isDay: boolean): string[] {
    const gradients = {
      'Cielo despejado': isDay 
        ? ['#87CEEB', '#98D8E8', '#B0E0E6'] 
        : ['#191970', '#000080', '#0000CD'],
      'Principalmente despejado': isDay 
        ? ['#B0C4DE', '#D3D3D3', '#F0F8FF'] 
        : ['#2F4F4F', '#708090', '#778899'],
      'Parcialmente nublado': isDay 
        ? ['#D3D3D3', '#C0C0C0', '#A9A9A9'] 
        : ['#696969', '#808080', '#A9A9A9'],
      'Nublado': isDay 
        ? ['#A9A9A9', '#808080', '#696969'] 
        : ['#2F2F2F', '#1C1C1C', '#000000'],
      'Lluvia': isDay 
        ? ['#4682B4', '#5F9EA0', '#708090'] 
        : ['#2F4F4F', '#1C1C1C', '#000000'],
      'Tormenta': isDay 
        ? ['#2F4F4F', '#1C1C1C', '#000000'] 
        : ['#000000', '#1C1C1C', '#2F2F2F'],
      'Nieve': isDay 
        ? ['#F0F8FF', '#E6E6FA', '#D3D3D3'] 
        : ['#708090', '#2F4F4F', '#1C1C1C']
    };

    const conditionKey = condition as keyof typeof gradients;
    return gradients[conditionKey] || (isDay ? ['#87CEEB', '#98D8E8', '#B0E0E6'] : ['#191970', '#000080', '#0000CD']);
  }
}
