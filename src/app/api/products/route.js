import {NextResponse} from "next/server";
import {connectMongoDB} from "@/database/connect";
import Product from "@/models/product";

export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const genres = searchParams.get('genre');

    await connectMongoDB();

    let products;

    if (genres) {
        const genresArray = genres.slice(0, -1).split(';');
        products = await Product.find({
            genre: { $in: genresArray.map(genre => new RegExp(genre, "i")) }
        });
    } else {
        products = await Product.find();
    }

    return NextResponse.json(products);
}

export async function POST(req) {
    const {body, album, artist, genre, price, image} = await req.json();

    await connectMongoDB();

    await Product.create(
        {
            album: album,
            artist: artist,
            genre: genre,
            price: price,
            image: image
        }
    );

    return NextResponse.json({body});
}
