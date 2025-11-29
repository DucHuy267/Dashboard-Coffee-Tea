import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { ICategory } from "@/types/Category";

// GET /api/categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Cannot fetch categories" }, { status: 500 });
  }
}

// POST /api/categories
export async function POST(req: Request) {
  try {
    const data: ICategory = await req.json();
    await connectDB();

    if (!data.idCate || !data.name) {
      return NextResponse.json({ error: "idCate và name là bắt buộc" }, { status: 400 });
    }

    const exist = await Category.findOne({ idCate: data.idCate });
    if (exist) return NextResponse.json({ error: "idCate đã tồn tại" }, { status: 400 });

    const newCategory = await Category.create(data);
    return NextResponse.json(newCategory);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Cannot create category" }, { status: 500 });
  }
}
