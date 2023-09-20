'use client'

import React, {useState} from 'react';
import {useSession} from "next-auth/react";
import {AiFillShopping} from "react-icons/ai";
import Link from "next/link";

export default function Product({item}) {
    const [quantity, setQuantity] = useState(1);
    const session = useSession();

    const changeQuantity = (amount) => {
        setQuantity((prevQuantity) => {
            if (amount === -1 && prevQuantity <= 1) {
                return prevQuantity;
            }
            return prevQuantity + amount;
        });
    };

    const {image, genre, price, artist, album, productId} = item;

    const addToCart = async () => {
        if (session?.data?.user?.email !== undefined) {
            const reqBody = JSON.stringify({
                album: album,
                artist: artist,
                genre: genre,
                price: price,
                image: image,
                quantity: quantity,
                localCart: JSON.parse(localStorage.getItem("cart")),
            });

            fetch(`api/cart/${productId}`, {method: "POST", body: reqBody})
                .then(async response => {
                    const data = await response.json();

                    if (!response.ok) {
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });

            localStorage.removeItem("cart");
        } else {
            addToLocalStorage();
        }

        setQuantity(1);
    };

    const addToLocalStorage = () => {
        let cart = {};

        if (localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"));
            const cartItem = cart.cartItems.find((item) => item.productId === productId);
            if (cartItem) {
                cartItem.quantity += quantity;
            } else {
                cart.cartItems.push({
                    productId: productId,
                    album: album,
                    artist: artist,
                    genre: genre,
                    price: price,
                    image: image,
                    quantity: quantity,
                })
            }
        } else {
            cart = {
                cartItems: [
                    {
                        productId: productId,
                        album: album,
                        artist: artist,
                        genre: genre,
                        price: price,
                        image: image,
                        quantity: quantity,
                    }
                ]
            }
        }

        localStorage.setItem("cart", JSON.stringify(cart));
    }

    return (
        <div className="group relative bg-gray-50 shadow-2xl p-2 rounded-lg">
            <div
                className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-50 lg:aspect-none group-hover:opacity-95 lg:h-80">
                <img src={image}
                     alt={album}
                     className="h-full w-full object-cover object-center lg:h-full lg:w-full"/>
            </div>
            <div className="mt-4">
                <button
                    className="text-white bg-amber-900 hover:bg-amber-800 font-medium rounded-md text-md w-10"
                    onClick={() => changeQuantity(-1)}>
                    -
                </button>
                <span className="text-xl">{` ${quantity} `}</span>
                <button
                    className="text-white bg-amber-900 hover:bg-amber-800 font-medium rounded-md text-md w-10"
                    onClick={() => changeQuantity(1)}>
                    +
                </button>
            </div>
            <div className="mt-4 flex flex-row justify-between">
                <div className="flex-1">
                    <Link href={`/content/${productId}`}>
                        <p className="text-xl text-gray-700 hover:underline">{album}</p>
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">{artist}</p>
                </div>
                <div>
                    <p className="text-xl font-medium text-gray-900">€{price}</p>
                    <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" id="add"
                            onClick={addToCart}>
                        <AiFillShopping size={"2rem"} color={"#573d38"}/>
                    </button>
                </div>
            </div>
        </div>
    );
}
