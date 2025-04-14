import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddItem() {
  const [itemName, setItemName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const handleAddItem = async () => {
    if (!itemName || !expirationDate) {
      Alert.alert("Please enter the item name and expiration date.");
      return;
    }

    try {
      const userUID = await AsyncStorage.getItem("userUID");
      if (!userUID) {
        Alert.alert("User not signed in.");
        return;
      }

      await firestore()
        .collection("users")
        .doc(userUID)
        .collection("pantry")
        .add({
          name: itemName,
          expiration: expirationDate,
          addedAt: firestore.FieldValue.serverTimestamp(),
        });

      Alert.alert("Item added!", `${itemName} (expires on ${expirationDate})`);
      setItemName("");
      setExpirationDate("");
    } catch (error) {
      console.error("Error adding item:", error);
      Alert.alert("Error", "Could not add item.");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      const formatted = selectedDate.toISOString().split("T")[0]; // yyyy-mm-dd
      setExpirationDate(formatted);
    }
    setShowPicker(false);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
      <Text style={styles.header}>Add a new item to your pantry:</Text>

      <Text style = {{ color: "black", fontSize: 20, marginBottom: 5 }}>Item:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter item name"
        placeholderTextColor="#999" 
        
        value={itemName}
        onChangeText={setItemName}
      />

      <Text style = {{ color: "black", fontSize: 20, marginBottom: 5 }}>Expiration Date:</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <Text style={expirationDate ? styles.dateText : styles.placeholder}>
          {expirationDate || "Select expiration date"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={expirationDate ? new Date(expirationDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          textColor="#000"
        />
      )}



      <TouchableOpacity style={styles.button} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
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
    marginBottom: 20,
    textAlign: "center",
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
    backgroundColor: "#f2570a",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  placeholder: {
    color: "#999",
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: "center",
  },
});