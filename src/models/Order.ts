import { Schema, models, model } from "mongoose";
import { IOrder } from "@/types/Order";

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>("Order", OrderSchema);
