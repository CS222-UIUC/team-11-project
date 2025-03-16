import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Import Firebase to ensure it's initialized
import '@react-native-firebase/app';
import '@react-native-firebase/auth';

console.log("Firebase setup complete.");

AppRegistry.registerComponent(appName, () => App);
