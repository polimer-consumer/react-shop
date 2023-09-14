import {NextResponse} from "next/server";
import {connectMongoDB} from "@/database/connect";
import Cart from "@/models/cart";
import {getServerSession} from "next-auth";
import {authConfig} from "@/configs/auth";

export async function POST(req, {params}) {
    const productId = params.id;
    const {userName, album, artist, genre, price, image, quantity} = await req.json();

    await connectMongoDB();

    await Cart.findOne({userName: userName})
        .exec()
        .then((cart) => {
            if (!cart) {
                cart = new Cart({userName: userName, cartItems: []});
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
    const userName = session?.user?.name;
    const id = params.id;
    const {amount} = await req.json();

    console.log(`Updated quantity of id: ${id}`);

    await connectMongoDB();

    await Cart.findOne({userName: userName})
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
    const id = params.id;

    // await connectMongoDB();

    return NextResponse.json({id, text: `Deleted product with id: ${id}`});
}