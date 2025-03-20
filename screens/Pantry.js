import { useEffect } from "react";
import {Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function Pantry() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2570a" }}>
      
      <Text style={{color:"white"}}>View items in your pantry:</Text>
    </View>
  );
}