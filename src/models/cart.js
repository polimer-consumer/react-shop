import mongoose, {Schema} from "mongoose";
import {cartItemSchema} from "@/models/cartItem";

const cartSchema = new Schema(
    {
        userEmail: String,
        cartItems: [cartItemSchema]
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
