import { NextResponse } from "next/server";
import SupplyModel from "@/models/Supply";
import { connectDB } from "@/lib/mongodb";
import { Supply } from "@/types/Supply";

// PUT /api/supplies/[id]
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data: Supply = await req.json();
    await connectDB();

    const grandTotal = data.items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    );

    const updated = await SupplyModel.findByIdAndUpdate(
      id,
      { ...data, grandTotal },
      { new: true }
    );

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Cannot update supply" }, { status: 500 });
  }
}

// DELETE /api/supplies/[id]
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();

    const deleted = await SupplyModel.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Cannot delete supply" }, { status: 500 });
  }
}

// GET /api/supplies/[id]
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();

  const supply = await SupplyModel.findById(id);
  if (!supply) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(supply);
}
