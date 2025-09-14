import { useState, useEffect } from 'react';
import { Animated } from 'react-native';
import { BackgroundImage } from '@/services/backgroundService';

export const useBackgroundTransition = (background: BackgroundImage) => {
  const [currentBackground, setCurrentBackground] = useState<BackgroundImage>(background);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (background.uri !== currentBackground.uri) {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Change background
        setCurrentBackground(background);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [background, currentBackground, fadeAnim]);

  return { currentBackground, fadeAnim };
};
