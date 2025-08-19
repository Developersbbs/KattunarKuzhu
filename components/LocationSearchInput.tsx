import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Box } from '@/components/ui/box';
import { MapPin, X, Search } from 'lucide-react-native';

interface LocationSearchInputProps {
  initialAddress?: string;
  onLocationSelect: (data: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }) => void;
  placeholder?: string;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
}

// Use environment variable or configuration for API key
// In production, this should come from a secure source
// Use environment variable or a constant from app config
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '';

// Log the API key for debugging (remove in production)
console.log('Google API Key:', GOOGLE_API_KEY ? 'Key is present' : 'No key found');

const LocationSearchInput = forwardRef<any, LocationSearchInputProps>(
  ({ initialAddress, onLocationSelect, placeholder = 'Search for a location', backgroundColor, textColor, iconColor }, ref) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [showMap, setShowMap] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [location, setLocation] = useState<{
      address: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const googlePlacesRef = useRef(null);
    const { width: screenWidth } = Dimensions.get('window');

    // Initialize location from initialAddress if provided
    useEffect(() => {
      if (initialAddress && initialAddress.trim() !== '') {
        setLocation({
          address: initialAddress,
          coordinates: {
            // Default coordinates if not provided
            latitude: 20.5937,
            longitude: 78.9629
          }
        });
        setShowMap(true);
      }
    }, [initialAddress]);
    
    const handlePlaceSelect = async (data: any, details: any = null) => {
      console.log('Place selected:', data);
      console.log('Details:', details);
      if (details) {
        setIsLoading(true);
        try {
          const address = details.formatted_address || data.description;
          const { lat, lng } = details.geometry.location;
          
          const locationData = {
            address,
            coordinates: {
              latitude: lat,
              longitude: lng,
            },
          };
          
          setLocation(locationData);
          setShowMap(true);
          onLocationSelect(locationData);
          setModalVisible(false);
        } catch (error) {
          console.error('Error selecting place:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const clearLocation = () => {
      setLocation(null);
      setShowMap(false);
      if (googlePlacesRef.current) {
        (googlePlacesRef.current as any).clear();
      }
    };

    return (
      <Box style={{ marginBottom: 10 }}>
        {/* Location Display / Trigger Button */}
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          style={{
            height: 56,
            borderRadius: 30,
            backgroundColor: backgroundColor || (colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
            paddingHorizontal: 20,
            paddingLeft: 45,
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <MapPin
            size={20}
            color={iconColor || theme.tint}
            style={{
              position: 'absolute',
              left: 15,
            }}
          />
          <Text 
            style={{ 
              flex: 1,
              fontSize: 16,
              color: location ? (textColor || theme.text) : '#666',
              paddingVertical: 15
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {location ? location.address : placeholder}
          </Text>
          {location && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                clearLocation();
              }}
              style={{ padding: 10 }}
            >
              <X size={20} color={theme.text} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Map Preview (if a location is selected) */}
        {showMap && location && (
          <Box style={{ marginTop: 10, height: 200, borderRadius: 20, overflow: 'hidden' }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: location.coordinates.latitude,
                longitude: location.coordinates.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: location.coordinates.latitude,
                  longitude: location.coordinates.longitude,
                }}
                pinColor={theme.tint}
              />
            </MapView>
          </Box>
        )}

        {/* Modal for Google Places Autocomplete */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Box style={{ 
            flex: 1, 
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
            paddingTop: 50
          }}>
            {/* Header */}
            <Box style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              paddingHorizontal: 15,
              marginBottom: 10 
            }}>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={{ padding: 10 }}
              >
                <X size={24} color={theme.text} />
              </TouchableOpacity>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold',
                marginLeft: 10,
                color: theme.text 
              }}>
                Search Location
              </Text>
            </Box>
            
            {/* Search Input - Now in its own scroll container */}
            <Box style={{ flex: 1 }}>
              <GooglePlacesAutocomplete
                ref={googlePlacesRef}
                placeholder="Search for a location"
                minLength={2}
                keyboardShouldPersistTaps="handled"

                fetchDetails={true}
                renderDescription={(row) => row.description}
                onPress={handlePlaceSelect}

                query={{
                  key: GOOGLE_API_KEY,
                  language: 'en',
                  components: 'country:in', // Restrict to India, change as needed
                }}
                styles={{
                  container: {
                    flex: 1,
                    zIndex: 1,
                  },
                  textInputContainer: {
                    width: '100%',
                    backgroundColor: 'transparent',
                  },
                  textInput: {
                    height: 56,
                    color: theme.text,
                    fontSize: 16,
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    borderRadius: 8,
                    paddingHorizontal: 15,
                    paddingLeft: 40,
                  },
                  predefinedPlacesDescription: {
                    color: theme.tint,
                  },
                  listView: {
                    backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
                  },
                  row: {
                    backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
                    padding: 13,
                  },
                  description: {
                    color: colorScheme === 'dark' ? '#ddd' : '#333',
                  },
                  separator: {
                    backgroundColor: colorScheme === 'dark' ? '#444' : '#eee',
                  },
                }}
                enablePoweredByContainer={false}
                debounce={300}
                renderLeftButton={() => (
                  <Box style={{ 
                    position: 'absolute', 
                    left: 10, 
                    top: 16,
                    zIndex: 2
                  }}>
                    <Search size={20} color={theme.tint} />
                  </Box>
                )}
              />
            </Box>
            
            {isLoading && (
              <Box style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)' 
              }}>
                <ActivityIndicator size="large" color={theme.tint} />
              </Box>
            )}
          </Box>
        </Modal>
      </Box>
    );
  }
);

export default LocationSearchInput;