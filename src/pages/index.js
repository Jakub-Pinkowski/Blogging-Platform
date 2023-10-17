import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import toast from 'react-hot-toast'

import Loader from '@/components/Loader'

export default function Home() {
    return (
        <div>
            <Loader show />
            <h1> Hello Index Page</h1>
            <button onClick={() => toast.success('hello toast')}>Toast Me</button>
        </div>
    )
}
