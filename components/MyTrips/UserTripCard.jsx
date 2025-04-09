import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import moment from 'moment';
import { Colors } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';

export default function UserTripCard({ trip, featured = false }) {
  const navigation = useNavigation();
  const {
    location = 'Unknown Location',
    travelerType = 'Not specified',
    duration = 'Duration not specified',
    createdAt,
    budget,
    travelPlan
  } = trip;

  const firstAttraction = travelPlan?.attractions?.[0];
  const imageUrl = firstAttraction?.imageUrl || firstAttraction?.imageURL;
  const tripDate = createdAt instanceof Date ? createdAt : new Date(createdAt);

  const handlePress = () => {
    navigation.navigate('TripDetails', {
      tripId: trip.id,
      tripData: {
        ...trip,
        createdAt: tripDate.toISOString()
      }
    });
  };

  return (
    <View style={featured ? styles.featuredCard : styles.card}>
      <Image
        source={imageUrl ? { uri: imageUrl } : require('../../assets/images/ai-image.webp')}
        style={featured ? styles.featuredImage : styles.image}
        resizeMode="cover"
      />

      <View style={[styles.details, featured && styles.featuredDetails]}>
        <View style={styles.textContainer}>
          <Text style={featured ? styles.featuredLocation : styles.location} numberOfLines={1}>
            {location}
          </Text>
          <Text style={featured ? styles.featuredDate : styles.date}>
            {moment(tripDate).format('DD MMM YY')} • {duration}
          </Text>
        </View>

        <View style={styles.metaContainer}>
          <Text style={featured ? styles.featuredTravelerType : styles.travelerType} numberOfLines={1}>
            {travelerType}
          </Text>
          {budget && (
            <Text style={featured ? styles.featuredBudget : styles.budget} numberOfLines={1}>
              {budget}
            </Text>
          )}
        </View>

        {featured && (
          <TouchableOpacity 
            style={styles.seePlanButton} 
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <Text style={styles.seePlanText}>See Plan</Text>
          </TouchableOpacity>
        )}
      </View>

      {!featured && (
        <TouchableOpacity 
          style={StyleSheet.absoluteFillObject} 
          onPress={handlePress}
          activeOpacity={0.9}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    flexDirection: 'row',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 14,
    height: 80,
    elevation: 2,
    shadowColor: Colors.DARK_GRAY,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 14,
  },
  featuredCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: Colors.DARK_GRAY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  featuredImage: {
    width: '100%',
    height: 160,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  featuredDetails: {
    padding: 16,
  },
  textContainer: {
    marginBottom: 6,
  },
  location: {
    fontFamily: 'outfit-bold',
    fontSize: 15,
    color: Colors.DARK_BLUE,
    lineHeight: 18,
  },
  date: {
    fontFamily: 'outfit-medium',
    fontSize: 12,
    color: Colors.GRAY,
    marginTop: 4,
    lineHeight: 14,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  travelerType: {
    fontFamily: 'outfit-regular',
    fontSize: 12,
    color: Colors.DARK_GRAY,
    flex: 1,
    marginRight: 10,
  },
  budget: {
    fontFamily: 'outfit-medium',
    fontSize: 12,
    color: Colors.PRIMARY,
  },
  featuredLocation: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    color: Colors.DARK_BLUE,
    lineHeight: 22,
    marginBottom: 2,
  },
  featuredDate: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.GRAY,
    marginTop: 4,
    lineHeight: 16,
  },
  featuredTravelerType: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: Colors.DARK_GRAY,
    flex: 1,
    marginRight: 12,
  },
  featuredBudget: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  seePlanButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
    alignItems: 'center',
    elevation: 2,
  },
  seePlanText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-bold',
    fontSize: 15,
  },
});