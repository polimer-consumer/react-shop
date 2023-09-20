'use client'

import {useSession} from "next-auth/react";
import React, {useEffect, useState} from "react";

export function ProductPage({id}) {
    const [product, setProduct] = useState(null);
    const [showInfo, setShowInfo] = useState(false);
    const [showContacts, setShowContacts] = useState(false);
    const [isLoading, setLoading] = useState(true)
    const session = useSession();

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
            })
    }, [])

    const addToCart = async () => {
        if (session?.data?.user?.email !== undefined) {
            const {image, genre, price, artist, album, _id} = product;
            fetch(`/api/cart/${_id}`, {
                method: "POST", body: JSON.stringify({
                    album: album,
                    artist: artist,
                    genre: genre,
                    price: price,
                    image: image,
                    quantity: 1,
                    localCart: JSON.parse(localStorage.getItem("cart")),
                })
            })
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
    };

    const addToLocalStorage = () => {
        const {image, genre, price, artist, album, _id} = product;
        let cart = {};

        if (localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"));
            const cartItem = cart.cartItems.find((item) => item.productId === _id);
            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.cartItems.push({
                    productId: _id,
                    album: album,
                    artist: artist,
                    genre: genre,
                    price: price,
                    image: image,
                    quantity: 1,
                })
            }
        } else {
            cart = {
                cartItems: [
                    {
                        productId: _id,
                        album: album,
                        artist: artist,
                        genre: genre,
                        price: price,
                        image: image,
                        quantity: 1,
                    }
                ]
            }
        }

        localStorage.setItem("cart", JSON.stringify(cart));
    }

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 grid grid-cols-2">
            <div className="col-span-2 lg:col-span-1 lg:ml-8 md:ml-6 md:mt-0 mt-6">
                <img className="w-full lg:w-4/5 rounded-md" alt={product?.album}
                     src={product?.image}/>
            </div>
            <div className="col-span-2 lg:col-span-1 lg:ml-8 md:ml-6 mt-6">
                <div className="border-b border-gray-200 pb-6">
                    <h1
                        className="
							lg:text-2xl
							text-xl
							font-semibold
							lg:leading-6
							leading-7
							text-gray-800
							mt-2
						"
                    >
                        {product?.album}
                    </h1>
                </div>
                <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                    <p className="text-lg leading-none text-gray-600">{product?.artist}</p>
                </div>
                <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                    <p className="text-2xl leading-none text-gray-800">€{product?.price}</p>
                </div>
                <button
                    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800
						text-base text-white bg-amber-800 w-full py-3 hover:bg-amber-700 rounded-md"
                    onClick={addToCart}>
                    Add to cart
                </button>

                <div>
                    <p className="xl:pr-48 text-base lg:leading-tight leading-normal text-gray-600 mt-7">It is a long
                        established fact that a reader will be distracted by the readable content of a page when looking
                        at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution
                        of letters.</p>
                </div>
            </div>
            <div className="col-span-2 lg:col-span-1 lg:ml-8 md:ml-6 mt-2">
                <div>
                    <p className="text-base leading-4 mt-4 text-gray-600">Year:</p>
                    <p className="text-base leading-4 mt-4 text-gray-600">Genre: {product?.genre}</p>
                    <p className="text-base leading-4 mt-4 text-gray-600">Label:</p>
                    <p className="md:w-96 text-base leading-normal text-gray-600 mt-4">Extra: </p>
                </div>
                <div>
                    <div className="border-t border-b py-4 mt-7 border-gray-200">
                        <div onClick={() => setShowInfo(!showInfo)}
                             className="flex justify-between items-center cursor-pointer">
                            <p className="text-base leading-4 text-gray-800">Shipping and returns</p>
                            <button
                                className="
									cursor-pointer
									focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
									rounded
								"
                                aria-label="show or hide"
                            >
                                <svg className={"transform " + (showInfo ? "rotate-180" : "rotate-0")} width="10"
                                     height="6"
                                     viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 1L5 5L1 1" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <div
                            className={"pt-4 text-base leading-normal pr-12 mt-4 text-gray-600 " + (showInfo ? "block" : "hidden")}
                            id="sect">
                            You will be responsible for paying for your own shipping costs for returning your item.
                            Shipping costs are nonrefundable
                        </div>
                    </div>
                </div>
                <div>
                    <div className="border-b py-4 border-gray-200">
                        <div onClick={() => setShowContacts(!showContacts)}
                             className="flex justify-between items-center cursor-pointer">
                            <p className="text-base leading-4 text-gray-800">Contact us</p>
                            <button
                                className="
									cursor-pointer
									focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
									rounded
								"
                                aria-label="show or hide"
                            >
                                <svg className={"transform " + (showContacts ? "rotate-180" : "rotate-0")} width="10"
                                     height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 1L5 5L1 1" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <div
                            className={"pt-4 text-base leading-normal pr-12 mt-4 text-gray-600 " + (showContacts ? "block" : "hidden")}
                            id="sect">
                            If you have any questions on how to return your item to us, contact us.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}