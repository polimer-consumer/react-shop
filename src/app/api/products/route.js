import {NextResponse} from "next/server";
import {connectMongoDB} from "@/database/connect";
import Product from "@/models/product";

export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const query = searchParams.get('q');

    await connectMongoDB();
    let products;

    if (query) {
        products = await Product.find({
            $or: [
                { album: { $regex: query, $options: 'i' } },
                { artist: { $regex: query, $options: 'i' } },
            ],
        });
    } else {
        products = await Product.find();
    }

    return NextResponse.json(products);
}

export async function POST(req) {
    const {body, album, artist, genre, price, image} = await req.json();
    console.log(body);

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
