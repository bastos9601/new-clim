import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LocationData } from '@/types/weather';
import { HybridWeatherService } from '@/services/hybridWeatherService';

interface Google10DayForecastProps {
  location: LocationData;
  onDaySelect?: (dayIndex: number) => void;
}

export const Google10DayForecast: React.FC<Google10DayForecastProps> = ({ 
  location, 
  onDaySelect 
}) => {
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    load10DayForecast();
  }, [location]);

  const load10DayForecast = async () => {
    try {
      setLoading(true);
      const forecast = await HybridWeatherService.get10DayForecast(location);
      setForecastData(forecast);
      console.log('Google 10-Day Forecast loaded:', forecast);
    } catch (error) {
      console.error('Error loading 10-day forecast:', error);
      Alert.alert('Error', 'No se pudo cargar el pronóstico de 10 días');
    } finally {
      setLoading(false);
    }
  };

  const formatDay = (dateString: string, index: number): string => {
    if (index === 0) return 'Hoy';
    
    const date = new Date(dateString);
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
  };

  const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
  };

  const getWeatherIcon = (condition: string): string => {
    const iconMap: { [key: string]: string } = {
      'Clear': '☀️',
      'Sunny': '☀️',
      'Mostly Clear': '🌤️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Overcast': '☁️',
      'Fog': '🌫️',
      'Mist': '🌫️',
      'Light Rain': '🌦️',
      'Moderate Rain': '🌧️',
      'Heavy Rain': '⛈️',
      'Light Drizzle': '🌦️',
      'Moderate Drizzle': '🌧️',
      'Heavy Drizzle': '⛈️',
      'Light Snow': '🌨️',
      'Moderate Snow': '❄️',
      'Heavy Snow': '❄️',
      'Thunderstorm': '⛈️',
      'Light Thunderstorm': '⛈️',
      'Moderate Thunderstorm': '⛈️',
      'Heavy Thunderstorm': '⛈️',
    };
    
    return iconMap[condition] || '☀️';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando pronóstico de 10 días...</Text>
      </View>
    );
  }

  if (!forecastData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se pudieron cargar los datos del pronóstico</Text>
      </View>
    );
  }

  const dailyData = forecastData.dailyForecast || forecastData.daily || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pronóstico para 10 días</Text>
        <Text style={styles.source}>Fuente: {forecastData.source || 'Google Weather API'}</Text>
      </View>

      {/* Carousel de días */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayCarousel}
      >
        {dailyData.time?.slice(0, 10).map((day: string, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCard,
              selectedDay === index && styles.selectedDayCard
            ]}
            onPress={() => {
              setSelectedDay(index);
              onDaySelect?.(index);
            }}
          >
            <Text style={styles.dayName}>{formatDay(day, index)}</Text>
            <Text style={styles.dayIcon}>
              {getWeatherIcon(dailyData.condition?.[index] || 'Clear')}
            </Text>
            <Text style={styles.dayTemp}>
              {Math.round(dailyData.temperature_2m_max?.[index] || 0)}°/{Math.round(dailyData.temperature_2m_min?.[index] || 0)}°
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Detalles del día seleccionado */}
      {dailyData.time && dailyData.time[selectedDay] && (
        <View style={styles.selectedDayDetails}>
          <Text style={styles.selectedDayDate}>
            {formatFullDate(dailyData.time[selectedDay])}
          </Text>
          <View style={styles.selectedDayMain}>
            <Text style={styles.selectedDayTemp}>
              {Math.round(dailyData.temperature_2m_max?.[selectedDay] || 0)}°/{Math.round(dailyData.temperature_2m_min?.[selectedDay] || 0)}°
            </Text>
            <Text style={styles.selectedDayIcon}>
              {getWeatherIcon(dailyData.condition?.[selectedDay] || 'Clear')}
            </Text>
          </View>
          <Text style={styles.selectedDayDescription}>
            {dailyData.condition?.[selectedDay] || 'Despejado'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
  },
  source: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontStyle: 'italic',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  dayCarousel: {
    paddingHorizontal: 10,
  },
  dayCard: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 70,
  },
  selectedDayCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomWidth: 3,
    borderBottomColor: '#007AFF',
  },
  dayName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  dayIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  dayTemp: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  selectedDayDetails: {
    marginTop: 30,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedDayDate: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  selectedDayMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedDayTemp: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
    marginRight: 15,
  },
  selectedDayIcon: {
    fontSize: 32,
  },
  selectedDayDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
});
