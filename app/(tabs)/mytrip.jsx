import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';

export default function MyTrip() {

    const [usertrips,setUserTrips]=useState([])
  return (
    <View style={{
        padding:25,
        paddingTop:35,
        backgroundColor:Colors.WHITE,
        height:'100%'

    }}>
        <View style={{
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between'
        }}>
            <Text style={{
                fontFamily:'outfit-bold',
                fontSize:30
            }}>
             My Trips
            </Text>
            <Ionicons name="add-circle" size={50} color="black" />
        </View>
     {usertrips?.length==0?
     <StartNewTripCard/>
     :null}
    </View>
  )
}