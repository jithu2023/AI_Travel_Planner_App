import { View, Text, FlatList, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { SelectBudgetOptions } from '../../constants/options';
import OptionCard from '../../components/createTrip/optionCard';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CreateTripContext } from '../../context/CreateTripContext';

export default function SelectBudget() {
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null);
  const { tripData, setTripData } = useContext(CreateTripContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: true,
      headerTitle: '',
    });
  }, [navigation]);

  const handleContinue = () => {
    if (!selectedOption) {
      ToastAndroid.show("Please select a budget option", ToastAndroid.SHORT);
      return;
    }

    const updatedTripData = {
      ...tripData,
      budget: selectedOption.title,
      budgetDetails: {
        type: selectedOption.title,
        description: selectedOption.desc,
        icon: selectedOption.icon,
        selectedAt: new Date().toISOString()
      }
    };

    setTripData(updatedTripData);
    console.log('Updated tripData:', updatedTripData);
    
    // Navigate to the next screen
    router.push('/create-trip/review-trip'); // Replace with your actual next screen path
  };

  return (
    <View style={styles.container}>
     <TouchableOpacity 
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>

      <Text style={styles.title}>Select Budget</Text>
      
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>Choose spending habits for your trip</Text>

        <FlatList
          data={SelectBudgetOptions}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.optionContainer}
              onPress={() => setSelectedOption(item)}
            >
              <OptionCard 
                option={item} 
                isSelected={selectedOption?.id === item.id}
              />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          onPress={handleContinue}
          style={[
            styles.continueButton,
            { backgroundColor: selectedOption ? Colors.PRIMARY : Colors.GRAY }
          ]}
          disabled={!selectedOption}
        >
          <Text style={styles.continueText}>
            {selectedOption ? `Continue with ${selectedOption.title}` : 'Select an option'}
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 10,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 35,
    color: Colors.DARK,
    marginBottom: -5,
  },
  contentContainer: {
    marginTop: 2,
    flex: 1,
  },
  subtitle: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
    color: Colors.DARK,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  optionContainer: {
    marginVertical: 10,
  },
  continueButton: {
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  continueText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-medium',
    fontSize: 18,
  },
});