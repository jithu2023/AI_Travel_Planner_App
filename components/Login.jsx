import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import React from 'react';

export default function Login() {
  return (
    <View>
      <Image 
        source={require('../assets/images/ai-image.webp')}
        style={styles.image}
      />

      <View style={styles.container}>
        <Text style={styles.title}>AI Travel Planner</Text>

        <Text style={styles.subtitle}>
          Discover your Next Adventure Effortlessly. Personalized Planning at your fingertips. 
          Travel smarter with AI-driven insights.
        </Text>

        <View style={styles.button}>
          <Text style={styles.buttonText}>Sign In With Google</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 250,
  },
  container: {
    backgroundColor: Colors.WHITE,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '100%',
    padding: 15,
  },
  title: {
    fontSize: 30,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'outfit-regular',
    fontSize: 17,
    textAlign: 'center',
    color: Colors.GRAY,
    marginTop:20,
  },
  button: {
    padding: 15,
    borderRadius: 99,
    backgroundColor: Colors.PRIMARY,
    marginTop:40,
    alignItems: 'center', // Center text inside button
  },
  buttonText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-regular',
    fontSize: 17,
  },
});
