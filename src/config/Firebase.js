import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyBu8mjVMv4R5N4SiorVcynqGuuCcWciHL4",
  authDomain: "price-analysis-360521.firebaseapp.com",
  projectId: "price-analysis-360521",
  storageBucket: "price-analysis-360521.appspot.com",
  messagingSenderId: "9390529437",
  appId: "1:9390529437:web:807c8c3b2afacee8fdad74",
};

const firebaseApp = initializeApp(config);
const db = getFirestore(firebaseApp);

export { firebaseApp, db };
