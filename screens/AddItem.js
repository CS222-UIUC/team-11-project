import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";

export default function AddItem() {
  const [itemName, setItemName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [pantryItems, setPantryItems] = useState([]);

  const handleAddItem = () => {
    if (!itemName || !expirationDate) {
      Alert.alert("Please enter the item name and expiration date.");
      return;
    }

    const newItem = {
      name: itemName,
      expiration: expirationDate,
    };

    setPantryItems([...pantryItems, newItem]);

    Alert.alert("Item added!", `${itemName} (expires on ${expirationDate})`);
    setItemName("");
    setExpirationDate("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add a new item to your pantry:</Text>

      <TextInput
        style={styles.input}
        placeholder="Item name"
        value={itemName}
        onChangeText={setItemName}
      />

      <TextInput
        style={styles.input}
        placeholder="Expiration date (e.g., 2025-04-10)"
        value={expirationDate}
        onChangeText={setExpirationDate}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
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
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
