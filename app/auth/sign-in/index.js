import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../configs/FirebaseConfig';

export default function SignIn() {
    const navigation = useNavigation();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSignIn = async () => {
  // Trim and validate email
  const trimmedEmail = email.trim();
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    Alert.alert('Error', 'Please enter a valid email address');
    return;
  }

  // Validate password length
  if (!password || password.length < 6) {
    Alert.alert('Error', 'Password must be at least 6 characters');
    return;
  }

  setIsLoading(true);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
    console.log('Success! User:', userCredential.user);
    router.replace('/mytrip');
  } catch (error) {
    console.error('Auth Error:', {
      code: error.code,
      message: error.message,
      fullError: JSON.stringify(error)
    });

    const errorMessages = {
      'auth/invalid-email': 'Invalid email format',
      'auth/user-disabled': 'Account disabled',
      'auth/user-not-found': 'No account found',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many attempts. Try later.'
    };

    Alert.alert(
      'Sign In Failed',
      errorMessages[error.code] || 'Authentication failed. Please try again.'
    );
  } finally {
    setIsLoading(false);
  }
};
    const handleAuthError = (error) => {
        let errorMessage = 'Sign in failed. Please try again.';
        
        switch(error.code) {
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address format';
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                errorMessage = 'Invalid email or password';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Account temporarily locked due to many failed attempts. Try again later or reset your password.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled. Please contact support.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
        }
        
        Alert.alert('Error', errorMessage);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
            
            <Text style={styles.title}>Let's Sign You In</Text>
            <Text style={styles.subtitle}>Welcome Back!</Text>
            <Text style={styles.subtitle}>You've Been Missed!</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Enter Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor={Colors.GRAY}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, {flex: 1}]}
                        secureTextEntry={secureTextEntry}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor={Colors.GRAY}
                        editable={!isLoading}
                    />
                    <TouchableOpacity 
                        style={styles.eyeIcon}
                        onPress={() => setSecureTextEntry(!secureTextEntry)}
                    >
                        <Ionicons 
                            name={secureTextEntry ? "eye-off" : "eye"} 
                            size={20} 
                            color={Colors.GRAY} 
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity 
                style={[
                    styles.signInButton,
                    isLoading && { backgroundColor: Colors.PRIMARY_LIGHT }
                ]}
                onPress={handleSignIn}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color={Colors.WHITE} />
                ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => !isLoading && router.replace('auth/sign-up')}
                style={[
                    styles.createAccountButton,
                    isLoading && { opacity: 0.5 }
                ]}
                disabled={isLoading}
            >
                <Text style={[styles.buttonText, {color: Colors.PRIMARY}]}>
                    Create Account
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => !isLoading && router.replace('auth/forgot-password')}
                style={styles.forgotPasswordButton}
                disabled={isLoading}
            >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        paddingTop: 15,
        backgroundColor: Colors.WHITE,
        height: '100%',
    },
    backButton: {
        marginBottom: -10,
        alignSelf: 'flex-start'
    },
    title: {
        fontFamily: "outfit-bold",
        fontSize: 27,
        marginTop: 18,
        color: Colors.PRIMARY,
    },
    subtitle: {
        fontFamily: "outfit-regular",
        fontSize: 19,
        color: Colors.GRAY,
        marginTop: 5,
    },
    inputContainer: {
        marginTop: 20,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontFamily: 'outfit-medium',
        marginBottom: 8,
        fontSize: 14,
        color: Colors.DARK_GRAY,
    },
    input: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Colors.LIGHT_GRAY,
        fontFamily: 'outfit-regular',
        fontSize: 16,
        backgroundColor: Colors.LIGHT_BACKGROUND,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
    },
    signInButton: {
        padding: 16,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createAccountButton: {
        padding: 16,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        marginTop: 15,
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
    },
    forgotPasswordButton: {
        marginTop: 20,
        alignSelf: 'center',
    },
    forgotPasswordText: {
        color: Colors.PRIMARY,
        fontFamily: 'outfit-medium',
        fontSize: 14,
    },
    buttonText: {
        color: Colors.WHITE,
        textAlign: 'center',
        fontFamily: 'outfit-medium',
        fontSize: 16,
    },
});