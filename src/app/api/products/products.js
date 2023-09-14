import img from '../../../../public/img.png';

export let products = [
    {
        id: 1,
        image: img,
        genre: 'Metal',
        price: Math.floor(Math.random() * 100),
        album: 'Metallica',
        artist: 'Metallica'
    },
    {
        id: 2,
        image: 'next.svg',
        genre: 'Metal',
        price: Math.floor(Math.random() * 100),
        album: 'Metallica',
        artist: 'Metallica'
    },
    {
        id: 3,
        image: img,
        genre: 'Metal',
        price: Math.floor(Math.random() * 100),
        album: 'Metallica',
        artist: 'Metallica'
    },
    {
        id: 4,
        image: img,
        genre: 'Metal',
        price: Math.floor(Math.random() * 100),
        album: 'Metallica',
        artist: 'Metallica'
    },
    {
        id: 5,
        image: 'next.svg',
        genre: 'Metal',
        price: Math.floor(Math.random() * 100),
        album: 'Metallica',
        artist: 'Metallica'
    },
    {
        id: 6,
        image: 'next.svg',
        genre: 'Metal',
        price: Math.floor(Math.random() * 100),
        album: 'Metallica',
        artist: 'Metallica'
    },
]

export const deleteProduct = (id) => {
    products = products.filter((product) => product.id != id)
}