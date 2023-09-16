import {NextResponse} from "next/server";
import {headers, cookies} from "next/headers";
import {connectMongoDB} from "@/database/connect";
import Product from "@/models/product";

export async function GET(req, {params}) {
    const productId = params.id;

    await connectMongoDB();

    const product = await Product.findOne({_id: productId});

    return NextResponse.json(product);
}

export async function DELETE(req, {params}) {
    const id = params.id;

    const headerList = headers();
    const type = headerList.get('Content-Type');

    const cookiesList = cookies();
    const coo2 = cookiesList.get('Cookie_1').value;

    // redirect('/content');
    return NextResponse.json({id, type, coo2});
}