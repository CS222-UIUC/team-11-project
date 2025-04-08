import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'; // Using @react-native-firebase/firestore
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Example field
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Save additional user info in Firestore
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2570a" }}>
        <Text style={{ fontSize: 24, color: "white", marginBottom: 20 }}>Create an Account</Text>
        
        <Text style = {{ color: "white", fontSize: 14, marginBottom: 5 }}>Name:</Text>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={{ backgroundColor: "white", width: 300, padding: 10, marginBottom: 10, borderRadius: 5 }}
        />
        <Text style = {{ color: "white", fontSize: 14, marginBottom: 5 }}>Email:</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={{ backgroundColor: "white", width: 300, padding: 10, marginBottom: 10, borderRadius: 5 }}
        />
        <Text style = {{ color: "white", fontSize: 14, marginBottom: 5 }}>Password:</Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ backgroundColor: "white", width: 300, padding: 10, marginBottom: 20, borderRadius: 5 }}
        />
        <Text></Text>
        <TouchableOpacity onPress={handleSignUp} style={{ padding: 10, backgroundColor: "white", borderRadius: 5, width: 250, alignItems: "center" }}>
          <Text>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 15 }}>
          <Text style={{ color: "white" }}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}