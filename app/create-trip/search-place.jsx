import { View, Platform, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const isValidApiKey = (key) => key && key.startsWith('AIza') && key.length > 30;

export default function SearchPlace() {
  const navigation = useNavigation();
  const [WebAutocomplete, setWebAutocomplete] = useState(() => () => null);
  const [apiError, setApiError] = useState(null);
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;

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
                        console.group('WEB - Place Selection Data');
                        console.log('Description:', place.formatted_address);
                        console.log('Location:', place.geometry?.location);
                        console.log('Photo Reference:', place.photos?.[0]?.photo_reference);
                        console.log('Place URL:', place.url);
                        console.log('Full Place Object:', place);
                        console.groupEnd();
                        
                        onPlaceSelected({
                          description: place.formatted_address,
                          place_id: place.place_id,
                          geometry: place.geometry,
                          name: place.name,
                          photos: place.photos,
                          url: place.url,
                          address_components: place.address_components,
                          types: place.types
                        }, place); // Passing full details as second parameter
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

  const handlePlaceSelected = (data, details = null) => {
    console.group('SELECTED PLACE DETAILS');
    console.log('Basic Information:');
    console.log('- Description:', data.description);
    console.log('- Name:', data.name);
    console.log('- Place ID:', data.place_id);
    
    console.log('\nLocation Data:');
    console.log('- Coordinates:', details?.geometry?.location);
    console.log('- Viewport:', details?.geometry?.viewport);
    
    console.log('\nMedia References:');
    console.log('- Primary Photo Reference:', details?.photos?.[0]?.photo_reference);
    console.log('- All Photos:', details?.photos);
    console.log('- Place URL:', details?.url);
    
    console.log('\nAdditional Details:');
    console.log('- Address Components:', details?.address_components);
    console.log('- Place Types:', details?.types);
    console.groupEnd();

    // You can use this data for navigation or state updates
    // navigation.navigate('Map', { location: details?.geometry?.location });
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
            console.group('NATIVE - Place Selection Data');
            console.log('Description:', data.description);
            console.log('Location:', details?.geometry?.location);
            console.log('Photo Reference:', details?.photos?.[0]?.photo_reference);
            console.log('Place URL:', details?.url);
            console.log('Full Details:', details);
            console.groupEnd();
            
            handlePlaceSelected(data, details);
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
        />
      )}
    </View>
  );
}

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