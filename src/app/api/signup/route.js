import {connectMongoDB} from "@/database/connect";
import User from "@/models/user";
import {NextResponse} from "next/server";

export async function POST(req) {
    try {
        const {email, password, salt, firstName, lastName, phone} = await req.json();
        await connectMongoDB();

        const existingUser = await User.findOne({email})
            .exec()
            .catch(error => {
                console.error('Database error', error);
            });

        if (existingUser) {
            return NextResponse.json({error: 'Email already exists'}, {status: 409});
        }

        await User.create(
            {
                email,
                password,
                salt,
                firstName,
                lastName,
                phone
            }
        );

        return NextResponse.json({}, {status: 200});
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}