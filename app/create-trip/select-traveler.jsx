import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { SelectTravelersList } from '../../constants/options';
import OptionCard from '../../components/createTrip/optionCard';
import { CreateTripContext } from '../../context/CreateTripContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SelectTraveler() {
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,       
    });
  });

  const navigation = useNavigation();
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const { tripData, setTripData } = useContext(CreateTripContext);

  const handleSelectTraveler = (item) => {
    setSelectedTraveler(item);
  };

  const handleContinue = () => {
    if (!selectedTraveler) {
      Alert.alert('Select Traveler', 'Please choose who you\'re traveling with');
      return;
    }

    const travelerData = {
      type: selectedTraveler.title,
      icon: selectedTraveler.icon,
      count: selectedTraveler.people,
      description: selectedTraveler.desc,
      selectedAt: new Date().toISOString()
    };

    setTripData(prev => ({
      ...prev,
      travelerInfo: travelerData,
      lastUpdated: new Date().toISOString()
    }));

    console.log('Updated tripData:', {
      ...tripData,
      travelerInfo: travelerData
    });

    navigation.navigate('next-screen');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Who's traveling?</Text>
        <Text style={styles.headerSubtitle}>Select your travel companion</Text>
      </View>

      <FlatList
        data={SelectTravelersList}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectTraveler(item)}
            style={[
              styles.cardContainer,
              selectedTraveler?.id === item.id && styles.selectedCard
            ]}
            activeOpacity={0.7}
          >
            <OptionCard 
              option={item} 
              isSelected={selectedTraveler?.id === item.id}
            />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />

      {selectedTraveler && (
        <View style={styles.buttonWrapper}>
          <View style={styles.buttonBackground}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.buttonText}>
                Continue with {selectedTraveler.title}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.WHITE,
  },
  backButton: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'outfit-regular',
    color: Colors.DARK_GRAY,
    opacity: 0.8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  cardContainer: {
    width: '100%',
    marginBottom: 16,
  },
  selectedCard: {
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY_LIGHT,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonBackground: {
    backgroundColor: Colors.WHITE,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHT_GRAY,
  },
  continueButton: {
    padding: 18,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: Colors.WHITE,
  },
});