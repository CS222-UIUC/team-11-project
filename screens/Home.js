import { useEffect, useState } from "react";
import {Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [userData, setUserData] = useState({ name: ''});
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = await AsyncStorage.getItem('userUID');
        if (!uid) return;

        const doc = await firestore().collection('users').doc(uid).get();
        if (doc.exists) {
          const data = doc.data();
          setUserData({ name: data.name});
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  return (
    <View style={styles.container}>
      
      <Text style={styles.header}>Welcome to Shelp, {userData.name}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
