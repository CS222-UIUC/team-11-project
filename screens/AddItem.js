import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddItem() {
  const [itemName, setItemName] = useState("");
  const [expirationDate, setExpirationDate] = useState(new Date());
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
          expiration: expirationDate.toISOString(),
          addedAt: firestore.FieldValue.serverTimestamp(),
        });

      Alert.alert("Item added!", `${itemName} (expires on ${expirationDate.toDateString()})`);
      setItemName("");
      setExpirationDate(new Date());
    } catch (error) {
      console.error("Error adding item:", error);
      Alert.alert("Error", "Could not add item.");
    }
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

      {/* Touchable expiration date picker trigger (for Android only) */}
      <TouchableOpacity
        onPress={() => {
          if (Platform.OS === "android") setShowPicker(true);
        }}
        style={[styles.input, { justifyContent: "center" }]}
        activeOpacity={0.7}
      >
        <Text style={{ color: "#000" }}>
          {expirationDate.toDateString()}
        </Text>
      </TouchableOpacity>

      {/* iOS Picker - Always visible inline */}
      {Platform.OS === "ios" && (
        <DateTimePicker
          value={expirationDate}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            if (selectedDate) setExpirationDate(selectedDate);
          }}
          style={{ marginVertical: 20 }}
        />
      )}

      {/* Android Picker - Conditional Modal */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={expirationDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (event.type === "set" && selectedDate) {
              setExpirationDate(selectedDate);
            }
            setShowPicker(false);
          }}
        />
      )}

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
});