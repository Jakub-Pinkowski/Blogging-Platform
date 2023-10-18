import '@/styles/globals.css'

import { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import { UserContext } from '@/lib/context'
import Navbar from '@/components/Navbar'

export default function App({ Component, pageProps }) {
    

    return (
        <UserContext.Provider value={{ user: {}, username: 'johndoe' }}>
            <Navbar />
            <Component {...pageProps} />
            <Toaster />
        </UserContext.Provider>
    )
}
