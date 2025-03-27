import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB8qBTYRQnMlOX6a2ZWG3423wGsAz9aM5A",
  authDomain: "wayzu-12bc2.firebaseapp.com",
  projectId: "wayzu-12bc2",
  storageBucket: "wayzu-12bc2.firebasestorage.app",
  messagingSenderId: "45471083137",
  appId: "1:45471083137:web:66799177f7051cc3fe7b80",
  measurementId: "G-LSTBFDEQL6"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);