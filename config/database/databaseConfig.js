import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC9FNql5E0l-OyHLLkE9e8HDiPU8A-uGFs",
  authDomain: "atlas-app-f8c98.firebaseapp.com",
  projectId: "atlas-app-f8c98",
  storageBucket: "atlas-app-f8c98.appspot.com",
  messagingSenderId: "173835230328",
  appId: "1:173835230328:web:00c4c3bb3f6db10cc9a18d",
  measurementId: "G-FPKHGNPC1J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage =  getStorage(app);
const db = getFirestore(app);

export {app, storage, db};