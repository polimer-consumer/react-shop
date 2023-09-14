"use client"

import {useSession} from "next-auth/react";

export function Profile() {
    const session = useSession();
    return (
        <div>
            <h1>Username: {session?.data?.user?.name}</h1>
        </div>
    )
}