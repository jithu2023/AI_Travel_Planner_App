import { View, FlatList, StyleSheet, Text } from 'react-native';
import React from 'react';
import UserTripCard from './UserTripCard';
import { Colors } from '../../constants/Colors';

export default function UserTripList({ userTrips, refreshTrips }) {
  return (
    <View style={styles.container}>
      {userTrips.length > 0 ? (
        <FlatList
          data={userTrips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserTripCard trip={item} featured={false} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<View style={styles.topSpacer} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No previous trips found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    paddingTop: 8,
  },
  topSpacer: {
    height: 8,
  },
  separator: {
    height: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: Colors.GRAY,
    textAlign: 'center',
    lineHeight: 20,
  },
});