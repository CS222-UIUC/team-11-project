/**
 * @format
 */
// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';

// AppRegistry.registerComponent(appName, () => App);

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import auth from '@react-native-firebase/auth';
import { initializeApp, getApps } from '@react-native-firebase/app';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCJ-r7x-HGTAZqg6R2_la9Ix_T8JrH_I70",
  databaseURL: "https://shelp-eccb6-default-rtdb.firebaseio.com/",
  projectId: "shelp-eccb6",
  storageBucket: "shelp-eccb6.firebasestorage.app",
  messagingSenderId: "421634745227",
  appId: "1:421634745227:ios:eef6c8be2d6a9a97c9458e",
};
if (getApps().length === 0) {
    initializeApp(firebaseConfig)
        .then(() => console.log("Firebase Initialized"))
        .catch((error) => console.log("Firebase Initialization Error:", error));
    } else {
    console.log("Firebase already initialized");
    }

AppRegistry.registerComponent(appName, () => App);
