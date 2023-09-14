import mongoose, {Schema} from "mongoose";

export const cartItemSchema = new Schema(
    {
        productId: String,
        album: String,
        artist: String,
        genre: String,
        image: String,
        price: Number,
        quantity: Number
    },
    {
        timestamps: true
    }
);

const CartItem = mongoose.models.CartItem || mongoose.model("CartItem", cartItemSchema);

export default CartItem;
