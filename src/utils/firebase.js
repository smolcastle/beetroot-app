import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_Aj2v9xpG43t6IIfCkK1PhU6DfMfTORI",
  authDomain: "beetroot-2192b.firebaseapp.com",
  projectId: "beetroot-2192b",
  storageBucket: "beetroot-2192b.appspot.com",
  messagingSenderId: "932312680028",
  appId: "1:932312680028:web:797f45f60a46ce52d58899",
  measurementId: "G-SG3C9M5W4W",
};

const firebase = initializeApp(firebaseConfig);

export default firebase;
