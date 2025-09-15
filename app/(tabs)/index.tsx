import { CitySearchBar } from '@/components/CitySearchBar';
import { DailyForecast } from '@/components/DailyForecast';
import { DynamicBackground } from '@/components/DynamicBackground';
import { HourlyForecast } from '@/components/HourlyForecast';
import { WeatherHeader } from '@/components/WeatherHeader';
import { BackgroundService } from '@/services/backgroundService';
import { WeatherService } from '@/services/weatherService';
import { LocationData, WeatherData } from '@/types/weather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StatusBar, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [cityName, setCityName] = useState<string>('Cargando...');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      
      // Obtener ubicación actual
      const currentLocation = await WeatherService.getCurrentLocation();
      setLocation(currentLocation);
      
      // Obtener nombre de la ciudad
      const city = await WeatherService.getCityName(currentLocation.latitude, currentLocation.longitude);
      setCityName(city);
      
      // Obtener datos del clima
      const weather = await WeatherService.getWeatherData(currentLocation);
      setWeatherData(weather);
      
    } catch (error) {
      console.error('Error cargando datos del clima:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los datos del clima. Verifica tu conexión a internet.',
        [{ text: 'Reintentar', onPress: loadWeatherData }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWeatherData();
  };

  // Función para manejar la selección de una nueva ciudad
  const handleCitySelect = async (newLocation: LocationData, newCityName: string) => {
    try {
      setLoading(true);
      setLocation(newLocation);
      setCityName(newCityName);
      
      // Obtener datos del clima para la nueva ubicación
      const weather = await WeatherService.getWeatherData(newLocation);
      setWeatherData(weather);
      
    } catch (error) {
      console.error('Error cargando datos del clima para la nueva ciudad:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los datos del clima para la ciudad seleccionada.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadWeatherData();
  }, []);

  // Obtener fondo dinámico - usar fondo nocturno especial
  const background = weatherData 
    ? BackgroundService.getBackgroundForWeather(
        weatherData.current.weather_code, 
        weatherData.current.is_day === 1
      )
    : BackgroundService.getBackgroundForWeather(0, false); // Usar modo nocturno por defecto

  if (loading || !weatherData) {
    return (
      <DynamicBackground background={background}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <View style={styles.loadingSpinner} />
          </View>
        </View>
      </DynamicBackground>
    );
  }

  return (
    <DynamicBackground background={background}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
            colors={['white']}
          />
        }
      >
        <CitySearchBar 
          currentCity={cityName} 
          onCitySelect={handleCitySelect} 
        />
        <WeatherHeader weatherData={weatherData} cityName={cityName} />
        <HourlyForecast weatherData={weatherData} />
        <DailyForecast weatherData={weatherData} />
      </ScrollView>
    </DynamicBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 50,
    height: 50,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: 25,
    // Animación de rotación se puede agregar con Animated si es necesario
  },
});
