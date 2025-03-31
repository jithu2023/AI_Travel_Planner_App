import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { CreateTripContext } from '../context/CreateTripContext'
import { useState } from 'react';
 
export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        'outfit-regular': require('../assets/fonts/Outfit-Regular.ttf'),
        'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf'),
        'outfit-medium': require('../assets/fonts/Outfit-Medium.ttf')
    });

    const [tripData, setTripData] = useState({});

    if (!fontsLoaded) {
        return null; // Optional: Add a loading screen here
    }

    return (
        <CreateTripContext.Provider value={{ tripData, setTripData }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)"/>
            </Stack>
        </CreateTripContext.Provider>
    );
}