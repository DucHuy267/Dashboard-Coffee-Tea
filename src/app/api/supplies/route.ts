import { NextResponse } from "next/server";
import Supply from "@/models/Supply";
import { connectDB } from "@/lib/mongodb";

// GET all supplies
export async function GET() {
  await connectDB();
  const supplies = await Supply.find().sort({ createdAt: -1 });
  return NextResponse.json(supplies);
}

// CREATE supply
export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const created = await Supply.create(data);
  return NextResponse.json(created);
}
