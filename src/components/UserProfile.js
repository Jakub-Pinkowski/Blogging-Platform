import React, { useEffect, useState } from 'react'
import { storage } from '@/lib/firebase'

export default function UserProfile({ user }) {
    const [imageUrl, setImageUrl] = useState('')

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

    return (
        <div className="box-center">
            <img src={user.photoURL || imageUrl} alt="user avatar" className="card-img-center" />
            <p>
                <i>@{user.username}</i>
            </p>
            <h1>{user.displayName || 'Anonymous User'}</h1>
        </div>
    )
}
