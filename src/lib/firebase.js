import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: 'AIzaSyAAT2k6qkWwbgfEhFFbjeYCYemXIDJhbMw',
    authDomain: 'blogging-platform-4ca71.firebaseapp.com',
    projectId: 'blogging-platform-4ca71',
    storageBucket: 'blogging-platform-4ca71.appspot.com',
    messagingSenderId: '168570922415',
    appId: '1:168570922415:web:3e06e7313daf9bb4147b5a',
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const firestore = firebase.firestore()
