import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const [userData, setUserData] = useState({ name: '', email: '' });
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = await AsyncStorage.getItem('userUID');
        if (!uid) return;

        const doc = await firestore().collection('users').doc(uid).get();
        if (doc.exists) {
          const data = doc.data();
          setUserData({ name: data.name || '', email: data.email || '' });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem('userUID');
      navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth().currentUser;
              const uid = await AsyncStorage.getItem('userUID');
              if (uid) {
                await firestore().collection('users').doc(uid).delete();
                await AsyncStorage.removeItem('userUID');
              }
              await user.delete();
              navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
            } catch (error) {
              console.error('Delete account error:', error);
              Alert.alert('Error', error.message || 'Failed to delete account.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👤 Your Profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userData.name?.charAt(0)?.toUpperCase() || "?"}</Text>
        </View>
        <Text style={styles.name}>{userData.name || 'Your Name'}</Text>
        <Text style={styles.email}>{userData.email || 'your@email.com'}</Text>
      </View>

      <View style={styles.actionCard}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingHorizontal: 24,
    backgroundColor: '#F9FAFB',
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#555',
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
  },
  email: {
    fontSize: 16,
    color: '#777',
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  logoutButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ffe6e6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  deleteText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
});