import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../../configs/FirebaseConfig';
import UserTripList from '../../components/MyTrips/UserTripList';
import UserTripCard from '../../components/MyTrips/UserTripCard';

export default function MyTrip({ navigation }) {
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = auth.currentUser;

  const getMyTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.email) {
        setError('Authentication required');
        return;
      }

      const q = query(
        collection(db, 'UserTrips'),
        where('userEmail', '==', user.email),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const trips = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        };
      });

      setUserTrips(trips);
    } catch (error) {
      console.error("Firestore error:", error);
      if (error.code === 'failed-precondition') {
        const indexUrl = error.message.match(/https:\/\/[^\s]+/)?.[0];
        setError(`Database error - Create index: ${indexUrl}`);
      } else {
        setError(error.message || "Failed to load trips");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) getMyTrips();
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddTrip = () => navigation.navigate('create-trip/search-place');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <TouchableOpacity onPress={handleAddTrip}>
          <Ionicons name="add-circle" size={40} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={getMyTrips} style={styles.retryButton}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : userTrips.length === 0 ? (
        <StartNewTripCard />
      ) : (
        <View style={styles.tripsContainer}>
          <View style={styles.featuredTripWrapper}>
            <UserTripCard trip={userTrips[0]} featured={true} />
          </View>
          <UserTripList userTrips={userTrips.slice(1)} refreshTrips={getMyTrips} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 26,
    color: Colors.BLACK,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.ERROR,
    fontFamily: 'outfit-regular',
    marginBottom: 10,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
  },
  retryText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-medium',
    fontSize: 14,
  },
  tripsContainer: {
    flex: 1,
  },
  featuredTripWrapper: {
    marginBottom: 12,
    paddingHorizontal: 15,
  },
  previousTripsHeader: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: Colors.DARK_BLUE,
    paddingHorizontal: 15,
    marginBottom: 8,
    marginTop: 10,
  },
});