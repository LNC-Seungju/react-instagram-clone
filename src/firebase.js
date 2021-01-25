import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBsDPv920ZSDoODxc9_QnjN_7NfXOTTgeo",
  authDomain: "react-instagram-clone-80c2b.firebaseapp.com",
  projectId: "react-instagram-clone-80c2b",
  storageBucket: "react-instagram-clone-80c2b.appspot.com",
  messagingSenderId: "852795578925",
  appId: "1:852795578925:web:d702bb5375dd7c2d3ab6a4",
  measurementId: "G-434N2MG5J3"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };