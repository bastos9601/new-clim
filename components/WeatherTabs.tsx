import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface WeatherTabsProps {
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'precipitaciones', label: 'Precipitaciones' },
  { id: 'viento', label: 'Viento' },
  { id: 'humedad', label: 'Humedad' },
];

export const WeatherTabs: React.FC<WeatherTabsProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('resumen');

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => handleTabPress(tab.id)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
            {activeTab === tab.id && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 20,
    position: 'relative',
  },
  activeTab: {
    // Estilos para tab activo
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#4A90E2',
    borderRadius: 1,
  },
});
