'use client'

import styles from "@/styles/card.module.css";
import Image from "next/image";
import {useState} from "react";

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
        <div className={styles.card}>
            <Image className={styles.cardImgTop} src={image} height='150' width='150' alt="Card image cap"/>
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
            <button type="button" className={styles.btnSuccess} style={{width: '100%'}} id="Delete"
                    onClick={deleteFromCart}>
                Delete from cart
            </button>
        </div>
    );
}
