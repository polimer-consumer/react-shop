'use client'

import React, {useState} from 'react';
import Image from "next/image";
import styles from '../styles/card.module.css'
import {useSession} from "next-auth/react";

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
        const reqBody = JSON.stringify({
            userName: session?.data?.user?.name,
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
        <div className={styles.card}>
            <Image className={styles.cardImgTop} src={image} height='300' width='300' alt="Card image cap"/>
            <div className={styles.cardBody}>
                <h5 className={styles.cardTitle}><strong>{album}</strong></h5>
                <p className={styles.cardText}><strong>{artist}</strong></p>
                <p className={styles.cardText}>{genre}</p>
                <div className={styles.quantitySelector}>
                    <button className={styles.btnPrimary} onClick={() => changeQuantity(-1)}>-</button>
                    <span>{quantity}</span>
                    <button className={styles.btnPrimary} onClick={() => changeQuantity(1)}>+</button>
                </div>
            </div>
            <div className={styles.cardFooter}>
                <p className={styles.cardText}>{price} €</p>
            </div>
            <button type="button" className={styles.btnSuccess} style={{width: '100%'}} id="add"
                    onClick={addToCart}>
                Add to Cart
            </button>
        </div>
    );
}
