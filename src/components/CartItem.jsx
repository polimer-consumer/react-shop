'use client'

import React, {useState} from "react";
import {AiFillDelete} from "react-icons/ai";
import {LuDelete} from "react-icons/lu";
import {MdOutlineDelete} from "react-icons/md";

export function CartItem({item, deleteItem, setLoading}) {
    const [quantity, setQuantity] = useState(item.quantity);

    const {image, genre, price, artist, album, itemId} = item;

    const changeQuantity = async (amount) => {
        if (!(amount === -1 && quantity <= 1)) {
            const reqBody = JSON.stringify({amount: amount});
            await fetch(`api/cart/${itemId}`,
                {method: "PATCH", body: reqBody})
                .then(async response => {
                    if (!response.ok) {
                        const error = response.status;
                        return Promise.reject(error);
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
            setQuantity((prevQuantity) => {
                return prevQuantity + amount;
            });
            // setLoading(true);
        }
    };

    function deleteFromCart() {
        deleteItem(itemId)
    }

    return (
        <li className="flex justify-between gap-x-6 py-5">
            <div className="basis-1/2 flex min-w-0 gap-x-4">
                <img className="h-24 w-24 flex-none rounded-md bg-gray-50" src={image} alt={album} />
                <div className="min-w-0 flex-auto">
                    <p className="ml-12 mt-2 break-words text-xl font-semibold leading-6 text-gray-900">{album}</p>
                    <p className="ml-12 mt-2 truncate text-lg leading-5 text-gray-700">{artist}</p>
                    <p className="ml-12 mt-2 truncate text-lg leading-5 text-gray-500">{genre}</p>
                </div>
            </div>
            <div className="basis-1/4">
                <div className="mt-6">
                    <button
                        className="text-white aspect-square bg-amber-700 hover:bg-amber-800 font-bold rounded-md text-md w-6"
                        onClick={() => changeQuantity(-1)}>
                        -
                    </button>
                    <span className="text-2xl">{` ${quantity} `}</span>
                    <button
                        className="text-white aspect-square bg-amber-700 hover:bg-amber-800 font-bold rounded-md text-md w-6"
                        onClick={() => changeQuantity(1)}>
                        +
                    </button>
                </div>
            </div>
            <div className="basis-1/4">
                <p className="mt-2 text-xl font-medium text-gray-900">{`€${price}`}</p>
                <button type="button" className="mt-2 rounded-md text-gray-700" id="add"
                        onClick={deleteFromCart}>
                    <MdOutlineDelete size={"2rem"} color={"#573d38"}/>
                </button>
            </div>
        </li>
    )

    /*return (
        <div className="group relative bg-amber-50 shadow-2xl p-2 rounded-lg">
            <div
                className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-95 lg:h-80">
                <img src={image}
                     alt={album}
                     className="h-full w-full object-cover object-center lg:h-full lg:w-full"/>
            </div>
            <div className="m-1">
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
            <div className="mt-4 grid justify-between">
                <p className="text-xl text-gray-700 truncate">{album}</p>
                <p className="mt-1 text-sm text-gray-500">{artist}</p>
            </div>
            <div className="mt-4 flex justify-between">
                <p className="text-xl font-medium text-gray-900">€{price}</p>
                <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" id="add"
                        onClick={deleteFromCart}>
                    <AiFillDelete size={"2rem"} color={"#573d38"}/>
                </button>
            </div>
        </div>
    );*/
}
