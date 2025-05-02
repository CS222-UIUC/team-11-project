import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
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
      Alert.alert('Error', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Image
          source={require("../resources/SHELPW.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Create your Shelp account</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.signInRedirect}>Already have an account? <Text style={{ fontWeight: 'bold' }}>Sign In</Text></Text>
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
  signUpButton: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  signUpButtonText: {
    color: "#f2570a",
    fontSize: 16,
    fontWeight: "bold",
  },
  signInRedirect: {
    color: "white",
    fontSize: 14,
    marginBottom: 10,
  },
});