// import auth from '@react-native-firebase/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';


// GoogleSignin.configure({
//   webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', 
// });


// export const signInWithGoogle = async () => {
//   try {
   
//     await GoogleSignin.hasPlayServices();

   
//     const { idToken } = await GoogleSignin.signIn();

   
//     const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    
//     return auth().signInWithCredential(googleCredential);
//   } catch (error) {
//     console.error('Google Sign-In Error:', error);
//     throw error;
//   }
// };


// export const signOut = async () => {
//   try {
//     await auth().signOut();
//     await GoogleSignin.signOut();
//   } catch (error) {
//     console.error('Sign Out Error:', error);
//     throw error;
//   }
// };


// export const getCurrentUser = () => {
//   return auth().currentUser;
// };
