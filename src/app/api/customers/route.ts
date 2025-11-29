import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { ICustomer } from "@/types/Customer";

// GET all customers hoặc search
export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const regex = new RegExp(search, "i"); // search không phân biệt hoa thường

    const customers = await Customer.find({ name: regex }).sort({ createdAt: -1 });
    return NextResponse.json(customers);
  } catch (err) {
    return NextResponse.json({ error: "Cannot fetch customers" }, { status: 500 });
  }
}

// POST create customer
export async function POST(req: Request) {
  try {
    const data: ICustomer = await req.json();
    if (!data.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    await connectDB();
    const newCustomer = await Customer.create(data);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Cannot create customer" }, { status: 500 });
  }
}
