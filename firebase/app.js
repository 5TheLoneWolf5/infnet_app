// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmhFelk4Pbb39gkz2lWOQot49UAAmnzFw",
  authDomain: "react-native-project-72d0a.firebaseapp.com",
  projectId: "react-native-project-72d0a",
  storageBucket: "react-native-project-72d0a.appspot.com",
  messagingSenderId: "859479962779",
  appId: "1:859479962779:web:35c4c78fa2438cbdd9c23e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, db, auth, };