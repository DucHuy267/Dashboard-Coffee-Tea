import mongoose, { Schema, models, model } from "mongoose";
import { IProduct } from "@/types/Product";

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    image: String,
  },
  { timestamps: true }
);

export default models.Product || model<IProduct>("Product", ProductSchema);
