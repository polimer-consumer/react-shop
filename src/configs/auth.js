import CredentialsProvider from 'next-auth/providers/credentials'
import {users} from '@/data/users';

export const authConfig = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: 'email', type: 'email', placeholder: 'email'},
                password: {label: 'password', type: 'password'},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;

                console.log(credentials);

                const currentUser = users.find(user => user.email === credentials.email)

                if (currentUser && currentUser.password === credentials.password) {
                    const {password, ...userWithoutPassword} = currentUser;

                    return userWithoutPassword;
                }

                return null
            }
        })
    ],
    pages: {
        signIn: '/login'
    },
    secret: process.env.NEXTAUTH_SECRET
}