import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation,useRouter } from 'expo-router'
import { Colors } from '../../../constants/Colors';

export default function SignIn() {
    const navigation = useNavigation();
    const router=useRouter();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Let's Sign You In</Text>
            <Text style={styles.subtitle}>Welcome Back!</Text>
            <Text style={styles.subtitle}>You've Been Missed!</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Enter Email"
                    placeholderTextColor={Colors.GRAY}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    secureTextEntry={true}
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={Colors.GRAY}
                />
            </View>

            <TouchableOpacity 
                style={styles.signInButton}
                onPress={() => {}}
            >
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={()=>router.replace('auth/sign-up')}
                style={styles.createAccountButton}
            >
                <Text style={[styles.buttonText, {color: Colors.PRIMARY}]}>Create Account</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 40,
        backgroundColor: Colors.WHITE,
        height: '100%',
    },
    title: {
        fontFamily: "outfit-bold",
        fontSize: 28,
        marginBottom: 5,
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