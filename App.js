import { Image, StyleSheet, Text, TouchableOpacity, 
  View, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GoogleSignin, statusCodes } from 
  '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';


const App = () => {
  useEffect(() => {
      GoogleSignin.configure({

          // Client ID of type WEB for your server (needed
          // to verify user ID and offline access)
          webClientId: '421634745227-lv73muuh0et88ii6r0a007p0k86vbuki.apps.googleusercontent.com',
      });
  }, [])

  const signIn = async () => {
      try {

          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          await GoogleSignin.revokeAccess();
          console.warn(userInfo.user)
      } catch (error) {

          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              
              // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
              console.log(error)
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              console.log(error)
          } else {
              console.log(error)
          }
      }

  };

  return (
      <View style={styles.container}>

          <Pressable style={styles.signupbutton} 
              onPress={() => { signIn(), console.log('click') }}>
              <Image style={{ width: 30, height: 30, }} 
                  source={require('../../assets/search.png')}>
              </Image>
          </Pressable>
      </View>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
      justifyContent: 'center',
      flex: 1,
      paddingHorizontal: 15,
      backgroundColor: '#1f1f1f',
      alignItems: 'center',

  },
  signupbutton: {
      justifyContent: 'center',
      backgroundColor: 'pink',
      width: 300,
      height: 46,
      borderRadius: 15,
      marginTop: 25,
      alignItems: 'center',
  },
})
