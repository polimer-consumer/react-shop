'use client'

import styles from "../styles/header.module.css"
import React from "react";
import Link from "next/link"
import {useSession, signOut} from "next-auth/react";

export function Header() {
    const session = useSession();

    return (
        <header className={styles.navbar}>
            <Link href={"/cart"}>Cart</Link>
            <Link href={"/registration"}>Sign Up</Link>
            <Link href={"/content"}>Shop</Link>
            {session?.data && (
                <Link href={"/profile"}>Profile</Link>
            )}
            {session?.data ? <Link href="#" onClick={() => signOut()}>Log Out</Link> :
                <Link href={"/login"}>Log In</Link>}
        </header>
    )
}