import mongoose, {Schema} from "mongoose";
import {orderItemSchema} from "@/models/orderItem";

const orderSchema = new Schema(
    {
        userId: String,
        status: String,
        orderItems: [orderItemSchema]
    },
    {
        timestamps: true
    }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
