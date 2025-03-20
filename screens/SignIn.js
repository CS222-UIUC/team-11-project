import { useEffect } from "react";
import {Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
// import logo_img from "./resources/SHELP.svg";
import {Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';


import { getApps } from "@react-native-firebase/app";
console.log("Firebase Apps:", getApps());
import { useNavigation } from '@react-navigation/native';

export default function SignIn() {
  const navigation = useNavigation();
  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "421634745227-4tifpjj90q7jco1l4uac2u28q9anvu1g.apps.googleusercontent.com",
      iosClientId: "421634745227-4tifpjj90q7jco1l4uac2u28q9anvu1g.apps.googleusercontent.com",
      offlineAccess: true, 
    });
  }, []);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {

      // Check if Google Play Services is available
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get the user's ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in with Firebase using the credential
      await auth().signInWithCredential(auth, googleCredential);

      // Success: Show a message or navigate to another screen
      navigation.navigate('HomeFirst');
    } catch (error) {
      // Handle errors
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Error", "Sign-in cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Error", "Sign-in in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Play services not available");
      } else {
        Alert.alert("Error", "Something went wrong");
        console.error(error);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2570a" }}>
      
      <Image
        source={require("../resources/SHELPW.png")}
        style={{ width: 300, height: 300}}
      />
      <Text style={{color:"white"}}>Welcome to the pantry of your dreams!</Text>
      <Text></Text>
      {/* <Text style={{ fontSize: 20, marginBottom: 20 }}>Welcome to the App</Text> */}
      <TouchableOpacity
        //if using google auth uncomment the following
        // onPress={handleGoogleSignIn()}
        //if not using google auth uncomment the following
        onPress={()=>navigation.navigate('HomeFirst')}
        style={{ padding: 10, backgroundColor: "white", borderRadius: 5, width: 300, alignItems:"center" }}
      >
        <Text>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}