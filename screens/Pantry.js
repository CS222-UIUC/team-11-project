import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getDaysUntilExpiration = (expirationDate) => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getBoxColor = (daysLeft) => {
  if (daysLeft >= 5) return '#bdf7a3';
  if (daysLeft >= 2) return '#f0c986';
  if (daysLeft < 0) return '#fc8d99';
  return '#f28e5c';
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
      `Are you sure you want to remove "${name}" from your pantry?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
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
              ? `⏳ ${daysLeft} day(s) left`
              : `⚠️ Expired ${Math.abs(daysLeft)} day(s) ago`}
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: progressBarWidth }]} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Pantry</Text>
      <Text style={styles.subtext}>Tap on an item to remove it</Text>
      <ExpirationLegend />
      <FlatList
        data={sortedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FoodItemBox item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const ExpirationLegend = () => (
  <View style={styles.legendContainer}>
    <Text style={styles.legendTitle}>Expiration Key:</Text>
    {[
      { color: '#bdf7a3', label: 'Safe (5+ days)' },
      { color: '#f0c986', label: 'Caution (2–4 days)' },
      { color: '#f28e5c', label: 'Expiring Soon (0–1 days)' },
      { color: '#fc8d99', label: 'Expired' },
    ].map((item, i) => (
      <View key={i} style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
        <Text style={styles.legendLabel}>{item.label}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f2570a',
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
  },
  itemBox: {
    padding: 18,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  expirationText: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  progressBarContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  legendContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  legendLabel: {
    fontSize: 14,
    color: "#444",
  },
});
