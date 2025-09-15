//pronostico para 10 dias principal
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { WeatherData, WEATHER_CODES } from '@/types/weather';
import { WeatherService } from '@/services/weatherService';

interface DailyForecastProps {
  weatherData: WeatherData;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ weatherData }) => {
  const router = useRouter();
  const dailyData = weatherData.daily;
  
  // Crear lista con "Hoy" primero y luego los próximos 9 días
  const todayData = {
    time: dailyData.time[0],
    weatherCode: dailyData.weather_code[0],
    maxTemp: dailyData.temperature_2m_max[0],
    minTemp: dailyData.temperature_2m_min[0],
    precipitationProbability: dailyData.precipitation_probability_max[0],
    precipitation: dailyData.precipitation_sum[0],
  };

  const next9Days = dailyData.time.slice(1, 10).map((time, index) => ({
    time,
    weatherCode: dailyData.weather_code[index + 1],
    maxTemp: dailyData.temperature_2m_max[index + 1],
    minTemp: dailyData.temperature_2m_min[index + 1],
    precipitationProbability: dailyData.precipitation_probability_max[index + 1],
    precipitation: dailyData.precipitation_sum[index + 1],
  }));

  const allDays = [todayData, ...next9Days];

  const formatDay = (timeString: string, index: number) => {
    if (index === 0) return 'Hoy';
    const date = new Date(timeString);
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'set.', 'oct.', 'nov.', 'dic.'];
    return `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]}`;
  };

  const getTemperatureBarWidth = (minTemp: number, maxTemp: number) => {
    const range = maxTemp - minTemp;
    const normalizedMin = Math.max(0, (minTemp + 10) / 40); // Normalizar entre 0-1
    const normalizedMax = Math.max(0, (maxTemp + 10) / 40);
    return {
      left: normalizedMin * 100,
      width: (normalizedMax - normalizedMin) * 100,
    };
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.titleContainer}
        onPress={() => router.push('/(tabs)/daily-forecast')}
      >
        <Text style={styles.title}>Pronóstico para 10 días</Text>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.scrollContainer}>
        {allDays.map((day, index) => {
          const weatherInfo = WEATHER_CODES[day.weatherCode] || WEATHER_CODES[0];
          const barStyle = getTemperatureBarWidth(day.minTemp, day.maxTemp);
          
          return (
            <TouchableOpacity 
              key={index} 
              style={styles.dayItem}
              onPress={() => router.push({
                pathname: '/(tabs)/daily-forecast',
                params: { selectedDay: index }
              })}
            >
              <View style={styles.dayInfo}>
                <Text style={styles.dayText}>
                  {formatDay(day.time, index)}
                </Text>
                <View style={styles.weatherInfo}>
                  <Text style={styles.weatherIcon}>
                    {weatherInfo.icon}
                  </Text>
                  {day.precipitationProbability > 0 && (
                    <Text style={styles.precipitationProbability}>
                      {Math.round(day.precipitationProbability)}%
                    </Text>
                  )}
                </View>
              </View>
              
              <View style={styles.temperatureContainer}>
                <Text style={styles.minTemp}>
                  {WeatherService.formatTemperature(day.minTemp)}
                </Text>
                
                <View style={styles.temperatureBarContainer}>
                  <View style={styles.temperatureBar}>
                    <View 
                      style={[
                        styles.temperatureBarFill,
                        {
                          left: `${barStyle.left}%`,
                          width: `${barStyle.width}%`,
                        }
                      ]} 
                    />
                  </View>
                </View>
                
                <Text style={styles.maxTemp}>
                  {WeatherService.formatTemperature(day.maxTemp)}
                </Text>
              </View>
              <Text style={styles.dayArrow}>→</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginTop: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  arrow: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  dayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  precipitationProbability: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  temperatureContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  minTemp: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '500',
    width: 40,
    textAlign: 'right',
  },
  temperatureBarContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  temperatureBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    position: 'relative',
  },
  temperatureBarFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 3,
  },
  maxTemp: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    width: 40,
    textAlign: 'left',
  },
  dayArrow: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
