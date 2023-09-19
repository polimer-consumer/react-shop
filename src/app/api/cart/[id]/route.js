import {NextResponse} from "next/server";
import {connectMongoDB} from "@/database/connect";
import Cart from "@/models/cart";
import {getServerSession} from "next-auth";
import {authConfig} from "@/configs/auth";

export async function POST(req, {params}) {
    const productId = params.id;
    const session = await getServerSession(authConfig);
    const email = session?.user?.email;
    const {album, artist, genre, price, image, quantity} = await req.json();

    await connectMongoDB();

    await Cart.findOne({userEmail: email})
        .exec()
        .then((cart) => {
            if (!cart) {
                cart = new Cart({userEmail: email, cartItems: []});
            }

            const cartItemIndex = cart.cartItems.findIndex(
                (item) => item.productId === productId
            );

            if (cartItemIndex !== -1) {
                cart.cartItems[cartItemIndex].quantity += quantity;
            } else {
                const newItem = {
                    productId: productId,
                    album: album,
                    artist: artist,
                    genre: genre,
                    price: price,
                    image: image,
                    quantity: quantity
                };

                cart.cartItems.push(newItem);
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

export async function PATCH(req, {params}) {
    const session = await getServerSession(authConfig);
    const email = session?.user?.email;
    const id = params.id;
    const {amount} = await req.json();

    await connectMongoDB();

    await Cart.findOne({userEmail: email})
        .exec()
        .then((cart) => {
            const cartItemIndex = cart.cartItems.findIndex(
                (item) => item.productId === id
            );

            cart.cartItems[cartItemIndex].quantity += amount;

            return cart.save();
        })
        .catch((error) => {
            console.error('Error updating amount:', error);
        });

    return NextResponse.json({});
}

export async function DELETE(req, {params}) {
    const session = await getServerSession(authConfig);
    const email = session?.user?.email;
    const id = params.id;

    await connectMongoDB();

    await Cart.updateMany({userEmail: email}, {
        $pull: {
            cartItems: {productId: id}
        }
    })
        .exec()
        .catch((error) => {
            console.error(`Error deleting item with id: ${id}:`, error);
        });

    return NextResponse.json({});
}
