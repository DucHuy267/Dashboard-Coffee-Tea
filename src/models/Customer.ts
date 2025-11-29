import mongoose, { Schema, model, models } from "mongoose";
import { ICustomer } from "@/types/Customer";

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export const Customer = models.Customer || model<ICustomer>("Customer", CustomerSchema);
