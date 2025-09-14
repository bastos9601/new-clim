import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { AnimationService } from '@/services/animationService';

interface WeatherParticlesProps {
  condition: string;
  intensity: number; // 0-1
  isActive: boolean;
}

const { width, height } = Dimensions.get('window');

export const WeatherParticles: React.FC<WeatherParticlesProps> = ({ 
  condition, 
  intensity, 
  isActive 
}) => {
  const particles = useRef<Animated.Value[]>([]);
  const animations = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    if (isActive) {
      startParticleAnimation();
    } else {
      stopParticleAnimation();
    }

    return () => {
      stopParticleAnimation();
    };
  }, [isActive, condition, intensity]);

  const startParticleAnimation = () => {
    const particleCount = Math.floor(intensity * 50) + 10; // 10-60 particles
    
    // Initialize particles
    particles.current = Array.from({ length: particleCount }, () => 
      new Animated.Value(0)
    );

    // Create animations based on weather condition
    animations.current = particles.current.map((particle, index) => {
      const delay = index * 100; // Stagger animation start
      
      switch (condition.toLowerCase()) {
        case 'rain':
          return createRainAnimation(particle, delay);
        case 'snow':
          return createSnowAnimation(particle, delay);
        case 'storm':
          return createStormAnimation(particle, delay);
        case 'fog':
          return createFogAnimation(particle, delay);
        default:
          return createAmbientAnimation(particle, delay);
      }
    });

    // Start all animations
    animations.current.forEach(animation => animation.start());
  };

  const stopParticleAnimation = () => {
    animations.current.forEach(animation => animation.stop());
    animations.current = [];
  };

  const createRainAnimation = (particle: Animated.Value, delay: number) => {
    const startX = Math.random() * width;
    const duration = 1000 + Math.random() * 2000;
    
    return Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(particle, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(particle, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
  };

  const createSnowAnimation = (particle: Animated.Value, delay: number) => {
    const startX = Math.random() * width;
    const duration = 3000 + Math.random() * 4000;
    
    return Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(particle, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(particle, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
  };

  const createStormAnimation = (particle: Animated.Value, delay: number) => {
    return Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(particle, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(particle, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.delay(Math.random() * 2000),
      ])
    );
  };

  const createFogAnimation = (particle: Animated.Value, delay: number) => {
    return Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(particle, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(particle, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
  };

  const createAmbientAnimation = (particle: Animated.Value, delay: number) => {
    return Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(particle, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(particle, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
  };

  const renderParticle = (particle: Animated.Value, index: number) => {
    const startX = Math.random() * width;
    const startY = -50;
    const endY = height + 50;
    
    const translateY = particle.interpolate({
      inputRange: [0, 1],
      outputRange: [startY, endY],
    });

    const translateX = particle.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [startX, startX + (Math.random() - 0.5) * 100, startX + (Math.random() - 0.5) * 200],
    });

    const opacity = particle.interpolate({
      inputRange: [0, 0.1, 0.9, 1],
      outputRange: [0, 1, 1, 0],
    });

    const scale = particle.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1.5],
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.particle,
          {
            left: startX,
            transform: [
              { translateX },
              { translateY },
              { scale },
            ],
            opacity,
          },
        ]}
      />
    );
  };

  if (!isActive) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.current.map((particle, index) => renderParticle(particle, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
