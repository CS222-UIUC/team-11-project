import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Account created!');
      navigation.navigate('HomeFirst'); // or navigate back to SignIn if preferred
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2570a" }}>
        <Text style={{ fontSize: 24, color: "white", marginBottom: 20 }}>Create an Account</Text>
        
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={{ backgroundColor: "white", width: 300, padding: 10, marginBottom: 10, borderRadius: 5 }}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ backgroundColor: "white", width: 300, padding: 10, marginBottom: 20, borderRadius: 5 }}
        />

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
