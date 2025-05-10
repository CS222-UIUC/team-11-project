import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

// Google Sign-In Configuration
GoogleSignin.configure({
  webClientId: '421634745227-lv73muuh0et88ii6r0a007p0k86vbuki.apps.googleusercontent.com',
  iosClientId: '421634745227-4tifpjj90q7jco1l4uac2u28q9anvu1g.apps.googleusercontent.com',
  offlineAccess: false,
  forceCodeForRefreshToken: true,
  scopes: ['profile', 'email']
});

export default function SignUp() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  useFocusEffect(
    React.useCallback(() => {
      setErrorMessage('');
    }, [])
  );
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    try {
      if (!name || !email || !password) {
        setErrorMessage('Please fill in all fields.');
        return;
      }

      if (!validateEmail(email)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }

      if (!validatePassword(password)) {
        setErrorMessage('Password should be at least 6 characters long.');
        return;
      }

      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await firestore().collection('users').doc(user.uid).set({
        email: user.email,
        name: name,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await AsyncStorage.setItem('userUID', user.uid);

      Alert.alert('Success', 'Account created!');
      navigation.navigate('HomeFirst');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('An account with this email already exists.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email format.');
      } else {
        setErrorMessage(error.message || 'Failed to create account.');
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Image
          source={require('../resources/SHELPW.png')}
          style={styles.logo}
          resizeMode='contain'
        />

        <Text style={styles.title}>Create your Shelp account</Text>

        {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder='Enter your name'
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errorMessage) setErrorMessage('');
            }}
            style={styles.input}
            placeholderTextColor='#888'
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder='Enter your email'
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errorMessage) setErrorMessage('');
            }}
            autoCapitalize='none'
            style={styles.input}
            placeholderTextColor='#888'
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder='Enter your password'
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorMessage) setErrorMessage('');
            }}
            secureTextEntry
            style={styles.input}
            placeholderTextColor='#888'
          />
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.signInRedirect}>
            Already have an account? <Text style={{ fontWeight: 'bold' }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2570a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  error: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: 'red',
    padding: 10,
  },
  signUpButton: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  signUpButtonText: {
    color: '#f2570a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInRedirect: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
  },
});
