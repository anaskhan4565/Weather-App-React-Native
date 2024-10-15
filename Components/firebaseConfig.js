 //firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHnzBpitKttXfYz9S7HiC3k4NwNjXbpOs",
  authDomain: "test-717d4.firebaseapp.com",
  projectId: "test-717d4",
  storageBucket: "test-717d4.appspot.com",
  messagingSenderId: "959325175564",
  appId: "1:959325175564:web:a6186f4983d2f140359329",
  measurementId: "G-JC3ZV42SX8"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
