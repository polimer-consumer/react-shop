'use client'

import React, {useEffect, useState} from "react";
import Product from "@/components/Product";
import styles from '../styles/products.module.css'
import SearchBar from "@/components/SearchBar";

export default function ProductsList() {
    const [products, setProducts] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch(`/api/products?q=${searchQuery}`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data)
                setLoading(false)
            })
    }, [searchQuery])

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <>
            <SearchBar onSearch={handleSearch}/>
            <div className={styles.content}>
                {products.map((product) => {
                        return (
                            <Product key={product._id} item={{
                                productId: product._id,
                                image: product.image,
                                genre: product.genre,
                                price: product.price,
                                album: product.album,
                                artist: product.artist
                            }}/>
                        )
                    }
                )}
            </div>
        </>
    )
}