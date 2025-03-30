import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, ToastAndroid, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../configs/FirebaseConfig';

const showToast = (message, title = 'Message') => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(title, message);
  }
};

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleSignUp = async () => {
        // Trim inputs
        const trimmedEmail = email.trim();
        const trimmedFullname = fullname.trim();
    
        // Validate inputs
        if (!trimmedFullname) {
            showToast('Please enter your full name', 'Missing Information');
            return;
        }
    
        if (!trimmedEmail) {
            showToast('Please enter your email', 'Missing Information');
            return;
        }
    
        if (!validateEmail(trimmedEmail)) {
            showToast('Please enter a valid email address', 'Invalid Email');
            return;
        }
    
        if (!password) {
            showToast('Please enter a password', 'Missing Information');
            return;
        }
    
        if (!validatePassword(password)) {
            showToast('Password must be at least 6 characters', 'Weak Password');
            return;
        }
    
        setIsLoading(true);
    
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth, 
                trimmedEmail, 
                password
            );
            
            // Success - account created
            showToast('Account created successfully!', 'Success');
            
            // Optional: Send email verification
            // await sendEmailVerification(userCredential.user);
            
            router.replace('/'); // Navigate after successful signup
        } catch (error) {
            console.error('Signup error:', error);
            handleAuthError(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAuthError = (error) => {
        let errorTitle = 'Sign Up Error';
        let errorMessage = 'An error occurred during sign up. Please try again.';
        let redirectToSignIn = false;
    
        switch(error.code) {
            case 'auth/email-already-in-use':
                errorTitle = 'Email Already Registered';
                errorMessage = 'This email is already in use. Would you like to sign in instead?';
                redirectToSignIn = true;
                break;
            case 'auth/invalid-email':
                errorTitle = 'Invalid Email';
                errorMessage = 'The email address is not properly formatted.';
                break;
            case 'auth/weak-password':
                errorTitle = 'Weak Password';
                errorMessage = 'Please choose a password with at least 6 characters.';
                break;
            case 'auth/operation-not-allowed':
                errorTitle = 'Service Disabled';
                errorMessage = 'Email/password accounts are not enabled. Contact support.';
                break;
            case 'auth/network-request-failed':
                errorTitle = 'Network Error';
                errorMessage = 'Please check your internet connection and try again.';
                break;
            default:
                console.error('Unhandled auth error:', error);
        }
    
        if (Platform.OS === 'web') {
            if (redirectToSignIn) {
                if (window.confirm(`${errorMessage}\n\nWould you like to sign in instead?`)) {
                    router.replace('/auth/sign-in');
                }
            } else {
                alert(`${errorTitle}\n\n${errorMessage}`);
            }
        } else {
            if (redirectToSignIn) {
                Alert.alert(
                    errorTitle,
                    errorMessage,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Sign In', onPress: () => router.replace('/auth/sign-in') }
                    ]
                );
            } else {
                Alert.alert(errorTitle, errorMessage);
            }
        }
    };

  
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={() => router.back()} 
                style={styles.backButton}
                disabled={isLoading}
            >
                <Ionicons name="arrow-back" size={24} color={isLoading ? Colors.GRAY : Colors.BLACK} />
            </TouchableOpacity>
            
            <Text style={styles.title}>Create Account</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput 
                    style={[styles.input, isLoading && styles.disabledInput]}
                    placeholder="Enter Full Name"
                    value={fullname}
                    onChangeText={setFullname}
                    placeholderTextColor={Colors.GRAY}
                    editable={!isLoading}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput 
                    style={[styles.input, isLoading && styles.disabledInput]}
                    placeholder="Enter valid email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor={Colors.GRAY}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                    autoComplete="email"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={[styles.input, isLoading && styles.disabledInput]}
                    placeholder="At least 6 characters"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={Colors.GRAY}
                    autoCapitalize="none"
                    editable={!isLoading}
                    autoComplete="new-password"
                />
            </View>

            <TouchableOpacity 
                style={[
                    styles.signUpButton, 
                    isLoading && styles.buttonDisabled,
                    { marginTop: 30 }
                ]}
                onPress={handleSignUp}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
            </TouchableOpacity>

            <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account?</Text>
                <TouchableOpacity
                    onPress={() => router.replace('auth/sign-in')}
                    disabled={isLoading}
                >
                    <Text style={[styles.signInLink, isLoading && { color: Colors.GRAY }]}>
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 20,
        backgroundColor: Colors.WHITE,
    },
    backButton: {
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    title: {
        fontFamily: "outfit-bold",
        fontSize: 28,
        color: Colors.PRIMARY,
        marginBottom:10,
    },
  
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontFamily: 'outfit-regular',
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
        color: Colors.BLACK,
    },
    disabledInput: {
        backgroundColor: Colors.LIGHT_GRAY,
        color: Colors.GRAY,
    },
    signUpButton: {
        padding: 16,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: Colors.WHITE,
        fontFamily: 'outfit-medium',
        fontSize: 16,
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signInText: {
        fontFamily: 'outfit-regular',
        color: Colors.DARK_GRAY,
        marginRight: 5,
    },
    signInLink: {
        fontFamily: 'outfit-medium',
        color: Colors.PRIMARY,
        textDecorationLine: 'underline',
    },
});