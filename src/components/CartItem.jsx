'use client'

import React, {useState} from "react";
import {AiFillDelete} from "react-icons/ai";

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

                    console.log(`Quantity of item ${itemId} changed`);
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
        console.log(`Deleted ${itemId} from cart`)
    }

    return (
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
    );
}
