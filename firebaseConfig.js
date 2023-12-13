import firebase from 'firebase/compat/app'; // Update the import statement

import 'firebase/compat/auth'; // Import the necessary Firebase modules
import 'firebase/compat/firestore';

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAyL_zbGF6WPIWJMg6BXS7yYaw9wBVGATQ",
    authDomain: "netpiraters.firebaseapp.com",
    projectId: "netpiraters",
    storageBucket: "netpiraters.appspot.com",
    messagingSenderId: "33126733154",
    appId: "1:33126733154:web:2f3c32b5bf86fab43fc83b",
    measurementId: "G-DK75ZJ23MX"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
