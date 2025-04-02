import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/Colors';
import { CreateTripContext } from '../../context/CreateTripContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';

export default function ReviewTrip() {
  const navigation = useNavigation();
  const { tripData } = useContext(CreateTripContext);

  const formatDate = (dateString) => {
    return moment(dateString).format('DD MMM');
  };

  const handleGenerateTrip = () => {
    console.log("Generating trip with data:", tripData);
    // navigation.navigate('GeneratedTrip');
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Review Your Trip</Text>
      </View>

      <Text style={styles.subtitle}>Confirm your selections before we generate your perfect trip</Text>

      {/* Trip Details Card */}
      <View style={styles.card}>
        {/* Destination */}
        <View style={styles.detailRow}>
          <Ionicons name="location-sharp" size={20} color={Colors.PRIMARY} style={styles.icon} />
          <View style={styles.detailsBg}>
            <Text style={styles.detailLabel}>Destination</Text>
            <Text style={[styles.detailValue, styles.dataFont]}>{tripData?.locationInfo?.name}</Text>
            <Text style={[styles.detailSubtext, styles.dataFont]}>{tripData?.locationInfo?.address}</Text>
          </View>
        </View>

        {/* Dates */}
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={20} color={Colors.PRIMARY} style={styles.icon} />
          <View style={styles.detailsBg}>
            <Text style={styles.detailLabel}>Dates</Text>
            <Text style={[styles.detailValue, styles.dataFont]}>
              {tripData?.startDate ? `${formatDate(tripData.startDate)} - ${formatDate(tripData.endDate)}` : 'Not selected'}
              <Text style={[styles.duration, styles.dataFont]}> ({tripData?.totalNoOfDays || 0} days)</Text>
            </Text>
          </View>
        </View>

        {/* Travelers */}
        <View style={styles.detailRow}>
          <Text style={[styles.icon, styles.emoji]}>{tripData?.travelerInfo?.icon || '👤'}</Text>
          <View style={styles.detailsBg}>
            <Text style={styles.detailLabel}>Travelers</Text>
            <Text style={[styles.detailValue, styles.dataFont]}>{tripData?.travelerInfo?.type || 'Not selected'}</Text>
            <Text style={[styles.detailSubtext, styles.dataFont]}>{tripData?.travelerInfo?.count}</Text>
          </View>
        </View>

        {/* Budget */}
        <View style={styles.detailRow}>
          <Text style={[styles.icon, styles.emoji]}>{tripData?.budgetDetails?.icon || '💰'}</Text>
          <View style={styles.detailsBg}>
            <Text style={styles.detailLabel}>Budget</Text>
            <Text style={[styles.detailValue, styles.dataFont]}>{tripData?.budgetDetails?.type || 'Not selected'}</Text>
            <Text style={[styles.detailSubtext, styles.dataFont]}>{tripData?.budgetDetails?.description}</Text>
          </View>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity 
        style={styles.continueButton}
        onPress={handleGenerateTrip}
      >
        <Text style={styles.continueButtonText}>Generate Trip Plan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 28,
    color: Colors.DARK,
  },
  subtitle: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: Colors.GRAY,
    marginBottom: 25,
    lineHeight: 22,
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailsBg: {
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 8,
    padding: 12,
    flex: 1,
  },
  icon: {
    marginRight: 15,
    marginTop: 3,
    width: 24,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  detailLabel: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.GRAY,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontFamily: 'outfit-semibold',
    fontSize: 18,
    color: Colors.DARK,
    marginBottom: 3,
  },
  detailSubtext: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: Colors.GRAY,
  },
  duration: {
    fontFamily: 'outfit-regular',
    color: Colors.GRAY,
  },
  dataFont: {
    fontFamily: 'outfit-regular',
  },
  continueButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  continueButtonText: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    color: Colors.WHITE,
  },
});