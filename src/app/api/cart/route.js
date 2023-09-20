import {NextResponse} from "next/server";
import {connectMongoDB} from "@/database/connect";
import Cart from "@/models/cart";
import {getServerSession} from "next-auth";
import {authConfig} from "@/configs/auth";

export async function GET(req) {
    const session = await getServerSession(authConfig);
    const email = session?.user?.email;

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

export async function PATCH(req) {
    const session = await getServerSession(authConfig);
    const email = session?.user?.email;
    const {localCart} = await req.json();

    await connectMongoDB();

    await Cart.findOne({userEmail: email})
        .exec()
        .then((cart) => {
            if (!cart) {
                cart = new Cart({userEmail: email, cartItems: (localCart?.cartItems || [])});
            } else if (localCart?.cartItems !== undefined) {
                localCart.cartItems.map((localItem) => {
                    const cartItemIndex = cart.cartItems.findIndex(
                        (item) => item.productId === localItem.productId
                    );
                    if (cartItemIndex !== -1) {
                        cart.cartItems[cartItemIndex].quantity += localItem.quantity;
                    } else {
                        const newItem = {
                            productId: localItem.productId,
                            album: localItem.album,
                            artist: localItem.artist,
                            genre: localItem.genre,
                            price: localItem.price,
                            image: localItem.image,
                            quantity: localItem.quantity
                        };

                        cart.cartItems.push(newItem);
                    }
                })
            }

            return cart.save();
        })
        .then((updatedCart) => {
            console.log('Cart updated:', updatedCart);
        })
        .catch((error) => {
            console.error('Error updating cart:', error);
        });

    return NextResponse.json({});
}
