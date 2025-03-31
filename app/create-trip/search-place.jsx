import { View, Platform, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { CreateTripContext } from '../../context/CreateTripContext';

const isValidApiKey = (key) => key && key.startsWith('AIza') && key.length > 30;

export default function SearchPlace() {
  const navigation = useNavigation();
  const [WebAutocomplete, setWebAutocomplete] = useState(() => () => null);
  const [apiError, setApiError] = useState(null);
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;
  const { setTripData } = useContext(CreateTripContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: 'Search'
    });

    if (Platform.OS === 'web') {
      if (!isValidApiKey(apiKey)) {
        setApiError('Invalid Google Maps API key format');
        return;
      }

      import('@react-google-maps/api').then(({ LoadScript, Autocomplete }) => {
        const WebAutocompleteComponent = ({ onPlaceSelected }) => {
          const autocompleteRef = useRef(null);
          const [apiLoaded, setApiLoaded] = useState(false);
          const [loadError, setLoadError] = useState(null);

          return (
            <>
              <LoadScript
                googleMapsApiKey={apiKey}
                libraries={['places']}
                onLoad={() => setApiLoaded(true)}
                onError={(error) => setLoadError(error)}
              >
                {apiLoaded ? (
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocompleteRef.current = autocomplete;
                    }}
                    onPlaceChanged={() => {
                      const place = autocompleteRef.current?.getPlace();
                      if (place) {
                        const locationInfo = {
                          name: place.name || place.formatted_address,
                          address: place.formatted_address,
                          placeId: place.place_id,
                          coordinates: {
                            lat: place.geometry?.location?.lat(),
                            lng: place.geometry?.location?.lng()
                          },
                          viewport: {
                            northeast: {
                              lat: place.geometry?.viewport?.getNorthEast()?.lat(),
                              lng: place.geometry?.viewport?.getNorthEast()?.lng()
                            },
                            southwest: {
                              lat: place.geometry?.viewport?.getSouthWest()?.lat(),
                              lng: place.geometry?.viewport?.getSouthWest()?.lng()
                            }
                          },
                          photoReference: place.photos?.[0]?.photo_reference || null,
                          placeUrl: place.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
                          addressComponents: place.address_components,
                          types: place.types
                        };
                        console.log('WEB - Place Data:', locationInfo);
                        onPlaceSelected(locationInfo);
                      }
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search"
                      style={styles.webInput}
                    />
                  </Autocomplete>
                ) : loadError ? (
                  <div style={styles.errorText}>
                    Failed to load Google Maps: {loadError.message}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Loading Google Maps..."
                    style={styles.webInput}
                    disabled
                  />
                )}
              </LoadScript>
            </>
          );
        };
        setWebAutocomplete(() => WebAutocompleteComponent);
      }).catch(err => {
        setApiError(`Failed to load Google Maps library: ${err.message}`);
      });
    }
  }, [apiKey]);

  const handlePlaceSelected = (locationInfo) => {
    console.log('Final Location Info:', locationInfo);
    
    setTripData(prevData => ({
      ...prevData,
      locationInfo: {
        ...locationInfo,
        // Ensure coordinates are plain objects
        coordinates: locationInfo.coordinates ? {
          lat: locationInfo.coordinates.lat,
          lng: locationInfo.coordinates.lng
        } : null,
        // Ensure viewport is plain object
        viewport: locationInfo.viewport ? {
          northeast: {
            lat: locationInfo.viewport.northeast?.lat,
            lng: locationInfo.viewport.northeast?.lng
          },
          southwest: {
            lat: locationInfo.viewport.southwest?.lat,
            lng: locationInfo.viewport.southwest?.lng
          }
        } : null
      }
    }));

    // Navigate after setting data
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('(tabs)');
    }
  };

  if (apiError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <p style={styles.errorText}>{apiError}</p>
          <p style={styles.helpText}>
            Please check your Google Maps API key and ensure these APIs are enabled:
          </p>
          <ul style={styles.helpList}>
            <li>Maps JavaScript API</li>
            <li>Places API</li>
            <li>Geocoding API</li>
          </ul>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <WebAutocomplete onPlaceSelected={handlePlaceSelected} />
      ) : (
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={(data, details = null) => {
            const locationInfo = {
              name: data.description,
              address: data.description,
              placeId: data.place_id,
              coordinates: details?.geometry?.location,
              viewport: details?.geometry?.viewport,
              photoReference: locationInfo.photos?.[0]?.photo_reference || null,
              photoUrl,
              placeUrl: details?.url || `https://www.google.com/maps/place/?q=place_id:${data.place_id}`,
              addressComponents: details?.address_components,
              types: details?.types
            };
            console.log('NATIVE - Place Data:', locationInfo);
            handlePlaceSelected(locationInfo);
          }}
          query={{
            key: apiKey,
            language: 'en',
          }}
          styles={{
            textInput: styles.nativeInput,
            container: styles.autocompleteContainer,
          }}
          fetchDetails={true}
          enablePoweredByContainer={false}
          debounce={300}
          listViewDisplayed="auto"
          minLength={2}
          nearbyPlacesAPI="GooglePlacesSearch"
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3'
          ]}
          // Enable photos in the response
          requestUrl={{
            url: 'https://maps.googleapis.com/maps/api/place',
            params: {
              fields: [
                'formatted_address',
                'geometry',
                'name',
                'place_id',
                'photos',
                'url',
                'address_components',
                'types'
              ].join(',')
            }
          }}
        />
      )}
    </View>
  );
}

// ... (styles remain the same)

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 75,
    backgroundColor: Colors.WHITE,
    height: '100%'
  },
  nativeInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    fontSize: 16
  },
  webInput: {
    width: '100%',
    height: 50,
    padding: 15,
    border: '1px solid #ccc',
    borderRadius: 8,
    fontSize: 16,
    boxSizing: 'border-box'
  },
  autocompleteContainer: {
    flex: 1
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ffeeee',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcccc'
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    marginBottom: 10
  },
  helpText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10
  },
  helpList: {
    marginLeft: 20,
    color: '#666',
    fontSize: 14
  }
});