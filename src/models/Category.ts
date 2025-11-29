import mongoose, { Schema } from "mongoose";
import { ICategory } from "@/types/Category";

const CategorySchema = new Schema<ICategory>(
  {
    idCate: { type: String, required: true, unique: true }, // ⚡ bắt buộc và duy nhất
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const Category =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
