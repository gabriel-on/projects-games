import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnIn2CEB4Y9x_tQ5t3FJgVgp1PYaGMJ-o",
    authDomain: "game-list-c3dc2.firebaseapp.com",
    projectId: "game-list-c3dc2",
    storageBucket: "game-list-c3dc2.appspot.com",
    messagingSenderId: "667777424141",
    appId: "1:667777424141:web:830513936516bcafe1ee44"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore(app)
const storage = getStorage (app);

export { auth, db, storage }
export default app;