import {NextResponse} from "next/server";
import {headers, cookies} from "next/headers";
import {redirect} from "next/navigation";

export async function DELETE(req, {params}) {
    const id = params.id;

    const headerList = headers();
    const type = headerList.get('Content-Type');

    const cookiesList = cookies();
    const coo2 = cookiesList.get('Cookie_1').value;

    // redirect('/content');
    return NextResponse.json({id, type, coo2});
}