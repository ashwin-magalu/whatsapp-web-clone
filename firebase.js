import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyDwxna-4ZE08WkFCA_5IUqvxTDfkEzgaDI",
	authDomain: "sociogram-world.firebaseapp.com",
	databaseURL: "https://sociogram-world.firebaseio.com",
	projectId: "sociogram-world",
	storageBucket: "sociogram-world.appspot.com",
	messagingSenderId: "598795257178",
	appId: "1:598795257178:web:e964c82ff8423057e51f63",
	measurementId: "G-TCRKM3NJN6",
};

const app = !firebase.apps.length
	? firebase.initializeApp(firebaseConfig)
	: firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
