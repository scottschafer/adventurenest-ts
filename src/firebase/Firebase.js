import * as firebase from 'firebase/app';
import 'firebase/auth';


var config = {
  apiKey: "AIzaSyAaraJrFmOs75IS2NEdRtCb0FywjiD_2t8",
  authDomain: "adventurenest.firebaseapp.com",
  databaseURL: "https://adventurenest.firebaseio.com",
  projectId: "adventurenest",
  storageBucket: "",
  messagingSenderId: "31466545946"
};

const firebaseApp = firebase.initializeApp(config);

export default firebaseApp;
