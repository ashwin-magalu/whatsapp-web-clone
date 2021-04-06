import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyDwxna-4ZqvxTDfkEzgaDI",
	authDomain: "d.firebaseapp.com",
	databaseURL: "https://d.firebaseio.com",
	projectId: "d",
	storageBucket: "d.appspot.com",
	messagingSenderId: "59879178",
	appId: "1:59879525eb:e964c82ff8423057e51f63",
	measurementId: "G-TCM3NJN6",
};

const app = !firebase.apps.length
	? firebase.initializeApp(firebaseConfig)
	: firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
