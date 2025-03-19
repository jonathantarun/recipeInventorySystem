import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCFogN9-rw6jvyyErV0AZ0S-KFIO9yGDjo",
    authDomain: "recipe-inventory-app.firebaseapp.com",
    projectId: "recipe-inventory-app",
    storageBucket: "recipe-inventory-app.firebasestorage.app",
    messagingSenderId: "625397808800",
    appId: "1:625397808800:web:fd61cfab097a51301353c5"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export { db }