import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react'; // Added useEffect import
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

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            router.replace('/mytrip');
        } catch (error) {
            handleAuthError(error);
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
                errorMessage = 'Too many attempts. Try again later';
                break;
        }
        
        Alert.alert('Error', errorMessage);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
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
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={Colors.GRAY}
                />
            </View>

            <TouchableOpacity 
                style={styles.signInButton}
                onPress={handleSignIn}
            >
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.replace('auth/sign-up')}
                style={styles.createAccountButton}
            >
                <Text style={[styles.buttonText, {color: Colors.PRIMARY}]}>
                    Create Account
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// Keep your existing styles
const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 20,
        backgroundColor: Colors.WHITE,
        height: '100%',
    },
    title: {
        fontFamily: "outfit-bold",
        fontSize: 28,
        marginTop: 18,
    },
    subtitle: {
        fontFamily: "outfit-regular",
        fontSize: 24,
        color: Colors.GRAY,
        marginTop: 5,
    },
    inputContainer: {
        marginTop: 20,
    },
    label: {
        fontFamily: 'outfit-regular',
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Colors.GRAY,
        fontFamily: 'outfit-regular',
        fontSize: 14,
    },
    signInButton: {
        padding: 12,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10,
        marginTop: 30
    },
    createAccountButton: {
        padding: 12,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        marginTop: 15,
        borderWidth: 1,
        borderColor: Colors.PRIMARY
    },
    buttonText: {
        color: Colors.WHITE,
        textAlign: 'center',
        fontFamily: 'outfit-regular',
        fontSize: 16,
    },
});