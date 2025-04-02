import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Colors } from '../../constants/Colors';

const OptionCard = ({ option, isSelected }) => {
  return (
    <View style={[
      styles.card,
      isSelected && styles.selectedCard
    ]}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{option.icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{option.title}</Text>
          <Text style={styles.description}>{option.desc}</Text>
          <Text style={styles.people}>{option.people} people</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
  },
  selectedCard: {
    backgroundColor: Colors.PRIMARY_LIGHT,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
    color: Colors.PRIMARY,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: Colors.DARK,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'outfit-regular',
    color: Colors.DARK_GRAY,
    marginBottom: 6,
    lineHeight: 20,
  },
  people: {
    fontSize: 14,
    fontFamily: 'outfit-medium',
    color: Colors.SECONDARY,
  },
});

export default OptionCard;