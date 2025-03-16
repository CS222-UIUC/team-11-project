import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from "./screens/SignIn";
import Home from "./screens/Home";

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Sign_in"
          component={SignIn}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Home Page' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
