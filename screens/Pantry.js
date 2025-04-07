import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getDaysUntilExpiration = (expirationDate) => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getBoxColor = (daysLeft) => {
  if (daysLeft >= 5) return '#bdf7a3';      // Green
  if (daysLeft >= 2) return '#f0c986';      // Yellow
  if (daysLeft < 0) return '#fc8d99';       // Red
  return '#f28e5c';                         // Orange
};

const getProgressBarWidth = (daysLeft) => {
  const maxDays = 7;
  return `${Math.max(0, Math.min(100, (daysLeft / maxDays) * 100))}%`;
};

export default function Pantry() {
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const userUID = await AsyncStorage.getItem('userUID');
        if (!userUID) return;

        const pantryRef = firestore().collection('users').doc(userUID).collection('pantry');

        const unsubscribe = pantryRef.onSnapshot(snapshot => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFoodItems(items);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching pantry items:', error);
      }
    };

    fetchItems();
  }, []);

  const deleteItem = async (id, name) => {
    Alert.alert(
      "Delete Item?",
      `Are you sure you want to remove ${name} from the pantry?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const userUID = await AsyncStorage.getItem('userUID');
              if (!userUID) return;

              await firestore()
                .collection('users')
                .doc(userUID)
                .collection('pantry')
                .doc(id)
                .delete();
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          },
        },
      ]
    );
  };

  const sortedItems = [...foodItems].sort(
    (a, b) => new Date(a.expiration) - new Date(b.expiration)
  );

  const FoodItemBox = ({ item }) => {
    const daysLeft = getDaysUntilExpiration(item.expiration);
    const backgroundColor = getBoxColor(daysLeft);
    const progressBarWidth = getProgressBarWidth(daysLeft);

    return (
      <TouchableOpacity onPress={() => deleteItem(item.id, item.name)}>
        <View style={[styles.itemBox, { backgroundColor }]}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.expirationText}>
            {daysLeft >= 0
              ? `${daysLeft} day(s) left`
              : `Expired ${Math.abs(daysLeft)} day(s) ago`}
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: progressBarWidth, backgroundColor: '#4CAF50' }]} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to your pantry!</Text>
      <ExpirationLegend />
      <FlatList
        data={sortedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FoodItemBox item={item} />}
      />
    </View>
  );
}

const ExpirationLegend = () => (
  <View style={styles.legendContainer}>
    <Text style={styles.legendTitle}>Expiration Safety Scale:</Text>
    <View style={styles.legendItem}>
      <View style={[styles.legendColor, { backgroundColor: '#bdf7a3' }]} />
      <Text>Safe (5+ days left)</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendColor, { backgroundColor: '#f0c986' }]} />
      <Text>Caution (2-4 days left)</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendColor, { backgroundColor: '#f28e5c' }]} />
      <Text>Expiring Soon (0-1 days left)</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendColor, { backgroundColor: '#fc8d99' }]} />
      <Text>Expired (Past due)</Text>
    </View>
    <Text>Click on an item to remove it from your pantry!</Text>
  </View>
);

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
  itemBox: {
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 10,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  expirationText: {
    fontSize: 14,
    marginTop: 5,
    color: '#404040',
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 3,
    marginTop: 5,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  legendContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 10,
  },
});