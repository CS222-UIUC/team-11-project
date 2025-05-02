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
  Platform,
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
      Alert.alert("Missing Fields", "Please enter both item name and expiration date.");
      return;
    }

    try {
      const userUID = await AsyncStorage.getItem("userUID");
      if (!userUID) {
        Alert.alert("Error", "User not signed in.");
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

      Alert.alert("🎉 Item added!", `${itemName} (expires on ${expirationDate})`);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>Add a Pantry Item</Text>
        <Text style={styles.subtext}>Keep your kitchen organized by tracking food before it spoils!</Text>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Item Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Milk, Pasta, Apples"
            placeholderTextColor="#aaa"
            value={itemName}
            onChangeText={setItemName}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Expiration Date</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
            <Text style={expirationDate ? styles.dateText : styles.placeholder}>
              {expirationDate || "Select expiration date"}
            </Text>
          </TouchableOpacity>
        </View>

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
          <Text style={styles.buttonText}>➕ Add Item</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#f2570a",
  },
  subtext: {
    fontSize: 14,
    textAlign: "center",
    color: "#777",
    marginBottom: 30,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    height: 50,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  placeholder: {
    fontSize: 16,
    color: "#999",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#f2570a",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});