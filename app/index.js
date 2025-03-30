import { View, Text } from 'react-native';
import Login from '../components/Login';
import { auth } from '../configs/FirebaseConfig';
import { Redirect } from 'expo-router';

 const user=auth.currentUser;

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      {user ? (
        <Redirect href={"/mytrip"} />
      ) : (
        <Login />
      )}
    </View>
  );
}