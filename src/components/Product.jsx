'use client'

import React, {useState} from 'react';
import {useSession} from "next-auth/react";
import {AiFillShopping} from "react-icons/ai";
import Link from "next/link";

export default function Product({item}) {
    const [quantity, setQuantity] = useState(1);

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
        const reqBody = JSON.stringify({
            album: album,
            artist: artist,
            genre: genre,
            price: price,
            image: image,
            quantity: quantity
        });
        console.log(reqBody);
        fetch(`api/cart/${productId}`, {method: "POST", body: reqBody})
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                console.log(`${quantity} items of product with id ${productId} added to cart`);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });

        setQuantity(1);
    };


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
