import { useEffect } from "react";
import {Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function AddItem() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2570a" }}>
      
      <Text style={{color:"white"}}>Add a new item to your pantry:</Text>
    </View>
  );
}