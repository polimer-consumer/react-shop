'use client'

import {useEffect, useReducer, useState} from "react";
import {CartItem} from "@/components/CartItem";
import styles from '../styles/products.module.css'
import {useSession} from "next-auth/react";

const initialState = {
    products: null,
    total: 0
};

function reducer(state, action) {
    switch (action.type) {
        case 'set':
            return {
                ...state,
                products: action.payload,
                total: action.payload.reduce((acc, product) => acc + product.price * product.quantity, 0),
            };
        default:
            return state;
    }
}

export function Cart() {
    const [state, dispatch] = useReducer(reducer, initialState,
        () => initialState);
    const {products, total} = state;
    const [isLoading, setLoading] = useState(true);
    const session = useSession();


    useEffect(() => {
        fetch('api/cart')
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                dispatch({type: 'set', payload: data});
                setLoading(false)
            })
    }, [isLoading])

    function handleDelete(id) {
        fetch(`api/cart/${id}`, {method: 'DELETE'})
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                setLoading(true);
            })
            .catch(error => {
                console.error('There was an error!', error);
            })
    }

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className="ml-4 lg:ml-12 mt-4 lg:mt-12 max-w-2xl px-4 py-6
        sm:px-4 sm:py-4 lg:max-w-4xl lg:px-6 bg-gray-50 rounded-md shadow-2xl">
            <ul role="list" className="divide-dashed divide-y-4 divide-gray-300">
                {products.map((product) => {
                        return (
                            <CartItem key={product.productId} item={{
                                itemId: product.productId,
                                image: product.image,
                                genre: product.genre,
                                price: product.price,
                                album: product.album,
                                artist: product.artist,
                                quantity: product.quantity
                            }} deleteItem={handleDelete} setLoading={setLoading}/>
                        )
                    }
                )}
                <li><h1>{`Total price: ${total}`}</h1></li>
            </ul>
        </div>
    )
}
