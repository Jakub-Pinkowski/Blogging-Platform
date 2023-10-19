import { auth, firestore, googleAuthProvider } from '../lib/firebase'
import debounce from 'lodash.debounce'
import { useCallback, useContext, useEffect, useState } from 'react'

import { UserContext } from '@/lib/context'

export default function Enter(props) {
    const { user, username } = useContext(UserContext)

    // 1. user signed out <SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />
    return <main>{user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}</main>
}

const SignInButton = () => {
    const signInWithGoogle = async () => {
        await auth.signInWithPopup(googleAuthProvider)
    }

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'google.png'} /> Sign in with Google
        </button>
    )
}

const SignOutButton = () => {
    return <button onClick={() => auth.signOut()}>Sign Out</button>
}

const UsernameForm = () => {
    const [formValue, setFormValue] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [loading, setLoading] = useState(false)

    const { user, username } = useContext(UserContext)

    const onChange = (event) => {
        // Force form value typed in form to match correct format
        const val = event.target.value.toLowerCase()
        const regex = /^\w*$/
        if (regex.test(val)) {
            setFormValue(val)
            setIsValid(true)
        }

        if (regex.test(val)) {
            setFormValue(val)
            setLoading(true)
            setIsValid(true)
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault()

        // Create refs for both documents
        const userDoc = firestore.doc(`users/${user.uid}`)
        const usernameDoc = firestore.doc(`usernames/${formValue}`)

        // Commit both docs together as a batch write.
        try {
            const batch = firestore.batch()
            batch.set(userDoc, {
                username: formValue,
                photoURL: user.photoURL,
                displayName: user.displayName,
            })
            batch.set(usernameDoc, { uid: user.uid })

            await batch.commit()
        } catch (error) {
            console.log(error)
        }
    }

    //

    useEffect(() => {
        checkUsername(formValue)
    }, [formValue])

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
                <h3>Choose Udername</h3>
                <form>
                    <input
                        name="username"
                        placeholder="myname"
                        value={formValue}
                        onChange={onChange}
                    />

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
                        <br />
                    </div>
                </form>
            </section>
        )
    )
}
