import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { WeatherData, WEATHER_CODES } from '@/types/weather';
import { WeatherService } from '@/services/weatherService';
import { BackgroundService } from '@/services/backgroundService';
import { DynamicBackground } from './DynamicBackground';

interface WeatherCardProps {
  weatherData: WeatherData;
  cityName: string;
}

const { width } = Dimensions.get('window');

export const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, cityName }) => {
  const currentWeather = weatherData.current;
  const weatherInfo = WEATHER_CODES[currentWeather.weather_code] || WEATHER_CODES[0];
  
  // Obtener temperatura máxima y mínima del día actual
  const todayMaxTemp = weatherData.daily.temperature_2m_max[0];
  const todayMinTemp = weatherData.daily.temperature_2m_min[0];

  // Obtener fondo dinámico según el clima
  const background = BackgroundService.getBackgroundForWeather(
    currentWeather.weather_code, 
    currentWeather.is_day === 1
  );

  return (
    <DynamicBackground background={background}>
      {/* Header con ubicación */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>🏠</Text>
          <Text style={styles.locationText}>{cityName}</Text>
        </View>
      </View>

      {/* Temperatura actual */}
      <View style={styles.temperatureContainer}>
        <Text style={styles.temperature}>
          {WeatherService.formatTemperature(currentWeather.temperature_2m)}
        </Text>
        <Text style={styles.weatherDescription}>
          {weatherInfo.description}
        </Text>
        <Text style={styles.temperatureRange}>
          H:{WeatherService.formatTemperature(todayMaxTemp)} L:{WeatherService.formatTemperature(todayMinTemp)}
        </Text>
      </View>

      {/* Información adicional */}
      <View style={styles.additionalInfo}>
        <Text style={styles.additionalText}>
          Condiciones parcialmente nubladas esperadas alrededor de las 1PM. 
          Ráfagas de viento de hasta {WeatherService.formatWindSpeed(currentWeather.wind_gusts_10m)}.
        </Text>
      </View>
    </DynamicBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 300,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  temperatureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  temperature: {
    color: 'white',
    fontSize: 72,
    fontWeight: '300',
    marginBottom: 8,
  },
  weatherDescription: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  temperatureRange: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '400',
  },
  additionalInfo: {
    paddingHorizontal: 20,
  },
  additionalText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
