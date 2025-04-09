import { 
    View, 
    Text, 
    Image, 
    ActivityIndicator, 
    TouchableOpacity, 
    StyleSheet 
  } from 'react-native';
  import React, { useContext, useEffect, useState, useRef } from 'react';
  import { useRouter } from 'expo-router';
  import { Colors } from '../../constants/Colors';
  import { CreateTripContext } from '../../context/CreateTripContext';
  import { AI_PROMPT, DEFAULT_VALUES } from '../../constants/options';
  import { generateTravelPlan } from '../../configs/Aimodel';
  import Ionicons from '@expo/vector-icons/Ionicons';
  import { doc, setDoc } from 'firebase/firestore';
  import { auth, db } from '../../configs/FirebaseConfig';
  
  export default function GenerateTrip() {
    const router = useRouter();
    const { tripData: contextTripData } = useContext(CreateTripContext); // Renamed to avoid conflict
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const lastRequestTime = useRef(null);
    const user = auth.currentUser;
  
    useEffect(() => {
      if (contextTripData) {
        generateAiTrip();
      }
    }, [contextTripData]);
  
    const processAiResponse = (response) => {
      try {
        if (!response) throw new Error('Empty response from AI');
        
        // Ensure we have a proper travelPlan object
        if (!response.travelPlan) {
          throw new Error('Invalid AI response format - missing travelPlan');
        }
        
        const tripResponse = JSON.parse(JSON.stringify(response));
        
        // Process hotels
        if (tripResponse.travelPlan?.hotels) {
          tripResponse.travelPlan.hotels.forEach(hotel => {
            if (!hotel.imageUrl || hotel.imageUrl.includes('example.com')) {
              hotel.imageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(hotel.name)},hotel,${encodeURIComponent(contextTripData?.locationInfo?.name || '')}`;
            }
            // Ensure consistent field naming
            hotel.imageURL = hotel.imageUrl || hotel.imageURL;
          });
        }
        
        // Process attractions
        if (tripResponse.travelPlan?.attractions) {
          tripResponse.travelPlan.attractions.forEach(attraction => {
            if (!attraction.imageUrl || attraction.imageUrl.includes('example.com')) {
              attraction.imageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(attraction.name)},attraction,${encodeURIComponent(contextTripData?.locationInfo?.name || '')}`;
            }
            // Ensure consistent field naming
            attraction.imageURL = attraction.imageUrl || attraction.imageURL;
          });
        }
        
        return tripResponse;
      } catch (error) {
        console.error('Error processing AI response:', error);
        throw new Error('Failed to process AI response: ' + error.message);
      }
    };
  
 // In GenerateTrip.jsx - Update the saveTripToFirebase function
const saveTripToFirebase = async (tripResponse) => {
  try {
    if (!user) throw new Error('User not authenticated');

    const docId = Date.now().toString();
    const tripToSave = {
      userEmail: user.email,
      userId: user.uid,
      createdAt: serverTimestamp(), // Use Firestore server timestamp
      status: 'active',
      ...tripResponse.travelPlan,
      originalData: tripResponse,
      contextTripData: contextTripData
    };

    // Add data validation
    if (!tripToSave.location || !tripToSave.duration) {
      throw new Error('Invalid trip data structure');
    }

    await setDoc(doc(db, "UserTrips", docId), tripToSave);
    return docId;
  } catch (error) {
    console.error("Firestore save error:", error);
    throw new Error('Failed to save trip: ' + error.message);
  }
};
  
    const generateAiTrip = async () => {
      if (lastRequestTime.current && Date.now() - lastRequestTime.current < 5000) {
        setError("Please wait at least 5 seconds before generating another trip");
        return;
      }
  
      setIsGenerating(true);
      setError(null);
      lastRequestTime.current = Date.now();
  
      try {
        // Validate we have the minimum required data
        if (!contextTripData?.locationInfo?.name) {
          throw new Error('Missing location information');
        }
  
        // Safely extract all parameters
        const location = contextTripData?.locationInfo?.name || DEFAULT_VALUES.location;
        const days = contextTripData?.totalNoOfDays || DEFAULT_VALUES.days;
        const nights = days > 0 ? days - 1 : DEFAULT_VALUES.nights;
        const traveler = contextTripData?.travelerInfo?.type || DEFAULT_VALUES.traveler;
        const budget = contextTripData?.budgetDetails?.type || DEFAULT_VALUES.budget;
  
        // Construct prompt from template
        const prompt = AI_PROMPT
          .replace('{location}', location)
          .replace('{totalDays}', days.toString())
          .replace('{totalNights}', nights.toString())
          .replace('{traveler}', traveler)
          .replace('{budget}', budget);
  
        console.log("Final AI Prompt:", prompt);
        
        const rawResponse = await generateTravelPlan(prompt);
        const processedResponse = processAiResponse(rawResponse);
        
        console.log("Processed AI Response:", processedResponse);
  
        // Save to Firebase
        const docId = await saveTripToFirebase(processedResponse);
        console.log("Trip saved with ID:", docId);
  
        // Navigate to trip details
        router.push({
          pathname: '/create-trip/generated-trip',
          params: { 
            tripId: docId,
            tripPlan: JSON.stringify(processedResponse)
          }
        });
        
      } catch (error) {
        console.error("Error generating trip:", error);
        setError(error.message || "Failed to generate trip plan. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
  
        <Text style={styles.title}>Please Wait...</Text>
        
        <Text style={styles.subtitle}>
          We're creating your {contextTripData?.totalNoOfDays || DEFAULT_VALUES.days}-day trip to {'\n'}
          <Text style={styles.locationText}>{contextTripData?.locationInfo?.name || DEFAULT_VALUES.location}</Text>
        </Text>
  
        <Image 
          source={require('../../assets/images/trip-loading.jpg')} 
          style={styles.loadingImage}
        />
  
        <ActivityIndicator 
          size="large" 
          color={Colors.PRIMARY} 
          animating={isGenerating}
        />
  
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={generateAiTrip}
              disabled={isGenerating}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <Text style={styles.noteText}>
          {isGenerating ? 'Generating your perfect itinerary...' : 'Ready to explore!'}
        </Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      paddingTop: 60,
      backgroundColor: Colors.WHITE,
    },
    backButton: {
      marginBottom: 20,
    },
    title: {
      fontFamily: 'outfit-bold',
      fontSize: 32,
      textAlign: 'center',
      color: Colors.PRIMARY,
      marginBottom: 10,
    },
    subtitle: {
      fontFamily: 'outfit-medium',
      fontSize: 18,
      textAlign: 'center',
      color: Colors.DARK_GRAY,
      lineHeight: 24,
      marginBottom: 30,
    },
    locationText: {
      color: Colors.PRIMARY,
      fontWeight: '600',
    },
    loadingImage: {
      width: '80%',
      height: 200,
      resizeMode: 'contain',
      marginVertical: 20,
      alignSelf: 'center',
      borderRadius: 10,
    },
    noteText: {
      fontFamily: 'outfit-regular',
      fontSize: 16,
      color: Colors.GRAY,
      textAlign: 'center',
      marginTop: 20,
    },
    errorContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    errorText: {
      fontFamily: 'outfit-medium',
      fontSize: 16,
      color: Colors.ERROR,
      textAlign: 'center',
      marginBottom: 10,
    },
    retryButton: {
      backgroundColor: Colors.PRIMARY,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    retryText: {
      color: Colors.WHITE,
      fontFamily: 'outfit-medium',
    },
  });