'use client';
import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Error = {
    field: string;
    message: string;
    rule: string;
    index?: string;
    meta?: string;
};

type ErrorArray = Error[];

export default function Form() {
    let errorArray: ErrorArray = [];

    const [errors, setErrors] = useState(errorArray);
    const [isError, setIsError] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify({
                    username: formData.get('username'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    password_confirmation: formData.get(
                        'password_confirmation'
                    ),
                }),
            });

            const data = await res.json();

            if (!data) {
                throw new Error('Something went wrong.');
            }

            if (!data.username) {
                const errors: Error[] = [];
                data.forEach((entry: any) => {
                    errors.push(entry.message);
                });
                setErrors(errors);
                setIsError(true);
                return;
            }

            // submit data to database to store credentials.

            console.log('OK!', data);

            router.push('/login');
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (errors.length > 0) {
            console.log(errors);
        }
    }, [errors]);

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Image
                    className="mx-auto h-20 w-20"
                    src="/group2.png"
                    width={500}
                    height={500}
                    alt="PL Blackjack Logo"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">
                    Create a Premier League Blackjack Account
                </h2>
                {/* Change the color of PL Blackjack and size up the logo. */}
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    action="#"
                    method="POST"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                        >
                            Username
                        </label>
                        <div className="mt-2 ">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                placeholder="Burntelli"
                                required
                                className="block  w-full autofill:text-white autofill:shadow-[inset_0_0_0px_1000px_rgb(55,65,81)]  rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                        >
                            Email address
                        </label>
                        <div className="mt-2 ">
                            <input
                                id="email"
                                placeholder="cristiano@ronaldo.com"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full autofill:text-white autofill:shadow-[inset_0_0_0px_1000px_rgb(55,65,81)] rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                            >
                                Password
                            </label>
                            <div className="text-sm"></div>
                        </div>
                        <p className="text-xs text-gray-500 italic">
                            A minimum of 8 characters is required.
                        </p>

                        <div className="mt-2">
                            <input
                                id="password"
                                placeholder="********"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                            >
                                Confirm password
                            </label>
                            <div className="text-sm"></div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password_confirmation"
                                placeholder="********"
                                name="password_confirmation"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Create Account
                        </button>
                    </div>
                </form>

                {errors.length > 0 && (
                    <ul className="text-xs pt-1 text-red-500">
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
                <div>
                    <div className="relative mt-10">
                        <div
                            className="absolute inset-0 flex items-center"
                            aria-hidden="true"
                        >
                            {/* <div className="w-full border-t border-gray-200" /> */}
                        </div>
                        <div className="relative mb-1 flex justify-center text-sm font-light leading-6">
                            <span className=" text-gray-900 w-auto dark:text-white ">
                                Or continue with
                            </span>
                        </div>
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="mt-2 grid grid-cols-1 mx-20 py-5 gap-4">
                        <a
                            href="#"
                            className="flex w-full items-center justify-center gap-3 rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-transparent"
                        >
                            <svg
                                className="h-5 w-5"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                    fill="#EA4335"
                                />
                                <path
                                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                                    fill="#34A853"
                                />
                            </svg>
                            <span className="text-sm font-semibold leading-6">
                                Google
                            </span>
                        </a>
                    </div>
                    <p className="mt-5 text-center text-sm text-gray-500">
                        Already a member?{' '}
                        <Link
                            href="/login"
                            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                        >
                            Log in here.
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
