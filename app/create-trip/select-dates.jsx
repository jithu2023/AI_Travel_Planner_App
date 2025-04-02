import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useEffect, useState ,useContext} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/Colors';
import CalendarPicker from 'react-native-calendar-picker';
import { CreateTripContext } from '../../context/CreateTripContext';

import moment from 'moment';

export default function SelectDates() {
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
    const { tripData, setTripData } = useContext(CreateTripContext);
  

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: true,
      headerTitle: '', // Add your header title here if needed
    });
  }, [navigation]);

  const onDateChange = (date, type) => {
    console.log(date, type);
    if (type === 'START_DATE') {
      setStartDate(moment(date));
    } else {
      setEndDate(moment(date));
    }
  };

  const onDateSelectionContinue = () => {
    if (!startDate || !endDate) {
      ToastAndroid.show("Please select Start and End Date", ToastAndroid.SHORT);
      return;
    }
    
    const totalNoOfDays = endDate.diff(startDate, 'days');
    console.log(totalNoOfDays + 1);
    setTripData({
      ...tripData,
      startDate:startDate,
      endDate:endDate,
      totalNoOfDays:totalNoOfDays+1
    })
    
    // Add your navigation or other logic here
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