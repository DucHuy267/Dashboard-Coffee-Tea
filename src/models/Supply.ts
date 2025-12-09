import mongoose, { Schema, Model, Document } from "mongoose";
import { SupplyItem } from "@/types/Supply";

export interface SupplyDocument extends Document {
  items: SupplyItem[];
  grandTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const SupplySchema = new Schema<SupplyDocument>(
  {
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
      }
    ],
    grandTotal: { type: Number, required: true },
  },
  { timestamps: true }
);

const SupplyModel: Model<SupplyDocument> =
  mongoose.models.Supply || mongoose.model<SupplyDocument>("Supply", SupplySchema);

export default SupplyModel;
