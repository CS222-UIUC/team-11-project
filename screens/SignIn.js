import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps } from "@react-native-firebase/app";
import { useNavigation } from "@react-navigation/native";

// Google Sign-In Configuration
GoogleSignin.configure({
  webClientId: "421634745227-lv73muuh0et88ii6r0a007p0k86vbuki.apps.googleusercontent.com",
  iosClientId: "421634745227-4tifpjj90q7jco1l4uac2u28q9anvu1g.apps.googleusercontent.com",
  offlineAccess: false,
  forceCodeForRefreshToken: true,
});

export default function SignIn() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Auto-redirect if already signed in
  useEffect(() => {
    const checkIfUserIsLoggedIn = async () => {
      try {
        const uid = await AsyncStorage.getItem('userUID');
        if (uid) {
          console.log('User already signed in:', uid);
          navigation.navigate('HomeFirst');
        }
      } catch (error) {
        console.error('Error checking user UID:', error);
      }
    };
    checkIfUserIsLoggedIn();
  }, []);

  // sign in with normal email and password
  const signInWithEmail = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await AsyncStorage.setItem('userUID', user.uid);
      console.log('Signed in with email:', user.uid);
      navigation.navigate('HomeFirst');
    } catch (error) {
      console.error('Email sign-in error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.signOut(); // Ensure fresh sign-in
      await GoogleSignin.configure({
        webClientId: "421634745227-lv73muuh0et88ii6r0a007p0k86vbuki.apps.googleusercontent.com",
        iosClientId: "421634745227-4tifpjj90q7jco1l4uac2u28q9anvu1g.apps.googleusercontent.com",
        offlineAccess: false,
        forceCodeForRefreshToken: true,
        scopes: ["profile", "email"]
      });

      const { idToken, accessToken } = await GoogleSignin.signIn();
      const credential = auth.GoogleAuthProvider.credential(idToken, accessToken);
      const authResult = await auth().signInWithCredential(credential);

      if (authResult?.user) {
        await AsyncStorage.setItem('userUID', authResult.user.uid);
        console.log('Google sign-in UID:', authResult.user.uid);
        navigation.navigate('HomeFirst');
      } else {
        throw new Error('Google sign-in failed');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      Alert.alert('Authentication Error', error.message || 'Failed to sign in with Google');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          source={require("../resources/SHELPW.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome to the pantry of your dreams!</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            placeholder="Enter your email"
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            placeholder="Enter your password"
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={signInWithEmail}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={{ fontWeight: 'bold' }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleGoogleSignIn} style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2570a",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: "white",
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "600",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    color: "white",
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  signInButtonText: {
    color: "#f2570a",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpText: {
    color: "white",
    fontSize: 14,
    marginBottom: 20,
  },
  googleButton: {
    marginTop: 10,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  googleButtonText: {
    color: "#4285F4",
    fontWeight: "bold",
    fontSize: 16,
  },
});