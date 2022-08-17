import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB83zPjCDj7EJ-75FQi-IbT6MReWxrCI0o',
  authDomain: 'project1-bca06.firebaseapp.com',
  projectId: 'project1-bca06',
  storageBucket: 'project1-bca06.appspot.com',
  messagingSenderId: '901480506991',
  appId: '1:901480506991:web:46a667743be6d83a560f9a',
  measurementId: 'G-4EMY0950GJ'
};
const firebase = initializeApp(firebaseConfig);
const storage = getStorage(firebase);

export default { firebase, storage };
