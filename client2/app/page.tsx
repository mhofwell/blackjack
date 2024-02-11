'use client';
import { useState, useEffect } from 'react';
import LoginForm from '../app/components/UI/LoginForm';

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            console.log('Logged In');
        }
    }, [isLoggedIn]);

    const data = {
        isLoggedIn,
        isNew,
    };

    return (
        <main className="flex h-screen">
            <LoginForm {...data} />
        </main>
    );
}
