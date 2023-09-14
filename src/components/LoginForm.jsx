'use client'

import React from "react";
import styles from '../styles/forms.module.css';
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";

export function LoginForm() {
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
        }

        console.log(res);
    }

    return (
        <div className={styles.container}>
            <h1>Authorization</h1>
            <form onSubmit={handleSubmit}>
                <input className={styles.input} type="text" name="email" placeholder="email" required/>
                <input className={styles.input} type="password" name="password" placeholder="Password" required/>
                <button className={styles.button} type="submit">Submit</button>
            </form>
            <a href="/registration">
                <button className={styles.button}>
                    <strong>Sign Up</strong>
                </button>
            </a>
        </div>
    );
}
