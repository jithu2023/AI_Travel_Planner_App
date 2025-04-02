import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import CalendarPicker from 'react-native-calendar-picker';
import { CreateTripContext } from '../../context/CreateTripContext';
import moment from 'moment';

export default function SelectDates() {
  const navigation = useNavigation();
  const router = useRouter();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { tripData, setTripData } = useContext(CreateTripContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: true,
      headerTitle: '',
    });
  }, [navigation]);

  const onDateChange = (date, type) => {
    console.log(date, type);
    if (type === 'START_DATE') {
      setStartDate(moment(date));
      // Reset end date if new start date is after current end date
      if (endDate && moment(date).isAfter(endDate)) {
        setEndDate(null);
      }
    } else {
      setEndDate(moment(date));
    }
  };

  const onDateSelectionContinue = () => {
    if (!startDate || !endDate) {
      ToastAndroid.show("Please select Start and End Date", ToastAndroid.SHORT);
      return;
    }

    if (endDate.isBefore(startDate)) {
      ToastAndroid.show("End date must be after start date", ToastAndroid.SHORT);
      return;
    }

    const totalNoOfDays = endDate.diff(startDate, 'days') + 1;
    
    const updatedTripData = {
      ...tripData,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalNoOfDays
    };

    setTripData(updatedTripData);
    
    console.log('Updated tripData:', updatedTripData);

    // Use router.push() with the same path format as your example
    router.push('/create-trip/select-budget');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Dates</Text>

      <View style={styles.calendarContainer}>
        <CalendarPicker 
          onDateChange={onDateChange}
          allowRangeSelection={true}
          minDate={new Date()}
          maxRangeDuration={6}
          selectedRangeStyle={{ backgroundColor: Colors.PRIMARY }}
          selectedDayTextStyle={{ color: Colors.WHITE }}
          selectedStartDate={startDate?.toDate()}
          selectedEndDate={endDate?.toDate()}
        />
      </View>
      <TouchableOpacity
        onPress={onDateSelectionContinue}
        style={styles.continueButton}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  title: {
    fontSize: 35,
    fontFamily: 'outfit-bold',
    marginTop: 20,
    color: Colors.DARK,
  },
  calendarContainer: {
    marginTop: 30,
  },
  continueButton: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    marginTop: 20
  },
  continueText: {
    textAlign: 'center',
    color: Colors.WHITE,
    fontFamily: 'outfit-medium',
    fontSize: 20
  }
});