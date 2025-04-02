import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function StartNewTripCard() {
    const router=useRouter()

    
  return (
    <View
    style={{
        padding:20,
        marginTop:40,
        display:'flex',
        alignItems:'center',
        gap:25
    }}>
<Ionicons name="location-sharp" size={30} color="black" />   
<Text
style={{
    fontSize:25,
    fontFamily:'outfit-medium'
}}>No Trips Planned Yet</Text>

<Text
style={{
    fontSize:20,
    fontFamily:'outfit-medium',
    textAlign:'center',
    color:Colors.GRAY
}}>Looks Like It's Time To Plan a Travel Eperience! Get Started Below</Text>

<TouchableOpacity
onPress={()=>router.push('/create-trip/search-place')}
style={{
    padding:10,
    backgroundColor:Colors.PRIMARY,
    borderRadius:15,
    paddingHorizontal:30,
}}>
    <Text style={{
        color:Colors.WHITE,
        fontFamily:'outfit-medium',
        fontSize:17,
    }}>Start a New Trip!</Text>
</TouchableOpacity>

 </View>
  )
}