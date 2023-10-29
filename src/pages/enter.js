import { useRouter } from 'next/router'
import { useEffect, useState, useCallback, useContext } from 'react'
import debounce from 'lodash.debounce'

import { auth, firestore, googleAuthProvider, storage } from '@/lib/firebase'
import { UserContext } from '@/lib/context'
import Metatags from '@/components/Metatags'
import styles from '@/styles/Enter.module.css'

export default function Enter(props) {
    const { user, username } = useContext(UserContext)

    // 1. user signed out <SignInWithGoogle /> and <SignInWithEmail />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />
    return (
        <main>
            <Metatags title="Enter" description="Sign up for this amazing app!" />
            {user ? (
                !username ? (
                    <UsernameForm />
                ) : (
                    <SignOutButton />
                )
            ) : (
                <>
                    <SignInWithGoogle />
                    <SignInWithEmail />
                </>
            )}
        </main>
    )
}

// Sign in with Google button
function SignInWithGoogle() {
    const router = useRouter()
    const signInWithGoogle = async () => {
        try {
            await auth.signInWithPopup(googleAuthProvider)
            router.push('/')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div className={styles.container}>
                <button className="btn-google" onClick={signInWithGoogle}>
                    <img src={'/google.png'} width="30px" />
                    <h2> Sign in with Google </h2>
                </button>
            </div>
        </>
    )
}

// Sign in with email/password
function SignInWithEmail() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [error, setError] = useState(null)

    const router = useRouter()
    const { user } = useContext(UserContext)

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            await auth.signInWithEmailAndPassword(email, password)
            router.push('/')
        } catch (error) {
            if (error.code === 'auth/invalid-login-credentials') {
                alert('Invalid email or password. Please check your credentials.')
                setEmail('')
                setPassword('')
            } else {
                setError(error.message)
            }
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            await auth.createUserWithEmailAndPassword(email, password)
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>Sign in with email/password instead</h2>
            <h3 className={styles.title}>{isRegistering ? 'Register' : 'Login'}</h3>
            <form className={styles.form} onSubmit={isRegistering ? handleRegister : handleLogin}>
                <input
                    className={styles.input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="btn-blue" type="submit">
                    {isRegistering ? 'Register' : 'Login'}
                </button>
            </form>
            <p className={styles.message}>
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                <button className="btn-gray" onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Login instead' : 'Register instead'}
                </button>
            </p>
        </div>
    )
}

// Sign out button
function SignOutButton() {
    const router = useRouter()
    const signOutHandler = async () => {
        await auth.signOut()
        router.push('/')
    }

    return (
        <>
            <button onClick={signOutHandler}>Sign Out</button>
        </>
    )
}

// Username form
function UsernameForm() {
    const [formValue, setFormValue] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const router = useRouter()

    useEffect(() => {
        // Get a reference to the storage item
        const storageRef = storage.refFromURL('gs://blogging-platform-4ca71.appspot.com/user-2.png')

        // Get the download URL
        storageRef
            .getDownloadURL()
            .then((url) => {
                setImageUrl(url)
            })
            .catch((error) => {
                // Handle any errors here
                console.error('Error getting download URL:', error)
            })
    }, [])

    const { user, username } = useContext(UserContext)

    const onSubmit = async (e) => {
        e.preventDefault()

        // Create refs for both documents
        const userDoc = firestore.doc(`users/${user.uid}`)
        const usernameDoc = firestore.doc(`usernames/${formValue}`)

        // If the user has no displayName, set it equal to the username
        const batch = firestore.batch()
        batch.set(userDoc, {
            username: formValue,
            photoURL: user.photoURL || imageUrl,
            displayName: user.displayName || formValue,
        })
        batch.set(usernameDoc, { uid: user.uid })

        await batch.commit()
        router.push('/')
    }

    const onChange = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase()
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setFormValue(val)
            setLoading(false)
            setIsValid(false)
        }

        if (re.test(val)) {
            setFormValue(val)
            setLoading(true)
            setIsValid(false)
        }
    }

    //

    useEffect(() => {
        checkUsername(formValue)
    }, [formValue])

    // Hit the database for username match after each debounced change
    // useCallback is required for debounce to work
    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = firestore.doc(`usernames/${username}`)
                const { exists } = await ref.get()
                console.log('Firestore read executed!')
                setIsValid(!exists)
                setLoading(false)
            }
        }, 500),
        []
    )

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input
                        name="username"
                        placeholder="myname"
                        value={formValue}
                        onChange={onChange}
                    />
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    )
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>
    } else {
        return <p></p>
    }
}
