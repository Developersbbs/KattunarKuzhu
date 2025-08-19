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
      } else if (!initialAddress || initialAddress.trim() === '') {
        // Clear location if initialAddress is empty
        setLocation(null);
        setShowMap(false);
      }
    }, [initialAddress]);
    
    const handlePlaceSelect = async (data: any, details: any = null) => {
      console.log('🔍 LocationSearchInput: Place selected:', data);
      console.log('🔍 LocationSearchInput: Details:', details);
      console.log('🔍 LocationSearchInput: API Key present:', !!GOOGLE_API_KEY);
      
      if (!GOOGLE_API_KEY) {
        console.log('⚠️ Google API Key is missing, but proceeding with predefined places');
      }
      
      setIsLoading(true);
      try {
        let locationData;
        
        if (details && details.geometry && details.geometry.location) {
          // Case 1: Full details available (real Google Places API response)
          console.log('✅ Using full details from Google Places API');
          const address = details.formatted_address || data.description;
          const { lat, lng } = details.geometry.location;
          
          locationData = {
            address,
            coordinates: {
              latitude: lat,
              longitude: lng,
            },
          };
        } else if (data.geometry && data.geometry.location) {
          // Case 2: Predefined places or basic data with geometry
          console.log('✅ Using geometry from data object (predefined places)');
          const address = data.description;
          const location = data.geometry.location;
          
          // Handle both lat/lng and latitude/longitude formats
          const lat = location.lat || location.latitude;
          const lng = location.lng || location.longitude;
          
          locationData = {
            address,
            coordinates: {
              latitude: lat,
              longitude: lng,
            },
          };
        } else {
          // Case 3: Fallback with default coordinates
          console.log('⚠️ No geometry available, using fallback coordinates');
          locationData = {
            address: data.description,
            coordinates: {
              latitude: 20.5937, // Default to center of India
              longitude: 78.9629,
            },
          };
        }
        
        console.log('✅ LocationSearchInput: Setting location data:', locationData);
        setLocation(locationData);
        setShowMap(true);
        console.log('📞 LocationSearchInput: Calling onLocationSelect with:', locationData);
        onLocationSelect(locationData);
        setModalVisible(false);
        console.log('✅ LocationSearchInput: Location selection completed');
        
      } catch (error) {
        console.error('❌ Error selecting place:', error);
        console.log('🔧 Attempting fallback selection...');
        
        // Emergency fallback
        const fallbackLocationData = {
          address: data.description || 'Unknown Location',
          coordinates: {
            latitude: 20.5937,
            longitude: 78.9629,
          },
        };
        
        setLocation(fallbackLocationData);
        setShowMap(true);
        onLocationSelect(fallbackLocationData);
        setModalVisible(false);
        
      } finally {
        setIsLoading(false);
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
              
              {/* Test button - remove after debugging */}
              <TouchableOpacity
                onPress={() => {
                  console.log('🧪 LocationSearchInput: Test button pressed');
                  const testLocation = {
                    address: 'Test Location, Mumbai, Maharashtra, India',
                    coordinates: { latitude: 19.0760, longitude: 72.8777 }
                  };
                  console.log('🧪 LocationSearchInput: Calling onLocationSelect with test data');
                  onLocationSelect(testLocation);
                  setModalVisible(false);
                }}
                style={{ 
                  marginLeft: 'auto',
                  backgroundColor: theme.tint,
                  padding: 8,
                  borderRadius: 5
                }}
              >
                <Text style={{ color: 'white', fontSize: 12 }}>Test</Text>
              </TouchableOpacity>
            </Box>
            
            {/* Search Input - Now in its own scroll container */}
            <Box style={{ flex: 1 }}>
              {/* Simple fallback list when no API key */}
              {!GOOGLE_API_KEY && (
                <Box style={{ marginBottom: 20 }}>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: 'bold', 
                    marginBottom: 10,
                    color: theme.text 
                  }}>
                    Popular Locations:
                  </Text>
                  {[
                    { name: '🏙️ Mumbai, Maharashtra, India', lat: 19.0760, lng: 72.8777 },
                    { name: '🏛️ Delhi, India', lat: 28.6139, lng: 77.2090 },
                    { name: '🌆 Bangalore, Karnataka, India', lat: 12.9716, lng: 77.5946 },
                    { name: '🏖️ Chennai, Tamil Nadu, India', lat: 13.0827, lng: 80.2707 }
                  ].map((city, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        const locationData = {
                          address: city.name,
                          coordinates: {
                            latitude: city.lat,
                            longitude: city.lng,
                          },
                        };
                        setLocation(locationData);
                        setShowMap(true);
                        onLocationSelect(locationData);
                        setModalVisible(false);
                      }}
                      style={{
                        padding: 15,
                        borderBottomWidth: 1,
                        borderBottomColor: colorScheme === 'dark' ? '#444' : '#eee',
                        backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
                      }}
                    >
                      <Text style={{ 
                        fontSize: 16,
                        color: colorScheme === 'dark' ? '#ddd' : '#333' 
                      }}>
                        {city.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Box>
              )}
              
              <GooglePlacesAutocomplete
                ref={googlePlacesRef}
                placeholder="Search for a location"
                minLength={2}
                keyboardShouldPersistTaps="handled"
                fetchDetails={true}
                renderDescription={(row) => {
                  return row.description;
                }}
                onPress={(data, details) => {
                  handlePlaceSelect(data, details);
                }}
                textInputProps={{
                  onChangeText: (text) => {
                  }
                }}

                query={{
                  key: GOOGLE_API_KEY || 'demo', // Fallback for demo purposes
                  language: 'en',
                  components: 'country:in', // Restrict to India, change as needed
                }}
                predefinedPlaces={(() => {
                  const places = !GOOGLE_API_KEY ? [
                    {
                      description: '🏙️ Mumbai, Maharashtra, India',
                      geometry: { location: { lat: 19.0760, lng: 72.8777, latitude: 19.0760, longitude: 72.8777 } }
                    },
                    {
                      description: '🏛️ Delhi, India', 
                      geometry: { location: { lat: 28.6139, lng: 77.2090, latitude: 28.6139, longitude: 77.2090 } }
                    },
                    {
                      description: '🌆 Bangalore, Karnataka, India',
                      geometry: { location: { lat: 12.9716, lng: 77.5946, latitude: 12.9716, longitude: 77.5946 } }
                    },
                    {
                      description: '🏖️ Chennai, Tamil Nadu, India',
                      geometry: { location: { lat: 13.0827, lng: 80.2707, latitude: 13.0827, longitude: 80.2707 } }
                    }
                  ] : [];
                  return places;
                })()}
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