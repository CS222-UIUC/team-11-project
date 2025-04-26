import { useEffect, useState , useCallback} from "react";
import { useFocusEffect } from '@react-navigation/native';
import {Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [userData, setUserData] = useState({ name: ''});

  // pantry data
  const[pantryStats, setPantryStats] = useState({total: 0, expiringSoon: 0});
  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const uid = await AsyncStorage.getItem('userUID');
          if (!uid) return;
  
          const doc = await firestore().collection('users').doc(uid).get();
          if (doc.exists) {
            const data = doc.data();
            setUserData({ name: data.name });
          }
  
          const pantrySnapShot = await firestore()
            .collection('users')
            .doc(uid)
            .collection('pantry')
            .get();
          
          const items = pantrySnapShot.docs.map(doc => doc.data());
  
          const today = new Date();
          const soonThreshold = new Date();
          soonThreshold.setDate(today.getDate() + 3);
  
          let expiringSoon = 0;
  
          items.forEach(item => {
            const expDate = new Date(item.expiration);
            if (expDate <= soonThreshold && expDate >= today) {
              expiringSoon += 1;
            }
          });
  
          setPantryStats({ total: items.length, expiringSoon });
  
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchUserData();
  
    }, []) // <-- dependencies array
  );
  
  return (
    <View style={styles.container}>
      
      <Text style={styles.header}>Welcome to Shelp, {userData.name}!</Text>

    
      <Text style = {styles.summaryText}> Total items in pantry: {pantryStats.total}</Text>
      <Text style = {styles.summaryText}> Expiring soon: {pantryStats.expiringSoon} </Text>
    

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
  summaryBox:{
    backgroundColor: '#f3f3f3',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryText:{
    fontSize: 18,
    marginBottom: 10,
  },
});
