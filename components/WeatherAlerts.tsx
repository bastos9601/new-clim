import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimationService } from '@/services/animationService';

interface WeatherAlert {
  title: string;
  description: string;
  severity: string;
  startTime: string;
  endTime: string;
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
  onAlertPress?: (alert: WeatherAlert) => void;
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ 
  alerts, 
  onAlertPress 
}) => {
  const slideAnim = useRef(AnimationService.createSlideAnimation(-100)).current;
  const fadeAnim = useRef(AnimationService.createFadeAnimation(0)).current;
  const pulseAnim = useRef(AnimationService.createScaleAnimation(1)).current;

  useEffect(() => {
    if (alerts.length > 0) {
      // Entrance animation
      Animated.parallel([
        AnimationService.slide(slideAnim, 0, 500),
        AnimationService.fadeIn(fadeAnim, 600),
      ]).start();

      // Continuous pulse for high severity alerts
      const highSeverityAlerts = alerts.filter(alert => 
        alert.severity.toLowerCase().includes('extreme') || 
        alert.severity.toLowerCase().includes('severe')
      );
      
      if (highSeverityAlerts.length > 0) {
        AnimationService.pulse(pulseAnim, 1000).start();
      }
    }
  }, [alerts]);

  const getSeverityColor = (severity: string): string => {
    const severityLower = severity.toLowerCase();
    
    if (severityLower.includes('extreme')) return '#8B0000';
    if (severityLower.includes('severe')) return '#FF4500';
    if (severityLower.includes('moderate')) return '#FFA500';
    if (severityLower.includes('minor')) return '#FFD700';
    return '#32CD32';
  };

  const getSeverityGradient = (severity: string): string[] => {
    const severityLower = severity.toLowerCase();
    
    if (severityLower.includes('extreme')) return ['#8B0000', '#DC143C', '#FF6347'];
    if (severityLower.includes('severe')) return ['#FF4500', '#FF6347', '#FF7F50'];
    if (severityLower.includes('moderate')) return ['#FFA500', '#FFB347', '#FFD700'];
    if (severityLower.includes('minor')) return ['#FFD700', '#FFFF00', '#ADFF2F'];
    return ['#32CD32', '#00FF00', '#90EE90'];
  };

  const getSeverityIcon = (severity: string): string => {
    const severityLower = severity.toLowerCase();
    
    if (severityLower.includes('extreme')) return '🚨';
    if (severityLower.includes('severe')) return '⚠️';
    if (severityLower.includes('moderate')) return '⚡';
    if (severityLower.includes('minor')) return 'ℹ️';
    return '✅';
  };

  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.title}>Alertas Meteorológicas</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.alertsContainer}
      >
        {alerts.map((alert, index) => (
          <Animated.View
            key={index}
            style={[
              styles.alertCard,
              {
                transform: [
                  { scale: alert.severity.toLowerCase().includes('extreme') ? pulseAnim : 1 }
                ],
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => onAlertPress?.(alert)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={getSeverityGradient(alert.severity) as any}
                style={styles.alertGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.alertHeader}>
                  <Text style={styles.alertIcon}>
                    {getSeverityIcon(alert.severity)}
                  </Text>
                  <Text style={styles.alertSeverity}>
                    {alert.severity.toUpperCase()}
                  </Text>
                </View>
                
                <Text style={styles.alertTitle} numberOfLines={2}>
                  {alert.title}
                </Text>
                
                <Text style={styles.alertDescription} numberOfLines={3}>
                  {alert.description}
                </Text>
                
                <View style={styles.alertTimes}>
                  <Text style={styles.alertTimeLabel}>Inicio:</Text>
                  <Text style={styles.alertTimeValue}>
                    {formatTime(alert.startTime)}
                  </Text>
                  
                  <Text style={styles.alertTimeLabel}>Fin:</Text>
                  <Text style={styles.alertTimeValue}>
                    {formatTime(alert.endTime)}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  alertsContainer: {
    paddingHorizontal: 20,
  },
  alertCard: {
    width: 280,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  alertGradient: {
    padding: 20,
    minHeight: 200,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  alertSeverity: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  alertTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    lineHeight: 22,
  },
  alertDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  alertTimes: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 10,
  },
  alertTimeLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  alertTimeValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
});
