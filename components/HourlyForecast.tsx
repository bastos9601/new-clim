//pro
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { WeatherData } from '@/types/weather';
import { WeatherService } from '@/services/weatherService';

interface HourlyForecastProps {
  weatherData: WeatherData;
}

const { width } = Dimensions.get('window');

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ weatherData }) => {
  // Obtener las próximas 48 horas para el carrusel
  const hourlyData = weatherData.hourly;
  const next48Hours = hourlyData.time.slice(0, 48).map((time, index) => ({
    time,
    temperature: hourlyData.temperature_2m[index],
    weatherCode: hourlyData.weather_code[index],
    isDay: hourlyData.time[index] ? new Date(hourlyData.time[index]).getHours() >= 6 && new Date(hourlyData.time[index]).getHours() < 18 : true,
  }));

  const formatHour = (timeString: string, index: number) => {
    if (index === 0) return 'Ahora';
    const date = new Date(timeString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false 
    });
  };

  const getWeatherIcon = (weatherCode: number, isDay: boolean) => {
    // Iconos para día
    const dayIcons: { [key: number]: string } = {
      0: '☀️', // Cielo despejado
      1: '🌤️', // Principalmente despejado
      2: '⛅', // Parcialmente nublado
      3: '☁️', // Nublado
      45: '🌫️', // Niebla
      48: '🌫️', // Niebla
      51: '🌦️', // Lluvia ligera
      53: '🌦️', // Lluvia moderada
      55: '🌦️', // Lluvia densa
      61: '🌧️', // Lluvia
      63: '🌧️', // Lluvia
      65: '🌧️', // Lluvia
      71: '❄️', // Nieve
      73: '❄️', // Nieve
      75: '❄️', // Nieve
      80: '🌦️', // Chubascos
      81: '🌦️', // Chubascos
      82: '🌦️', // Chubascos
      95: '⛈️', // Tormenta
      96: '⛈️', // Tormenta
      99: '⛈️', // Tormenta
    };

    // Iconos para noche
    const nightIcons: { [key: number]: string } = {
      0: '🌙', // Cielo despejado
      1: '🌙', // Principalmente despejado
      2: '☁️', // Parcialmente nublado
      3: '☁️', // Nublado
      45: '🌫️', // Niebla
      48: '🌫️', // Niebla
      51: '🌧️', // Lluvia ligera
      53: '🌧️', // Lluvia moderada
      55: '🌧️', // Lluvia densa
      61: '🌧️', // Lluvia
      63: '🌧️', // Lluvia
      65: '🌧️', // Lluvia
      71: '❄️', // Nieve
      73: '❄️', // Nieve
      75: '❄️', // Nieve
      80: '🌧️', // Chubascos
      81: '🌧️', // Chubascos
      82: '🌧️', // Chubascos
      95: '⛈️', // Tormenta
      96: '⛈️', // Tormenta
      99: '⛈️', // Tormenta
    };

    return isDay ? dayIcons[weatherCode] || '☀️' : nightIcons[weatherCode] || '🌙';
  };

  // Verificar que tengamos datos válidos
  if (!weatherData || !weatherData.hourly || !weatherData.hourly.time || !weatherData.hourly.temperature_2m) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pronóstico por hora</Text>
        <Text style={styles.subtitle}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pronóstico por hora</Text>
      <Text style={styles.subtitle}>Desliza para ver las próximas 48 horas</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {next48Hours.map((hour, index) => {
          const weatherIcon = getWeatherIcon(hour.weatherCode, hour.isDay);
          const formattedTemp = WeatherService.formatTemperature(hour.temperature);
          const formattedHour = formatHour(hour.time, index);
          
          return (
            <View key={index} style={styles.hourItem}>
              <Text style={styles.temperature}>
                {formattedTemp}
              </Text>
              <Text style={styles.weatherIcon}>
                {weatherIcon}
              </Text>
              <Text style={styles.hourText}>
                {formattedHour}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 20,
    marginTop: 10,
    height: 210,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hourItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    width: 75,
    height: 110,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  temperature: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  weatherIcon: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  hourText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});