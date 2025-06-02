import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyBRIUV501nTd_gS71RnTQOrJ_KlPvYdnVI",
  authDomain: "rn-notes-5d693.firebaseapp.com",
  projectId: "rn-notes-5d693",
  storageBucket: "rn-notes-5d693.firebasestorage.app",
  messagingSenderId: "116959537111",
  appId: "1:116959537111:web:aa6d1106f0f0fc5c190d92",
  measurementId: "G-TE98LFTQWR"
};
      
      const app = initializeApp(firebaseConfig);
      export const db = getFirestore(app);