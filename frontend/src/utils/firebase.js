// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3odXovxjQirxeP4o1LzSM0PyUB28gQoM",
  authDomain: "happyfaces-210af.firebaseapp.com",
  projectId: "happyfaces-210af",
  storageBucket: "happyfaces-210af.firebasestorage.app",
  messagingSenderId: "255350519014",
  appId: "1:255350519014:web:8beb5c0989f3f883617727"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
export default app;