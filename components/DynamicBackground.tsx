import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ImageBackground, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BackgroundImage } from '@/services/backgroundService';
import { useBackgroundTransition } from '@/hooks/useBackgroundTransition';

interface DynamicBackgroundProps {
  background: BackgroundImage;
  children: React.ReactNode;
}

const { width, height } = Dimensions.get('window');

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ 
  background, 
  children 
}) => {
  const { currentBackground, fadeAnim } = useBackgroundTransition(background);
  const [imageLoadError, setImageLoadError] = useState(false);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
        {!imageLoadError && currentBackground.uri ? (
          <ImageBackground
            source={{ uri: currentBackground.uri }}
            style={styles.imageBackground}
            resizeMode="cover"
            blurRadius={1}
            onError={() => {
              console.log('Error cargando imagen de fondo, usando gradiente');
              setImageLoadError(true);
            }}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
              style={styles.gradientOverlay}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              {children}
            </LinearGradient>
          </ImageBackground>
        ) : (
          <LinearGradient
            colors={currentBackground.gradient as any}
            style={styles.gradientOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            {children}
          </LinearGradient>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    width: width,
    height: height,
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Overlay más oscuro para mejor legibilidad
  },
});
