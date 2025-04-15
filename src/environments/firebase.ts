// src/environments/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyDMs1k5KrRoBxeB3VRV6smRXk6BWZjpIYk",
    authDomain: "jitcall-b72ec.firebaseapp.com",
    projectId: "jitcall-b72ec",
    storageBucket: "jitcall-b72ec.firebasestorage.app",
    messagingSenderId: "143489396645",
    appId: "1:143489396645:web:c0589cbc9a4ef07e65c24c",
    measurementId: "G-3VS63P1SYS"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { app, auth, db, messaging };
