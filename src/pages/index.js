import styles from '@/styles/Home.module.css'
import Link from 'next/link'

import Loader from '@/components/Loader'

export default function Home() {
    return (
        <main>
            <div>
                <Loader show />
                <h1> Hello Index Page</h1>
            </div>
        </main>
    )
}
