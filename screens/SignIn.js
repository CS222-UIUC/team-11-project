import { useEffect , useState} from "react";
import {Text, View, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, Image, TouchableOpacity, Alert } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
// import logo_img from "./resources/SHELP.svg";
import {NavigationContainer} from '@react-navigation/native';


import { getApps } from "@react-native-firebase/app";
console.log("Firebase Apps:", getApps());
import { useNavigation } from '@react-navigation/native';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: "421634745227-lv73muuh0et88ii6r0a007p0k86vbuki.apps.googleusercontent.com",
  iosClientId: "421634745227-4tifpjj90q7jco1l4uac2u28q9anvu1g.apps.googleusercontent.com",
  offlineAccess: false,
  forceCodeForRefreshToken: true,
});

export default function SignIn() {
  const navigation = useNavigation();
  useEffect(() => {
    // Initialize Firebase
    if (getApps().length === 0) {
      initializeApp();
    }
  }, []);

  // Normal email sign in
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signInWithEmail = async () => {
    try {
      console.log('Attempting sign-in with email:', email);
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('HomeFirst');
    } catch (error) {
      console.error('Sign-in error:', error);
      Alert.alert('Error', error.message);
    }
  };

  // google sign in
  const handleGoogleSignIn = async () => {
    try {
      // 1. Ensure fresh sign-in by signing out first
      await GoogleSignin.signOut();
      
      // 2. Configure with proper scopes
      await GoogleSignin.configure({
        webClientId: '421634745227-lv73muuh0et88ii6r0a007p0k86vbuki.apps.googleusercontent.com',
        iosClientId: '421634745227-4tifpjj90q7jco1l4uac2u28q9anvu1g.apps.googleusercontent.com',
        offlineAccess: false,
        forceCodeForRefreshToken: true,
        scopes: ['profile', 'email'] // Add required scopes
      });

      // 3. Perform the sign-in
      const { idToken, accessToken } = await GoogleSignin.signIn();
      
      // 4. Create credential with both tokens
      const credential = auth.GoogleAuthProvider.credential(idToken, accessToken);
      
      // 5. Sign in with Firebase
      const authResult = await auth().signInWithCredential(credential);
      
      // 6. Verify the authentication
      if (authResult?.user) {
        console.log('Firebase user UID:', authResult.user.uid);
        navigation.navigate('HomeFirst');
      } else {
        throw new Error('No user returned from Firebase');
      }
    } catch (error) {
      console.error('Authentication Error:', {
        code: error.code,
        message: error.message,
        fullError: JSON.stringify(error, null, 2)
      });
      
      if (error.code === 'auth/internal-error') {
        Alert.alert(
          'Configuration Error', error.message, 
          'Please check your Firebase and Google Sign-In setup',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
      } else {
        Alert.alert('Error', error.message || 'Authentication failed');
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2570a" }}>
        
        <Image
          source={require("../resources/SHELPW.png")}
          style={{ width: 300, height: 300}}
        />
        
        <Text style={{color:"white"}}>Welcome to the pantry of your dreams!</Text>
        <Text></Text>
        <Text style = {{ fontSize: 20, marginBottom: 10 }}>Email:</Text>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" style={{ borderBottomLength: 10 , marginBottom: 5 }} />
        <Text style = {{ fontSize: 20, marginBottom: 10 }}>Password:</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderBottomLength: 10 , marginBottom: 5 }} />
        <TouchableOpacity
          //if using google auth uncomment the following
          onPress={()=>signInWithEmail()} style={{ padding: 10, backgroundColor: "white", borderRadius: 5, width: 300, alignItems:"center" , marginBottom: 10}}
          
        >
          <Text>Sign in with email</Text>
          
        </TouchableOpacity>
        {/* <Button title="Sign In" onPress={signInWithEmail} style = {{marginBottom: 10}}/> */}
        {/* <Text style={{ fontSize: 20, marginBottom: 20 }}>Welcome to the App</Text> */}
        <TouchableOpacity
          //if using google auth uncomment the following
          onPress={()=>handleGoogleSignIn()}
          //if not using google auth uncomment the following
          // onPress={()=>navigation.navigate('HomeFirst')}
          style={{ padding: 10, backgroundColor: "white", borderRadius: 5, width: 300, alignItems:"center" }}
        >
          <Text>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}