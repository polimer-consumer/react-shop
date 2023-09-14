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
                dispatch({ type: 'set', payload: data });
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
        <>
            <div className={styles.content}>
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
            </div>
            <h1>{`Total price: ${total}`}</h1>
        </>
    )
}
