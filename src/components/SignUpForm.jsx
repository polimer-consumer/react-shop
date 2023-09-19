'use client'

import React, {useState} from 'react';
import * as crypto from 'crypto';
import {useRouter} from "next/navigation";

export default function SignUpForm() {
    const [isWrongPassword, setWrongPassword] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setWrongPassword(false);
        const data = new FormData(event.currentTarget);

        if (data.get("password") !== data.get("repeat-password")) {
            setWrongPassword(true);
        } else {
            const salt = crypto.randomBytes(6).toString('hex');
            let password = crypto.createHash("md5")
                .update(salt + data.get("password"))
                .digest("hex");

            await fetch('/api/signup', {
                method: "POST", body: JSON.stringify({
                    email: data.get("email"),
                    firstName: data.get("first-name"),
                    lastName: data.get("last-name"),
                    phone: data.get("phone"),
                    password: password,
                    salt: salt
                })
            })
                .then(async response => {
                    const data = await response.json();

                    if (!response.ok) {
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }

                    router.push("/login");
                    console.log('User added');
                })
                .catch(error => {
                    if (error === 409) {
                        setEmailExists(true);
                    } else {
                        console.error('There was an error!', error);
                    }
                });
        }
    };

    return (
        <form className="mx-auto my-16 max-w-xl px-4 py-8 lg:max-w-xl lg:px-8 bg-white rounded-2xl"
              onSubmit={handleSubmit}>
            <div className="mb-6">
                <label htmlFor="first-name" className="block mb-2 text-sm font-medium text-gray-900">
                    Your first name
                </label>
                <input type="first-name" name="first-name"
                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm
                       rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                       placeholder="First name"
                       autoComplete="given-name"
                       required>
                </input>
            </div>
            <div className="mb-6">
                <label htmlFor="last-name" className="block mb-2 text-sm font-medium text-gray-900">
                    Your last name
                </label>
                <input type="last-name" name="last-name"
                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm
                       rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                       autoComplete="family-name"
                       placeholder="Last name">
                </input>
            </div>
            <div className="mb-6">
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">
                    Your phone number
                </label>
                <input type="tel" name="phone"
                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm
                       rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                       autoComplete="tel-country-code"
                       placeholder="Phone number">
                </input>
            </div>
            <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                    Your email
                </label>
                <input type="email" name="email"
                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm
                       rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                       autoComplete="email"
                       placeholder="your@email.com" required>
                </input>
                {emailExists ? (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">Oops! </span>
                        User with this email already exists!
                    </p>
                ) : null}
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
            </div>
            <div className="mb-6">
                <label htmlFor="repeat-password"
                       className="block mb-2 text-sm font-medium text-gray-900">
                    Repeat password
                </label>
                <input type="password" name="repeat-password"
                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm
                       rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                       required>
                </input>
                {isWrongPassword ? (
                    <p className="mt-2 text-sm text-red-600">
                        <span className="font-medium">Oops! </span>
                        Passwords do not match!
                    </p>
                ) : null}
            </div>
            <div className="flex items-start mb-6">
                <div className="flex items-center h-5">
                    <input name="terms" type="checkbox" value=""
                           className="w-4 h-4 border border-gray-300 rounded
                           bg-gray-50 focus:ring-3 focus:ring-blue-300"
                           required>
                    </input>
                </div>
                <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-900">
                    I agree with the <a href="#" className="text-blue-600 hover:underline">
                    terms and conditions</a>
                </label>
            </div>
            <button type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                    focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 text-center w-1/2
                    ease-linear transition-all duration-150">
                Register new account
            </button>
        </form>
    );
}
