import app from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC0cOeTd02mN9PcfJVX9f11oRBNwtPTo5Y",
  authDomain: "crud-3c1fc.firebaseapp.com",
  projectId: "crud-3c1fc",
  storageBucket: "crud-3c1fc.appspot.com",
  messagingSenderId: "155194920201",
  appId: "1:155194920201:web:8a81f52a23ea32f20117d8"
};

app.initializeApp(firebaseConfig);
const db = app.firestore();
const auth = app.auth();

export{db, auth};