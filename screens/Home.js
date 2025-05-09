import { useEffect, useState , useCallback} from "react";
import { useFocusEffect } from '@react-navigation/native';
import {Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [userData, setUserData] = useState({ name: ''});

  // get the total number of items in a users pantry and display the number of items close to expiring
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
      <Text style={styles.welcome}>Welcome, {userData.name || "friend"}!</Text>
      <Text style={styles.subheading}>Here's a quick look at your pantry</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Items</Text>
        <Text style={styles.cardNumber}>{pantryStats.total}</Text>
      </View>

      <View style={[styles.card, pantryStats.expiringSoon > 0 && styles.cardAlert]}>
        <Text style={styles.cardTitle}>Expiring Soon</Text>
        <Text style={styles.cardNumber}>{pantryStats.expiringSoon}</Text>
        {pantryStats.expiringSoon > 0 && (
          <Text style={styles.alertText}>Check before it’s too late! ⚠️</Text>
        )}
      </View>

      <View style={[styles.card, pantryStats.expired > 0 && styles.cardExpired]}>
        <Text style={styles.cardTitle}>Expired</Text>
        <Text style={styles.cardNumber}>{pantryStats.expired}</Text>
        {pantryStats.expired > 0 && (
          <Text style={styles.expiredText}>Time to clean up! 🧹</Text>
        )}
      </View>
      <TouchableOpacity style={styles.pantryButton} onPress={() => navigation.navigate('Pantry')}>
        <Text style={styles.pantryButtonText}>Go to Pantry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#FAFAFA',
    flex: 1,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subheading: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#222',
  },
  cardAlert: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FF6B6B',
    borderWidth: 1,
  },
  alertText: {
    marginTop: 8,
    color: '#D9534F',
    fontSize: 14,
  },
  cardExpired: {
    // backgroundColor: '#F0F0F0',
    // borderColor: '#999',
    // borderWidth: 1,
  },
  expiredText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: 700,
  },
  pantryButton: {
    backgroundColor: '#f2570a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  
  pantryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  
});
