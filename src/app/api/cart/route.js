import {NextResponse} from "next/server";
import {connectMongoDB} from "@/database/connect";
import Cart from "@/models/cart";
import {getServerSession} from "next-auth";
import {authConfig} from "@/configs/auth";

export async function GET(req) {
    const session = await getServerSession(authConfig);
    const email = session?.user?.email;

    // TODO: Add cart fetching from localstorage

    if (!email) {
        return NextResponse.json([]);
    }

    await connectMongoDB();

    try {
        let cart = await Cart.findOne({ userEmail: email }).exec();
        if (!cart) {
            cart = new Cart({ email, cartItems: [] });
            await cart.save();
        }

        const cartItems = cart.cartItems;

        return NextResponse.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);

        return NextResponse.json({ error: 'Internal Server Error'}, { status: 500 });
    }
}