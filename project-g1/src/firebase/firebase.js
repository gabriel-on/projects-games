import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

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

const db = getFirestore(app)

export { db }