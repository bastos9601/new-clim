//pronostico para 10 dias segunda pantalla
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  RefreshControl,
  Alert,
  ImageBackground
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WeatherData, LocationData } from '@/types/weather';
import { HybridWeatherService } from '@/services/hybridWeatherService';
import { DynamicBackground } from '@/components/DynamicBackground';
import { BackgroundService } from '@/services/backgroundService';
import { LinearGradient } from 'expo-linear-gradient';
import { EnhancedWeatherCard } from '@/components/EnhancedWeatherCard';
import { WeatherParticles } from '@/components/WeatherParticles';
import { WeatherAlerts } from '@/components/WeatherAlerts';
import { DynamicImageService } from '@/services/dynamicImageService';

const { width } = Dimensions.get('window');

export default function DailyForecastScreen() {
  const router = useRouter();
  const { selectedDay } = useLocalSearchParams();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [cityName, setCityName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(selectedDay ? parseInt(selectedDay as string) : 0);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [googleWeatherData, setGoogleWeatherData] = useState<any>(null);
  const [showParticles, setShowParticles] = useState(true);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const currentLocation = await HybridWeatherService.getCurrentLocation();
      setLocation(currentLocation);
      
      const city = await HybridWeatherService.getCityName(currentLocation);
      setCityName(city);
      
      const weather = await HybridWeatherService.getWeatherData(currentLocation);
      setWeatherData(weather);

      // Obtener pronóstico específico de 10 días con Google Weather API
      try {
        const tenDayForecast = await HybridWeatherService.get10DayForecast(currentLocation);
        console.log('Pronóstico de 10 días obtenido:', tenDayForecast);
        setGoogleWeatherData(tenDayForecast);
      } catch (error) {
        console.warn('Error obteniendo pronóstico de 10 días:', error);
      }
    } catch (error) {
      console.error('Error cargando datos del clima:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del clima');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWeatherData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  useEffect(() => {
    if (selectedDay) {
      setSelectedDayIndex(parseInt(selectedDay as string));
    }
  }, [selectedDay]);

  const formatDay = (timeString: string, index: number) => {
    if (index === 0) return 'Hoy';
    const date = new Date(timeString);
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dayNames[date.getDay()];
  };

  const formatFullDate = (timeString: string) => {
    const date = new Date(timeString);
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                       'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${dayNames[date.getDay()]}, ${date.getDate()} de ${monthNames[date.getMonth()]}`;
  };

  const getWeatherIcon = (weatherCode: number) => {
    const icons: { [key: number]: string } = {
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
    return icons[weatherCode] || '☀️';
  };

  const getWeatherDescription = (weatherCode: number) => {
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
    return descriptions[weatherCode] || 'Despejado';
  };

  // Función para crear datos del día seleccionado
  const createSelectedDayWeatherData = (selectedDay: any, dailyData: any, dayIndex: number) => {
    const weatherCode = selectedDay.weatherCode;
    const maxTemp = selectedDay.maxTemp;
    const minTemp = selectedDay.minTemp;
    const avgTemp = Math.round((maxTemp + minTemp) / 2);
    
    // Obtener datos adicionales del día si están disponibles
    const humidity = dailyData.relative_humidity_2m_max?.[dayIndex] || 60;
    const windSpeed = dailyData.wind_speed_10m_max?.[dayIndex] || 10;
    const windDirection = dailyData.wind_direction_10m_dominant?.[dayIndex] || 180;
    const pressure = dailyData.pressure_msl?.[dayIndex] || 1013;
    const precipitation = dailyData.precipitation_sum?.[dayIndex] || 0;
    const precipitationProbability = dailyData.precipitation_probability_max?.[dayIndex] || 10;
    const uvIndex = dailyData.uv_index_max?.[dayIndex] || 5;
    const sunrise = dailyData.sunrise?.[dayIndex] || '06:30';
    const sunset = dailyData.sunset?.[dayIndex] || '18:30';

    return {
      current: {
        temperature: avgTemp,
        humidity: Math.round(humidity),
        windSpeed: Math.round(windSpeed),
        windDirection: Math.round(windDirection),
        pressure: Math.round(pressure),
        visibility: 10,
        uvIndex: Math.round(uvIndex),
        condition: getWeatherDescription(weatherCode),
        icon: getWeatherIcon(weatherCode),
        feelsLike: avgTemp + Math.round(Math.random() * 3 - 1), // Sensación térmica aproximada
        dewPoint: Math.round(avgTemp - 10),
        cloudCover: Math.round(Math.random() * 50 + 20),
        precipitation: Math.round(precipitation * 10) / 10,
        precipitationProbability: Math.round(precipitationProbability),
        sunrise: sunrise,
        sunset: sunset,
        moonPhase: 'Waxing Crescent',
        airQuality: {
          pm25: Math.round(Math.random() * 20 + 10),
          pm10: Math.round(Math.random() * 30 + 15),
          o3: Math.round(Math.random() * 40 + 60),
          no2: Math.round(Math.random() * 15 + 10),
          so2: Math.round(Math.random() * 5 + 2),
          co: Math.round(Math.random() * 2 + 1),
          aqi: Math.round(Math.random() * 30 + 30),
        },
      },
      hourly: {
        time: [],
        temperature: [],
        humidity: [],
        windSpeed: [],
        windDirection: [],
        pressure: [],
        visibility: [],
        uvIndex: [],
        condition: [],
        icon: [],
        precipitation: [],
        precipitationProbability: [],
        dewPoint: [],
        cloudCover: [],
        feelsLike: [],
        windGust: [],
      },
      daily: {
        time: [],
        temperatureMax: [],
        temperatureMin: [],
        humidity: [],
        windSpeed: [],
        windDirection: [],
        pressure: [],
        visibility: [],
        uvIndex: [],
        condition: [],
        icon: [],
        precipitation: [],
        precipitationProbability: [],
        sunrise: [],
        sunset: [],
        moonPhase: [],
        dewPoint: [],
        cloudCover: [],
        windGust: [],
      },
      alerts: [],
      source: 'Open-Meteo (Selected Day)'
    };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando pronóstico...</Text>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error cargando datos</Text>
      </View>
    );
  }

  const dailyData = weatherData.daily;
  const selectedDayData = {
    date: dailyData.time[selectedDayIndex],
    maxTemp: dailyData.temperature_2m_max[selectedDayIndex],
    minTemp: dailyData.temperature_2m_min[selectedDayIndex],
    weatherCode: dailyData.weather_code[selectedDayIndex],
  };

  // Debug: verificar datos
  const selectedDate = new Date(selectedDayData.date);
  const selectedDateString = selectedDate.toDateString();
  const dayHours = weatherData.hourly.time
    .map((hour, index) => ({ hour, index }))
    .filter(({ hour }) => new Date(hour).toDateString() === selectedDateString);
  
  console.log('Daily Forecast Debug:', {
    selectedDayIndex,
    totalDays: dailyData.time.length,
    totalHours: weatherData.hourly.time.length,
    selectedDay: selectedDayData.date,
    selectedDateString,
    dayHoursCount: dayHours.length,
    firstHour: dayHours[0]?.hour,
    lastHour: dayHours[dayHours.length - 1]?.hour
  });

  // Determinar si es de día o noche basándose en la hora actual
  const currentHour = new Date().getHours();
  const isDay = currentHour >= 6 && currentHour < 18;
  // Usar solo gradientes por defecto para evitar problemas de carga de imágenes
  const background = BackgroundService.getGradientOnly(selectedDayData.weatherCode, isDay);

  return (
    <DynamicBackground background={background}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pronóstico para 10 días</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* 10-Day Forecast  Carousel */}
          <View style={styles.forecastSection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.forecastCarousel}
            >
              {dailyData.time.slice(0, 10).map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCard,
                    selectedDayIndex === index && styles.selectedDayCard
                  ]}
                  onPress={() => setSelectedDayIndex(index)}
                >
                  <Text style={styles.dayName}>{formatDay(day, index)}</Text>
                  <Text style={styles.dayIcon}>
                    {getWeatherIcon(dailyData.weather_code[index])}
                  </Text>
                  <Text style={styles.dayTemp}>
                    {Math.round(dailyData.temperature_2m_max[index])}°/{Math.round(dailyData.temperature_2m_min[index])}°
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Enhanced Weather Card */}
          <View style={styles.enhancedCardSection}>
            <EnhancedWeatherCard
              weatherData={createSelectedDayWeatherData(selectedDayData, dailyData, selectedDayIndex)}
              isDay={isDay}
              onPress={() => setShowParticles(!showParticles)}
            />
          </View>

          {/* Weather Particles */}
          {showParticles && (
            <WeatherParticles
              condition={getWeatherDescription(selectedDayData.weatherCode).toLowerCase() || 'clear'}
              intensity={0.7}
              isActive={true}
            />
          )}

          {/* Weather Alerts */}
          {googleWeatherData?.alerts && googleWeatherData.alerts.length > 0 && (
            <WeatherAlerts
              alerts={googleWeatherData.alerts}
              onAlertPress={(alert) => {
                Alert.alert(alert.title, alert.description);
              }}
            />
          )}

          {/* Hourly Forecast */}
          <View style={styles.hourlySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Pronóstico por hora - {formatFullDate(selectedDayData.date)}
              </Text>
              {(() => {
                const selectedDate = new Date(selectedDayData.date);
                const selectedDateString = selectedDate.toDateString();
                const dayHours = weatherData.hourly.time
                  .map((hour, index) => ({ hour, index }))
                  .filter(({ hour }) => new Date(hour).toDateString() === selectedDateString);
                
                if (dayHours.length < 12) {
                  return (
                    <Text style={styles.fallbackMessage}>
                      * Pronóstico extendido con datos disponibles
                    </Text>
                  );
                }
                return null;
              })()}
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hourlyCarousel}
            >
              {(() => {
                // Filtrar las horas del día seleccionado
                const selectedDate = new Date(selectedDayData.date);
                const selectedDateString = selectedDate.toDateString();
                
                // Encontrar todas las horas que corresponden al día seleccionado
                const dayHours = weatherData.hourly.time
                  .map((hour, index) => ({ hour, index }))
                  .filter(({ hour }) => {
                    const hourDate = new Date(hour);
                    return hourDate.toDateString() === selectedDateString;
                  });
                
                // Si no hay suficientes horas para el día específico, usar las primeras 24 horas
                let hoursToShow = dayHours;
                let showFallbackMessage = false;
                
                if (dayHours.length === 0) {
                  hoursToShow = weatherData.hourly.time.slice(0, 24).map((hour, index) => ({ hour, index }));
                  showFallbackMessage = true;
                } else if (dayHours.length < 12) {
                  // Si hay pocas horas, complementar con las primeras 24 horas
                  const remainingHours = 24 - dayHours.length;
                  const additionalHours = weatherData.hourly.time
                    .slice(0, remainingHours)
                    .map((hour, index) => ({ hour, index }));
                  hoursToShow = [...dayHours, ...additionalHours];
                  showFallbackMessage = true;
                }
                
                return hoursToShow.map(({ hour, index }, cardIndex) => {
                  const hourDate = new Date(hour);
                  const isFirstHour = cardIndex === 0 && selectedDayIndex === 0;
                  
                  return (
                    <View key={index} style={styles.hourCard}>
                      <Text style={styles.hourTemp}>
                        {Math.round(weatherData.hourly.temperature_2m[index])}°
                      </Text>
                      <Text style={styles.hourIcon}>
                        {getWeatherIcon(weatherData.hourly.weather_code[index])}
                      </Text>
                      <Text style={styles.hourTime}>
                        {isFirstHour ? 'Ahora' : hourDate.toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false 
                        })}
                      </Text>
                    </View>
                  );
                });
              })()}
            </ScrollView>
          </View>

          {/* Daily Conditions */}
          <View style={styles.conditionsSection}>
            <Text style={styles.sectionTitle}>Condiciones diarias</Text>
            <View style={styles.conditionsGrid}>
              <View style={styles.conditionCard}>
                <Text style={styles.conditionTitle}>Viento máximo</Text>
                <View style={styles.windIndicator}>
                  <Text style={styles.windDirection}>N</Text>
                </View>
                <Text style={styles.conditionValue}>6 km/h</Text>
                <Text style={styles.conditionDescription}>Leve • Del norte</Text>
              </View>
              
              <View style={styles.conditionCard}>
                <Text style={styles.conditionTitle}>Humedad promedio</Text>
                <View style={styles.humidityIndicator}>
                  <View style={styles.humidityBar}>
                    <View style={[styles.humidityFill, { height: '74%' }]} />
                  </View>
                </View>
                <Text style={styles.conditionValue}>74%</Text>
                <Text style={styles.conditionDescription}>Húmedo</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </DynamicBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  forecastSection: {
    marginBottom: 30,
  },
  forecastCarousel: {
    paddingHorizontal: 20,
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
  selectedDaySection: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  selectedDayBackground: {
    width: '100%',
    minHeight: 200,
  },
  selectedDayBackgroundImage: {
    borderRadius: 20,
  },
  selectedDayGradient: {
    flex: 1,
    padding: 25,
    justifyContent: 'space-between',
    minHeight: 200,
  },
  selectedDayDate: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  selectedDayMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedDayTemp: {
    color: 'white',
    fontSize: 48,
    fontWeight: '700',
    marginRight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  selectedDayIcon: {
    fontSize: 48,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  selectedDayDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  enhancedCardSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  hourlySection: {
    marginBottom: 30,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  fallbackMessage: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontStyle: 'italic',
  },
  hourlyCarousel: {
    paddingHorizontal: 20,
  },
  hourCard: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginRight: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 60,
  },
  hourTemp: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  hourIcon: {
    fontSize: 18,
    marginBottom: 8,
  },
  hourTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  conditionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  conditionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  conditionCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  conditionTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  windIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  windDirection: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  humidityIndicator: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  humidityBar: {
    width: 8,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    justifyContent: 'flex-end',
  },
  humidityFill: {
    backgroundColor: '#FF9500',
    borderRadius: 4,
    width: '100%',
  },
  conditionValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  conditionDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
});
