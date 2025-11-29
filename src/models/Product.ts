import mongoose, { Schema } from "mongoose";
import { IProduct } from "@/types/Product";

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true }, // Giá hiện tại (giảm giá)
    originalPrice: { type: Number, required: true }, // Giá gốc
    category: { type: Schema.Types.ObjectId, ref: "Category" },  // 🔥 liên kết danh mục
    image: String,
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
