//header principal de la app primera tarjeta
import { WeatherService } from '@/services/weatherService';
import { WEATHER_CODES, WeatherData } from '@/types/weather';
import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';

interface WeatherHeaderProps {
  weatherData: WeatherData;
  cityName: string;
}

const { width } = Dimensions.get('window');

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({ weatherData, cityName }) => {
  const currentWeather = weatherData.current;
  
  // Obtener la información del clima basada en el código WMO
  const weatherCode = currentWeather.weather_code;
  const weatherInfo = WEATHER_CODES[weatherCode] || WEATHER_CODES[0];
  
  // Función para determinar si es día o noche
  const isDayTime = () => {
    const currentHour = new Date().getHours();
    // Usar horarios más realistas: 6 AM a 7 PM es día
    return currentHour >= 6 && currentHour < 19;
  };
  
  // Función para obtener la imagen de fondo según el clima y momento del día
  const getBackgroundImage = () => {
    const isDay = isDayTime();
    const weatherDescription = weatherInfo.description.toLowerCase();
    
    // Mapeo de condiciones climáticas a imágenes
    if (weatherDescription.includes('clear') || weatherDescription.includes('despejado')) {
      return isDay 
        ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' // Cielo despejado día
        : 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=600&fit=crop'; // Cielo estrellado noche
    } else if (weatherDescription.includes('cloud') || weatherDescription.includes('nublado')) {
      return isDay
        ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' // Cielo nublado día
        : 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop'; // Cielo nublado noche
    } else if (weatherDescription.includes('rain') || weatherDescription.includes('lluvia') || weatherDescription.includes('drizzle')) {
      return isDay
        ? 'https://images.unsplash.com/photo-1433863448220-78aaa064ff47?w=800&h=600&fit=crop' // Lluvia día
        : 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop'; // Lluvia noche
    } else if (weatherDescription.includes('snow') || weatherDescription.includes('nieve')) {
      return isDay
        ? 'https://images.unsplash.com/photo-1551524164-6cf2ac5313c2?w=800&h=600&fit=crop' // Nieve día
        : 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop'; // Nieve noche
    } else if (weatherDescription.includes('thunderstorm') || weatherDescription.includes('tormenta')) {
      return isDay
        ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' // Tormenta día
        : 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop'; // Tormenta noche
    } else if (weatherDescription.includes('fog') || weatherDescription.includes('niebla')) {
      return isDay
        ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' // Niebla día
        : 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop'; // Niebla noche
    } else {
      // Por defecto, cielo despejado
      return isDay
        ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
        : 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=600&fit=crop';
    }
  };
  
  // Función para obtener el icono apropiado según la condición del clima y momento del día
  const getWeatherIcon = () => {
    const isDay = isDayTime();
    const weatherDescription = weatherInfo.description.toLowerCase();
    
    // Mapeo de iconos según clima y momento del día
    if (weatherDescription.includes('clear') || weatherDescription.includes('despejado')) {
      return isDay ? '☀️' : '🌙'; // Sol para día, luna para noche
    } else if (weatherDescription.includes('cloud') || weatherDescription.includes('nublado')) {
      return isDay ? '⛅' : '☁️'; // Sol con nubes para día, nubes para noche
    } else if (weatherDescription.includes('rain') || weatherDescription.includes('lluvia') || weatherDescription.includes('drizzle')) {
      return isDay ? '🌦️' : '🌧️'; // Sol con lluvia para día, lluvia para noche
    } else if (weatherDescription.includes('snow') || weatherDescription.includes('nieve')) {
      return '❄️'; // Nieve es igual para día y noche
    } else if (weatherDescription.includes('thunderstorm') || weatherDescription.includes('tormenta')) {
      return '⛈️'; // Tormenta es igual para día y noche
    } else if (weatherDescription.includes('fog') || weatherDescription.includes('niebla')) {
      return '🌫️'; // Niebla es igual para día y noche
    } else {
      // Por defecto, usar el icono original pero adaptado al momento del día
      return isDay ? '☀️' : '🌙';
    }
  };
  
  // Función para obtener la descripción en español
  const getWeatherDescription = () => {
    const descriptions: { [key: string]: string } = {
      'Clear sky': 'Despejado',
      'Mainly clear': 'Mayormente despejado',
      'Partly cloudy': 'Parcialmente nublado',
      'Overcast': 'Muy nublado',
      'Fog': 'Niebla',
      'Depositing rime fog': 'Niebla con escarcha',
      'Light drizzle': 'Llovizna ligera',
      'Moderate drizzle': 'Llovizna moderada',
      'Dense drizzle': 'Llovizna densa',
      'Light freezing drizzle': 'Llovizna helada ligera',
      'Dense freezing drizzle': 'Llovizna helada densa',
      'Slight rain': 'Lluvia ligera',
      'Moderate rain': 'Lluvia moderada',
      'Heavy rain': 'Lluvia intensa',
      'Light freezing rain': 'Lluvia helada ligera',
      'Heavy freezing rain': 'Lluvia helada intensa',
      'Slight snow fall': 'Nieve ligera',
      'Moderate snow fall': 'Nieve moderada',
      'Heavy snow fall': 'Nieve intensa',
      'Snow grains': 'Granos de nieve',
      'Slight rain showers': 'Chubascos ligeros',
      'Moderate rain showers': 'Chubascos moderados',
      'Violent rain showers': 'Chubascos intensos',
      'Slight snow showers': 'Chubascos de nieve ligeros',
      'Heavy snow showers': 'Chubascos de nieve intensos',
      'Thunderstorm': 'Tormenta',
      'Thunderstorm with slight hail': 'Tormenta con granizo ligero',
      'Thunderstorm with heavy hail': 'Tormenta con granizo intenso',
    };
    
    return descriptions[weatherInfo.description] || weatherInfo.description;
  };
  
  return (
    <ImageBackground 
      source={{ uri: getBackgroundImage() }} 
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      {/* Overlay oscuro para mejorar la legibilidad del texto */}
      <View style={styles.overlay} />
      
      {/* Título y tiempo actual */}
      <View style={styles.titleSection}>
        <Text style={styles.currentTime}>Ahora</Text>
        <Text style={styles.cityName}>{cityName}</Text>
      </View>

      {/* Información principal del clima */}
      <View style={styles.mainInfo}>
        {/* Temperatura y icono */}
        <View style={styles.temperatureSection}>
          <Text style={styles.temperature}>
            {WeatherService.formatTemperature(currentWeather.temperature_2m)}
          </Text>
          <View style={styles.weatherIconContainer}>
            <Text style={styles.weatherIcon}>{getWeatherIcon()}</Text>
            <Text style={styles.smallCloud}>☁️</Text>
          </View>
        </View>

        {/* Detalles del clima a la derecha */}
        <View style={styles.detailsSection}>
          <Text style={styles.condition}>{getWeatherDescription()}</Text>
          <Text style={styles.feelsLike}>
            Sensación térmica: {WeatherService.formatTemperature(currentWeather.apparent_temperature)}
          </Text>
          <Text style={styles.maxMinTemp}>
            Máxima: {WeatherService.formatTemperature(weatherData.daily.temperature_2m_max[0])} + Mínima: {WeatherService.formatTemperature(weatherData.daily.temperature_2m_min[0])}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    minHeight: 300,
    position: 'relative',
  },
  backgroundImage: {
    resizeMode: 'cover',
    opacity: 0.8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
  titleSection: {
    marginBottom: 30,
    zIndex: 2,
    position: 'relative',
  },
  currentTime: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  cityName: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 2,
    position: 'relative',
  },
  temperatureSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperature: {
    color: 'white',
    fontSize: 64,
    fontWeight: '300',
    marginRight: 15,
  },
  weatherIconContainer: {
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 28,
    marginBottom: 2,
  },
  smallCloud: {
    fontSize: 14,
  },
  detailsSection: {
    alignItems: 'flex-start',
    marginTop: 10,
    flex: 1,
  },
  condition: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  feelsLike: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 6,
  },
  maxMinTemp: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
});
