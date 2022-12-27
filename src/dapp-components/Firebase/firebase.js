import app from 'firebase/app';
//firebase auth
import 'firebase/auth';
import "firebase/analytics";
import 'firebase/firestore';
import 'firebase/database';

const config = {    
  apiKey: "AIzaSyB_uZwI4kzarB14hVfmuyJzjADejHqejpQ",
  authDomain: "projectsidekick-9feaf.firebaseapp.com",
  databaseURL: "https://projectsidekick-9feaf-default-rtdb.firebaseio.com",
  projectId: "projectsidekick-9feaf",
  storageBucket: "projectsidekick-9feaf.appspot.com",
  messagingSenderId: "910858080620",
  appId: "1:910858080620:web:5346d90f3e2264d49e6349",
  measurementId: "G-ZZ90NM4YJD"
};
  
class Firebase {
    constructor() {
      app.initializeApp(config);
      
      //firebase auth
      this.auth = app.auth();
      this.firestore = app.firestore();
      this.analytics = app.analytics();
      this.db = app.database();
  }

  // Auth API
  doCreateUserWithEmailAndPassword = (email, password) => {
    this.auth.createUserWithEmailAndPassword(email, password);
  }
  doSignInWithEmailAndPassword = (email, password) => {
    this.auth.signInWithEmailAndPassword(email, password);
  }
  
  doSignOut = () => {
    this.auth.signOut();
  }
  
  doPasswordReset = email => {
    this.auth.sendPasswordResetEmail(email);
  }

  doPasswordUpdate = password => {
    this.auth.currentUser.updatePassword(password);
  }

  }
   
  export default Firebase;