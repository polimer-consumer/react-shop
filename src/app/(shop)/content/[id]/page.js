import {ProductPage} from "@/components/ProductPage";

export default function Page({params}) {
    return (
        <ProductPage id={params.id}/>
    )
}