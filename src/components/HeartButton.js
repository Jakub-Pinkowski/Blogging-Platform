import { firestore, auth, increment } from '../lib/firebase'
import { useDocument } from 'react-firebase-hooks/firestore'

import { useState } from 'react'

export default function Heart({ postRef }) {
    const uid = auth.currentUser?.uid
    const heartRef = postRef.collection('hearts').doc(uid)
    const [heartDoc] = useDocument(heartRef)

    const [isHearted, setIsHearted] = useState(false)

    if (typeof heartDoc === 'string') {
        setIsHearted(true)
    }

    const addHeart = async () => {
        const batch = firestore.batch()

        if (isHearted) {
            // If the user has hearted the post, unheart it
            batch.update(postRef, { heartCount: increment(-1) })
            batch.delete(heartRef)
            setIsHearted(false)
        } else {
            // If the user has not hearted the post, add the heart
            batch.update(postRef, { heartCount: increment(1) })
            batch.set(heartRef, { uid })
            setIsHearted(true)
        }

        await batch.commit()
    }

    return <button onClick={addHeart}>{isHearted ? '💔 Unheart' : '💗 Heart'}</button>
}
