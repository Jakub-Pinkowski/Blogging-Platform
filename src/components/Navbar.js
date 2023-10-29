import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState, useEffect } from 'react'
import { UserContext } from '@/lib/context'
import { auth, storage } from '@/lib/firebase'

// Top navbar
export default function Navbar() {
    const { user, username } = useContext(UserContext)
    const router = useRouter()
    const [imageUrl, setImageUrl] = useState('')

    const signOut = () => {
        auth.signOut()
        router.reload()
    }

    useEffect(() => {
        // Get a reference to the storage item
        const storageRef = storage.refFromURL(
            'gs://blogging-platform-4ca71.appspot.com/user-2.png'
        )

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

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/" legacyBehavior>
                        <button className="btn-logo">NXT</button>
                    </Link>
                </li>

                {/* user is signed-in and has username */}
                {username && (
                    <>
                        <li className="push-left">
                            <button onClick={signOut}>Sign Out</button>
                        </li>
                        <li>
                            <Link href="/admin" legacyBehavior>
                                <button className="btn-blue">Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`} legacyBehavior>
                                <img src={user.photoURL || imageUrl} />
                            </Link>
                        </li>
                    </>
                )}

                {/* user is not signed OR has not created username */}
                {!username && (
                    <li>
                        <Link href="/enter" legacyBehavior>
                            <button className="btn-blue">Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}
