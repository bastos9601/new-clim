//header principal de la app
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WeatherData, WEATHER_CODES } from '@/types/weather';
import { WeatherService } from '@/services/weatherService';

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
  
  // Función para obtener el icono apropiado según la condición del clima
  const getWeatherIcon = () => {
    return weatherInfo.icon;
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
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleSection: {
    marginBottom: 30,
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
