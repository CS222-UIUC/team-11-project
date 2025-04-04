import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Home from "./screens/Home";
import AddItem from './screens/AddItem';
import Pantry from './screens/Pantry'
const Stack = createNativeStackNavigator();


export default function App() {
    useEffect(() => {
        const initializeFirebase = async () => {
            if (getApps().length === 0) {
            await initializeApp();
            await auth().setPersistence(auth.Auth.Persistence.LOCAL);
            }
        };
        initializeFirebase();
    }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Sign_in"
          component={SignIn}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"  
          component={SignUp}
          options={{ headerShown: false }}
  />
        <Stack.Screen
          name="HomeFirst"
          component={InitNavigator}
          options={{ headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faList } from '@fortawesome/free-solid-svg-icons/faList'

const Tab = createBottomTabNavigator();
const InitNavigator = () => {

  return (
          <Tab.Navigator 
          initialRouteName="Home" 
          screenOptions={{
          headerShown: false,
          tabBarLabelStyle: {
            fontSize:14, 
            fontFamily: 'Mohave-Light',
          },
          tabBarActiveTintColor: '#f2570a',
          tabBarInactiveTintColor: 'white',
          tabBarHideOnKeyboard: true,
          tabBarStyle: {backgroundColor: '#2F2F2F', padding:0, height:85, borderTopWidth:0},
          tabBarItemStyle: {marginTop: 5}
        }}>
          <Tab.Screen name="Home" component={Home} 
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ focused, color, size }) => (
              <FontAwesomeIcon icon={faHome} size={20} color={focused?'#f2570a':'white'} />
            ),
          }}/>
          <Tab.Screen name="AddItem" component={AddItem} 
          options={{
            tabBarLabel: 'Add Item',
            tabBarIcon: ({ focused, color, size }) => (
              <FontAwesomeIcon icon={faPlus} size={20} color={focused?'#f2570a':'white'} />

            ),
          }}/>
          <Tab.Screen name="Pantry" component={Pantry} 
          options={{
            tabBarLabel: 'View Pantry',
            tabBarIcon: ({ focused, color, size }) => (
              <FontAwesomeIcon icon={faList} size={20} color={focused?'#f2570a':'white'} />
            ),
          }}/>
          </Tab.Navigator>
  );
}
