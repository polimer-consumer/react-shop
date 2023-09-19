import CredentialsProvider from 'next-auth/providers/credentials'
import {connectMongoDB} from "@/database/connect";
import User from "@/models/user";
import crypto from "crypto";
import user from "@/models/user";

export const authConfig = {
    strategy: "jwt",
    session: {
        maxAge: 24 * 60 * 60, // 1 day
    },

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: 'email', type: 'email', placeholder: 'email'},
                password: {label: 'password', type: 'password'},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;

                await connectMongoDB();

                let currentUser;

                await User.findOne({email: credentials.email})
                    .exec()
                    .then(user => {
                        currentUser = user;
                    })
                    .catch(error => {
                        console.error('Database error:', error);
                    })

                if (currentUser) {
                    if (crypto.createHash("md5")
                        .update(currentUser.salt + credentials.password)
                        .digest("hex") === currentUser.password) {
                        const {password, salt, _id, ...userWithoutPassword} = currentUser._doc;

                        return userWithoutPassword;
                    }
                    throw new Error("Wrong password");
                }

                throw new Error("Wrong email");
            }
        })
    ],
    callbacks: {},
    pages: {
        signIn: '/login'
    },
    secret: process.env.NEXTAUTH_SECRET
}