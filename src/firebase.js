

import firebase from "firebase/app";
import "firebase/auth";




const Config = {
  apiKey: "AIzaSyD_Eub_0yK8fx_ZuWvLTFu6S2bgVoYeB7M",
  authDomain: "mern-4dbe9.firebaseapp.com",
  projectId: "mern-4dbe9",
  storageBucket: "mern-4dbe9.appspot.com",
  messagingSenderId: "455005923505",
  appId: "1:455005923505:web:e91b064422d11f2222da90"
};

if (!firebase.apps.length) {
  firebase.initializeApp(Config);
}




export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();







// Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
