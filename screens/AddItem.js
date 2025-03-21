import { useEffect } from "react";
import {Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function AddItem() {
  return (
    <View style={styles.container}>
      
      <Text style={styles.header}>Add a new item to your pantry:</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
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
  });
  