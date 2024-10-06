// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDftlCPY-xJhDd78L-hJVOb23731TaeecA",
  authDomain: "photofolio-app-a3caa.firebaseapp.com",
  projectId: "photofolio-app-a3caa",
  storageBucket: "photofolio-app-a3caa.appspot.com",
  messagingSenderId: "915892054352",
  appId: "1:915892054352:web:aa98193438333b46316455",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
