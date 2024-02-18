'use client';
import { useState } from 'react';
import { redirect } from 'next/navigation';

export default async function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isNew, setIsNew] = useState(false);

    return (
        <main className="flex h-screen">
            {isLoggedIn ? redirect('/home') : redirect('/login')}
        </main>
    );
}
