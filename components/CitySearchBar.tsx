import { LocationData } from '@/types/weather';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface CitySearchResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  formatted_address: string;
}

interface CitySearchBarProps {
  currentCity: string;
  onCitySelect: (location: LocationData, cityName: string) => void;
}

export const CitySearchBar: React.FC<CitySearchBarProps> = ({
  currentCity,
  onCitySelect,
}) => {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Función para buscar ciudades usando geocoding
  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Usar Google Geocoding API si está disponible, sino usar OpenStreetMap
      const results = await searchCitiesWithGeocoding(query);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Error buscando ciudades:', error);
      Alert.alert('Error', 'No se pudieron buscar ciudades. Verifica tu conexión.');
    } finally {
      setIsSearching(false);
    }
  };

  // Función para buscar ciudades usando diferentes servicios
  const searchCitiesWithGeocoding = async (query: string): Promise<CitySearchResult[]> => {
    try {
      // Intentar con Google Geocoding API primero
      const googleResults = await searchWithGoogleGeocoding(query);
      if (googleResults.length > 0) {
        return googleResults;
      }
    } catch (error) {
      console.warn('Google Geocoding no disponible:', error);
    }

    // Fallback a OpenStreetMap Nominatim
    return await searchWithNominatim(query);
  };

  // Búsqueda con Google Geocoding API
  const searchWithGoogleGeocoding = async (query: string): Promise<CitySearchResult[]> => {
    // Verificar si hay API key de Google configurada
    const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
    if (!googleApiKey) {
      throw new Error('Google API key no configurada');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${googleApiKey}&language=es&region=pe`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Google Geocoding error: ${data.status}`);
    }

    return data.results.map((result: any) => ({
      name: result.address_components.find((comp: any) => 
        comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')
      )?.long_name || result.formatted_address.split(',')[0],
      country: result.address_components.find((comp: any) => 
        comp.types.includes('country')
      )?.long_name || 'Perú',
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      formatted_address: result.formatted_address,
    }));
  };

  // Búsqueda con OpenStreetMap Nominatim (fallback)
  const searchWithNominatim = async (query: string): Promise<CitySearchResult[]> => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&countrycodes=pe&accept-language=es`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ClimaApp/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return data.map((result: any) => ({
      name: result.display_name.split(',')[0],
      country: result.address?.country || 'Perú',
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      formatted_address: result.display_name,
    }));
  };

  // Manejar selección de ciudad
  const handleCitySelect = (city: CitySearchResult) => {
    const location: LocationData = {
      latitude: city.latitude,
      longitude: city.longitude,
    };
    
    onCitySelect(location, city.name);
    setSearchText('');
    setShowResults(false);
    setSearchResults([]);
  };

  // Manejar cambio en el texto de búsqueda
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (text.length >= 2) {
      searchCities(text);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // Renderizar resultado de búsqueda
  const renderSearchResult = ({ item }: { item: CitySearchResult }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleCitySelect(item)}
    >
      <View style={styles.searchResultContent}>
        <Text style={styles.searchResultName}>{item.name}</Text>
        <Text style={styles.searchResultCountry}>{item.country}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        {/* Icono de ubicación */}
        <View style={styles.locationIcon}>
          <Text style={styles.locationIconText}>📍</Text>
        </View>
        
        {/* Input de búsqueda */}
        <TextInput
          style={styles.searchInput}
          placeholder={currentCity || "Buscar ciudad..."}
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={searchText}
          onChangeText={handleSearchChange}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowResults(true);
            }
          }}
        />
        
        {/* Indicador de carga o icono de perfil */}
        <View style={styles.rightIcon}>
          {isSearching ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>p</Text>
            </View>
          )}
        </View>
      </View>

      {/* Lista de resultados */}
      {showResults && searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item, index) => `${item.latitude}-${item.longitude}-${index}`}
            style={styles.resultsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  locationIcon: {
    marginRight: 10,
  },
  locationIconText: {
    fontSize: 16,
    color: 'white',
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  rightIcon: {
    marginLeft: 10,
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIconText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 15,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resultsList: {
    maxHeight: 200,
  },
  searchResultItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchResultContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchResultName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  searchResultCountry: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
});
