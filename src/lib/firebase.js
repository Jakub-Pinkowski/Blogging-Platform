import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

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

// Auth exports
export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()


// Firestore exports
export const firestore = firebase.firestore()
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
export const fromMillis = firebase.firestore.Timestamp.fromMillis
export const increment = firebase.firestore.FieldValue.increment

// Storage exports
export const storage = firebase.storage()
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED

/// Helper functions

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
    const usersRef = firestore.collection('users')
    const query = usersRef.where('username', '==', username).limit(1)
    const userDoc = (await query.get()).docs[0]
    return userDoc
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
    const data = doc.data()
    return {
        ...data,
        // Convert firestore timestamp to number
        createdAt: data?.createdAt.toMillis() || 0,
        updatedAt: data?.updatedAt.toMillis() || 0,
    }
}
