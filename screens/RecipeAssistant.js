import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecipeAssistant() {
  const [expiringItems, setExpiringItems] = useState([]);
  const [recipe, setRecipe] = useState("");

  useEffect(() => {
    const fetchExpiringItems = async () => {
      const userUID = await AsyncStorage.getItem("userUID");
      const pantryRef = firestore().collection('users').doc(userUID).collection('pantry');

      const snapshot = await pantryRef.get();
      const today = new Date();
      const soonItems = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        const expDate = new Date(data.expiration);
        const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= 2) {
          soonItems.push(data.name);
        }
      });

      setExpiringItems(soonItems);
    };

    fetchExpiringItems();
  }, []);

  const askAIForRecipe = async () => {
    const prompt = `Give me a simple recipe using the following ingredients: ${expiringItems.join(", ")}. Be concise and helpful.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`, 
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    setRecipe(data.choices[0].message.content);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>AI Recipe Assistant</Text>
      <Text style={styles.subheader}>Using soon-to-expire items:</Text>
      <Text style={styles.items}>{expiringItems.join(", ") || "No items found"}</Text>

      <TouchableOpacity style={styles.button} onPress={askAIForRecipe}>
        <Text style={styles.buttonText}>Get Recipe</Text>
      </TouchableOpacity>

      {recipe && (
        <ScrollView style={styles.recipeBox}>
          <Text style={styles.recipeText}>{recipe}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subheader: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
  },
  items: {
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4285f4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  recipeBox: {
    backgroundColor: "#f3f3f3",
    padding: 15,
    borderRadius: 10,
    maxHeight: 300,
  },
  recipeText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
