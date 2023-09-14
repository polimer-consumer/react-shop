import mongoose, {Schema} from "mongoose";

export const orderItemSchema = new Schema(
    {
        price: Number,
        quantity: Number,
        productId: String
    },
    {
        timestamps: true
    }
);

const OrderItem = mongoose.models.OrderItem || mongoose.model("OrderItem", orderItemSchema);

export default OrderItem;
