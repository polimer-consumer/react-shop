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
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shop now:</h2>
                <SearchBar onSearch={handleSearch}/>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
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
            </div>
        </>
    )
}