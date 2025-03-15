// test run

// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';
// import auth from '@react-native-firebase/auth';

// // Initialize Firebase
// if (!auth().apps.length) {
//   auth().initializeApp();
// }

// AppRegistry.registerComponent(appName, () => App);


// import React, { useEffect } from 'react';
// import { StyleSheet, View, Text, Button } from 'react-native';
// import auth from '@react-native-firebase/auth';

// import { getApps } from "@react-native-firebase/app";
// console.log("Firebase Apps:", getApps());


// const App = () => {
//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(user => {
//       if (user) {
//         console.log('User is signed in:', user);
//       } else {
//         console.log('User is signed out');
//       }
//     });

//     return subscriber; // Unsubscribe on unmount
//   }, []);

//   const signIn = async () => {
//     try {
//       await auth().signInAnonymously();
//     } catch (error) {
//       console.error('Sign-in error:', error);
//     }
//   };

//   return (
//     <View>
//       <Text>Welcome to the App</Text>
//       <Button title="Sign In Anonymously" onPress={signIn} />
//     </View>
//   );
// };

// export default App;

// function Title({ text }) {
//     console.log("Title component rendering with text:", text);
//   if (!text) return null;
//   return (
//     <Text style={styles.title}>
//       {text}
//     </Text>
//   );
// }

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Title text="Welcome to My App" />
//     </View>
//   );
// }


// attempt
import { useEffect } from "react";
import {Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from "./screens/SignIn";
import Home from "./screens/Home";

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator> 
        <Stack.Screen
          name="Sign_in"
          component={SignIn}
          options={{title: 'Welcome'}}
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{title: 'Home Page'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// import React from "react";
// import { StyleSheet, Text, View, Image, SafeAreaView, FlatList, TouchableOpacity, TouchableHighlight} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { GoogleSignin, statusCodes } from 
//   '@react-native-google-signin/google-signin';
// import auth from '@react-native-firebase/auth';
// import { getAuth, signInWithRedirect } from "firebase/auth";
// import { GoogleAuthProvider } from "firebase/auth";



// export default function App()  {
//   useEffect(() => {
//       GoogleSignin.configure({

//           // Client ID of type WEB for your server (needed
//           // to verify user ID and offline access)
//           webClientId: '421634745227-lv73muuh0et88ii6r0a007p0k86vbuki.apps.googleusercontent.com',
//       });
//   }, [])

//   const signIn = async () => {
//       try {

//           await GoogleSignin.hasPlayServices();
//           const userInfo = await GoogleSignin.signIn();
//           await GoogleSignin.revokeAccess();
//           console.warn(userInfo.user)
//       } catch (error) {

//           if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              
//               // user cancelled the login flow
//           } else if (error.code === statusCodes.IN_PROGRESS) {
//               console.log(error)
//           } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//               console.log(error)
//           } else {
//               console.log(error)
//           }
//       }

//   };

//   return (  

//       <View style={styles.container}>
//           <h1 className="text-3xl font-bold text-center text-gray-800 my-4">
//             {text}
//         </h1>
//           <Pressable style={styles.signupbutton} 
//               onPress={() => { signIn(), console.log('click') }}>
              
//           </Pressable>

//       </View>
//   )
// }

  

const styles = StyleSheet.create({
    
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  container: {
      justifyContent: 'center',
      flex: 1,
      paddingHorizontal: 15,
      backgroundColor: '#1f1f1f',
      alignItems: 'center',

  },
  signupbutton: {
      justifyContent: 'center',
      backgroundColor: 'pink',
      width: 300,
      height: 46,
      borderRadius: 15,
      marginTop: 25,
      alignItems: 'center',
  },
})
