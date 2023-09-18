import {connectMongoDB} from "@/database/connect";
import User from "@/models/user";
import {error} from "next/dist/build/output/log";
import {NextResponse} from "next/server";

export async function POST(req) {
    const {email, password, salt, firstName, lastName, phone} = await req.json();

    await connectMongoDB();

    await User.create(
        {
            email: email,
            password: password,
            salt: salt,
            firstName: firstName,
            lastName: lastName,
            phone: phone
        })
        .catch(err => {
            console.error(err);
            return NextResponse.json({ error: 'Internal Server Error'}, { status: 500 });
        });
    return NextResponse.json({});
}