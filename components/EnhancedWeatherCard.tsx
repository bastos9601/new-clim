import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimationService } from '@/services/animationService';
import { DynamicImageService } from '@/services/dynamicImageService';
import { BackgroundImageService } from '@/services/backgroundImageService';
import { GoogleWeatherData } from '@/services/googleWeatherService';

interface EnhancedWeatherCardProps {
  weatherData: GoogleWeatherData;
  isDay: boolean;
  onPress?: () => void;
  style?: any;
}

const { width } = Dimensions.get('window');

export const EnhancedWeatherCard: React.FC<EnhancedWeatherCardProps> = ({
  weatherData,
  isDay,
  onPress,
  style,
}) => {
  const fadeAnim = useRef(AnimationService.createFadeAnimation(0)).current;
  const scaleAnim = useRef(AnimationService.createScaleAnimation(0.8)).current;
  const slideAnim = useRef(AnimationService.createSlideAnimation(50)).current;
  const pulseAnim = useRef(AnimationService.createScaleAnimation(1)).current;
  
  const [imageLoadError, setImageLoadError] = useState(false);

  // Validar que weatherData y weatherData.current existan
  if (!weatherData || !weatherData.current) {
    return (
      <View style={[styles.card, style]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Cargando datos del clima...</Text>
        </View>
      </View>
    );
  }

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      AnimationService.fadeIn(fadeAnim, 1000),
      AnimationService.scale(scaleAnim, 1, 1000),
      AnimationService.slide(slideAnim, 0, 1000),
    ]).start();

    // Pulse animation for temperature
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        AnimationService.scale(pulseAnim, 1.05, 2000),
        AnimationService.scale(pulseAnim, 1, 2000),
      ])
    );
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const getWeatherIcon = (condition: string) => {
    const icons: { [key: string]: string } = {
      'Cielo despejado': '☀️',
      'Principalmente despejado': '🌤️',
      'Parcialmente nublado': '⛅',
      'Nublado': '☁️',
      'Niebla': '🌫️',
      'Lluvia ligera': '🌦️',
      'Lluvia moderada': '🌧️',
      'Lluvia densa': '🌧️',
      'Lluvia': '🌧️',
      'Nieve': '❄️',
      'Chubascos': '🌦️',
      'Tormenta': '⛈️',
      'Despejado': '☀️',
    };
    return icons[condition] || '☀️';
  };

  const getAirQualityText = (aqi: number) => {
    if (aqi <= 50) return 'Buena';
    if (aqi <= 100) return 'Moderada';
    if (aqi <= 150) return 'Insalubre para grupos sensibles';
    if (aqi <= 200) return 'Insalubre';
    if (aqi <= 300) return 'Muy insalubre';
    return 'Peligrosa';
  };

  // Obtener imagen de fondo y gradiente de respaldo
  const backgroundImage = BackgroundImageService.getBackgroundImage(
    weatherData.current.condition || 'Despejado', 
    isDay
  );
  
  const fallbackGradient = BackgroundImageService.getFallbackGradient(
    weatherData.current.condition || 'Despejado', 
    isDay
  );

  const gradients = DynamicImageService.getWeatherGradients(
    weatherData.current.condition || 'clear', 
    isDay
  );

  const accentColors = DynamicImageService.getWeatherAccentColors(
    weatherData.current.condition || 'clear'
  );

  const renderCardContent = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.condition}>{weatherData.current.condition || 'Desconocido'}</Text>
        <Animated.Text
          style={[
            styles.temperature,
            {
              transform: [{ scale: pulseAnim }],
              color: accentColors.primary,
            },
          ]}
        >
          {Math.round(weatherData.current.temperature || 0)}°
        </Animated.Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.leftSection}>
          <Text style={styles.weatherIcon}>
            {getWeatherIcon(weatherData.current.condition || 'Clear')}
          </Text>
          <Text style={styles.feelsLike}>
            Sensación: {Math.round(weatherData.current.feelsLike || weatherData.current.temperature || 0)}°
          </Text>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Humedad</Text>
            <Text style={styles.detailValue}>{weatherData.current.humidity || 0}%</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Viento</Text>
            <Text style={styles.detailValue}>{Math.round(weatherData.current.windSpeed || 0)} km/h</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Presión</Text>
            <Text style={styles.detailValue}>{weatherData.current.pressure || 0} hPa</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Visibilidad</Text>
            <Text style={styles.detailValue}>{weatherData.current.visibility || 0} km</Text>
          </View>
        </View>
      </View>

      {/* Air Quality */}
      {weatherData.current.airQuality && (
        <View style={styles.airQualitySection}>
          <Text style={styles.airQualityLabel}>Calidad del Aire</Text>
          <Text style={styles.airQualityValue}>
            {getAirQualityText(weatherData.current.airQuality.aqi)} (AQI: {weatherData.current.airQuality.aqi})
          </Text>
        </View>
      )}

      {/* UV Index */}
      <View style={styles.uvSection}>
        <Text style={styles.uvLabel}>Índice UV</Text>
        <View style={styles.uvBar}>
          <View
            style={[
              styles.uvFill,
              {
                width: `${Math.min(((weatherData.current.uvIndex || 0) / 11) * 100, 100)}%`,
                backgroundColor: (weatherData.current.uvIndex || 0) > 7 ? '#FF0000' : 
                               (weatherData.current.uvIndex || 0) > 5 ? '#FFA500' : '#00FF00',
              },
            ]}
          />
        </View>
        <Text style={styles.uvValue}>{weatherData.current.uvIndex || 0}</Text>
      </View>

      {/* Sun/Moon Times */}
      <View style={styles.timeSection}>
        <View style={styles.timeItem}>
          <Text style={styles.timeLabel}>Amanecer</Text>
          <Text style={styles.timeValue}>{weatherData.current.sunrise || '06:00'}</Text>
        </View>
        <View style={styles.timeItem}>
          <Text style={styles.timeLabel}>Atardecer</Text>
          <Text style={styles.timeValue}>{weatherData.current.sunset || '18:00'}</Text>
        </View>
      </View>
    </>
  );

  const CardContent = () => (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim },
          ],
        },
        style,
      ]}
    >
      {!imageLoadError && backgroundImage ? (
        <ImageBackground
          source={{ uri: backgroundImage }}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
          onError={() => setImageLoadError(true)}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {renderCardContent()}
          </LinearGradient>
        </ImageBackground>
      ) : (
        <LinearGradient
          colors={fallbackGradient as any}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {renderCardContent()}
        </LinearGradient>
      )}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    padding: 20,
    minHeight: 400,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  condition: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  temperature: {
    color: 'white',
    fontSize: 48,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  mainContent: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  leftSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    paddingLeft: 20,
  },
  weatherIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  feelsLike: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  detailValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  airQualitySection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  airQualityLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 5,
  },
  airQualityValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  uvSection: {
    marginBottom: 15,
  },
  uvLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  uvBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  uvFill: {
    height: '100%',
    borderRadius: 4,
  },
  uvValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
  },
  timeItem: {
    alignItems: 'center',
  },
  timeLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 5,
  },
  timeValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});