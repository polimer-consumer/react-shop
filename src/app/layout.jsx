import './globals.css'
import {Inter} from 'next/font/google'
import {Header} from "@/components/Header";
import SessionProvider from "@/components/SessionProvider";
import {getServerSession} from "next-auth";

const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'Vinyl-24 Shop',
    description: 'E-commerce Pet-project',
}

export default async function RootLayout({children}) {
    const session = await getServerSession();

    return (
        <html lang="en">
        <body className={inter.className}>
        <SessionProvider
            session={session}
            // Re-fetch session every 5 minutes
            refetchInterval={20 * 60}
            // Re-fetches session when window is focused
            refetchOnWindowFocus={true}
        >
            <Header/>
            {children}
        </SessionProvider>
        </body>
        </html>
    )
}
