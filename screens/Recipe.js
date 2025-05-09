import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OPENAI_API_KEY } from '@env';  // ← imported from .env

export default function Recipe() {
  const [foodItems, setFoodItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

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

  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleGenerateRecipe = async () => {
    const selectedNames = foodItems
      .filter(item => selectedItems.includes(item.id))
      .map(item => item.name);

    if (selectedNames.length === 0) {
      Alert.alert('No Items Selected', 'Please select at least one ingredient.');
      return;
    }

    try {
      Alert.alert('Generating Recipe...', 'Please wait...');
      const recipe = await callOpenAI(selectedNames);
      Alert.alert('Recipe Generated', recipe);

      // Optional: Navigate to a dedicated recipe display screen
      // navigation.navigate('RecipeResult', { recipe });

    } catch (error) {
      Alert.alert('Error', 'Failed to generate recipe.');
    }
  };

  const FoodItemBox = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);
    return (
      <TouchableOpacity onPress={() => toggleSelectItem(item.id)}>
        <View style={[styles.itemBox, isSelected && styles.itemBoxSelected]}>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Ingredients for Recipe</Text>
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FoodItemBox item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <Button title="Generate Recipe" onPress={handleGenerateRecipe} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f2570a',
    textAlign: 'center',
    marginBottom: 16,
  },
  itemBox: {
    padding: 18,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  itemBoxSelected: {
    backgroundColor: '#add8e6',
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
});

const callOpenAI = async (selectedNames) => {
  const prompt = `Give me a simple recipe using these ingredients: ${selectedNames.join(', ')}.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,  // ← uses env variable here
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI API returned error:', data.error);
      throw new Error(data.error.message);
    }

    if (data.choices && data.choices.length > 0) {
      const recipeText = data.choices[0].message.content;
      return recipeText;
    } else {
      throw new Error('No choices returned from OpenAI.');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

