import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { ICategory } from "@/types/Category";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;          // ⭐ UNWRAP PARAMS
  await connectDB();

  const cat = await Category.findById(id);
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(cat);
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;        // ⭐ UNWRAP PARAMS
    const data: ICategory = await req.json();

    await connectDB();

    if (!data.idCate || !data.name) {
      return NextResponse.json({ error: "idCate và name là bắt buộc" }, { status: 400 });
    }

    // ⭐ Fix lỗi "idCate đã tồn tại" khi chỉ sửa tên
    const exist = await Category.findOne({
      idCate: data.idCate,
      _id: { $ne: id },
    });

    if (exist) {
      return NextResponse.json({ error: "idCate đã tồn tại" }, { status: 400 });
    }

    const updated = await Category.findByIdAndUpdate(id, data, { new: true });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Cannot update category" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;        // ⭐ UNWRAP PARAMS
    await connectDB();
    await Category.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
