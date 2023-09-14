import mongoose, {Schema} from "mongoose";

const productSchema = new Schema(
    {
        album: String,
        artist: String,
        genre: String,
        image: String,
        price: Number
    },
    {
        timestamps: true
    }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
