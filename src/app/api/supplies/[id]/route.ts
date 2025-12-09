import { NextResponse } from "next/server";
import SupplyModel from "@/models/Supply";
import { connectDB } from "@/lib/mongodb";
import { Supply, SupplyItem } from "@/types/Supply";

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  await connectDB();
  const data: Supply = await req.json();

  const grandTotal = data.items.reduce(
    (sum: number, item: SupplyItem) => sum + item.quantity * item.price,
    0
  );

  const updated = await SupplyModel.findByIdAndUpdate(
    params.id,
    { ...data, grandTotal },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Params) {
  await connectDB();
  await SupplyModel.findByIdAndDelete(params.id);

  return NextResponse.json({ success: true });
}
