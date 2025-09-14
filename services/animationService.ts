import { Animated } from 'react-native';

export class AnimationService {
  /**
   * Animación de fade in/out
   */
  static createFadeAnimation(initialValue: number = 0) {
    return new Animated.Value(initialValue);
  }

  /**
   * Animación de escala
   */
  static createScaleAnimation(initialValue: number = 1) {
    return new Animated.Value(initialValue);
  }

  /**
   * Animación de rotación
   */
  static createRotationAnimation(initialValue: number = 0) {
    return new Animated.Value(initialValue);
  }

  /**
   * Animación de deslizamiento
   */
  static createSlideAnimation(initialValue: number = 0) {
    return new Animated.Value(initialValue);
  }

  /**
   * Fade in animation
   */
  static fadeIn(animatedValue: Animated.Value, duration: number = 1000) {
    return Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    });
  }

  /**
   * Fade out animation
   */
  static fadeOut(animatedValue: Animated.Value, duration: number = 1000) {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    });
  }

  /**
   * Scale animation
   */
  static scale(animatedValue: Animated.Value, toValue: number, duration: number = 500) {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      useNativeDriver: true,
    });
  }

  /**
   * Rotation animation
   */
  static rotate(animatedValue: Animated.Value, toValue: number, duration: number = 1000) {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      useNativeDriver: true,
    });
  }

  /**
   * Slide animation
   */
  static slide(animatedValue: Animated.Value, toValue: number, duration: number = 500) {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      useNativeDriver: true,
    });
  }

  /**
   * Pulse animation
   */
  static pulse(animatedValue: Animated.Value, duration: number = 1000) {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.2,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    );
  }

  /**
   * Shake animation
   */
  static shake(animatedValue: Animated.Value, duration: number = 500) {
    return Animated.sequence([
      Animated.timing(animatedValue, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]);
  }

  /**
   * Bounce animation
   */
  static bounce(animatedValue: Animated.Value, duration: number = 1000) {
    return Animated.spring(animatedValue, {
      toValue: 1,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    });
  }

  /**
   * Weather-specific animations
   */
  static getWeatherAnimation(condition: string) {
    switch (condition.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        return 'rain';
      case 'snow':
        return 'snow';
      case 'wind':
        return 'wind';
      case 'sun':
      case 'clear':
        return 'sun';
      case 'clouds':
      case 'cloudy':
        return 'clouds';
      default:
        return 'default';
    }
  }

  /**
   * Create weather particle animation
   */
  static createWeatherParticles(condition: string) {
    // This would be implemented with actual particle systems
    // For now, return basic animation values
    return {
      rain: this.createFadeAnimation(0),
      snow: this.createFadeAnimation(0),
      wind: this.createRotationAnimation(0),
      sun: this.createScaleAnimation(1),
    };
  }
}
