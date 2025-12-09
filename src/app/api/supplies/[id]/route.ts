import { NextResponse } from "next/server";
import SupplyModel from "@/models/Supply";
import { connectDB } from "@/lib/mongodb";
import { Supply } from "@/types/Supply";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }  // <-- inline type
) {
  await connectDB();
  const data: Supply = await req.json();

  const grandTotal = data.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const updated = await SupplyModel.findByIdAndUpdate(
    params.id,
    { ...data, grandTotal },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }  // <-- inline type
) {
  await connectDB();
  await SupplyModel.findByIdAndDelete(params.id);

  return NextResponse.json({ success: true });
}
