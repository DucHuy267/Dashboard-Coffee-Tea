import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { IProduct } from "@/types/Product";

// GET all products hoặc search
export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const regex = new RegExp(search, "i"); // search không phân biệt hoa thường

    const products = await Product.find({ name: regex }).populate("category");
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: "Cannot fetch products" }, { status: 500 });
  }
}

// POST create product
export async function POST(req: Request) {
  try {
    const data: IProduct = await req.json();
    if (!data.name || data.price == null) {
      return NextResponse.json({ error: "Name và price là bắt buộc" }, { status: 400 });
    }

    await connectDB();
    const newProduct = await Product.create(data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Cannot create product" }, { status: 500 });
  }
}

