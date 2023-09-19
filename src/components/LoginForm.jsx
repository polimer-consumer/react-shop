'use client'

import React, {useState} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";

export function LoginForm() {
    const [isWrongCredentials, setWrongCredentials] = useState(false);
    const router = useRouter();

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const res = await signIn("credentials", {
            email: data.get("email"),
            password: data.get("password"),
            redirect: false,
            callbackUrl: "/content"
        });

        if (res && !res.error) {
            router.push("/content");
        } else {
            setWrongCredentials(true);
        }
    }

    return (
        <div className="mx-auto my-32 max-w-xl px-4 py-8 lg:max-w-xl lg:px-8 bg-white rounded-2xl">
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                        Your email
                    </label>
                    <input type="email" name="email"
                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm
                       rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                           placeholder="your@email.com" required>
                    </input>
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                        Your password
                    </label>
                    <input type="password" name="password"
                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm
                       rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                           required>
                    </input>
                    {isWrongCredentials ? (
                        <p className="mt-2 text-sm text-red-600">
                            <span className="font-medium">Oops! </span>
                            Wrong password!
                        </p>
                    ) : null}
                </div>
                <button type="submit"
                        className="text-white text-md bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                        focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center w-1/2
                        ease-linear transition-all duration-150">
                    Sign In
                </button>
            </form>
            <a href="/registration">
                <button className="mt-4 text-blue-700 hover:text-white border-2 border-blue-700 bg-transparent
                hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300
                font-medium rounded-lg text-md px-5 py-2.5 text-center w-full
                ease-linear transition-all duration-150">
                    Do not have account? Sign Up
                </button>
            </a>
        </div>
    );
}
