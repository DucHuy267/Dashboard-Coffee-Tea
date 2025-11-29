import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { IOrder } from "@/types/Order";
import { IOrderItem } from "@/types/Order";
import { IProduct } from "@/types/Product";


// --------------------------
// GET All Orders (with profit + deep populate)
// --------------------------
export async function GET() {
try {
await connectDB();
const orders = await Order.find()
.sort({ createdAt: -1 })
.populate({
path: "items.productId",
populate: { path: "category", model: "Category" },
});


const populatedOrders = orders.map((order) => {
const profit = order.items.reduce((acc: number, item: IOrderItem) => {
  // Nếu chưa populate → productId là string → bỏ qua
  if (typeof item.productId === "string") return acc;

  // Khi populate → productId là IProduct
  const product = item.productId as IProduct;

  const productProfit =
    (product.price - product.originalPrice) * item.quantity;

  return acc + productProfit;
}, 0);

return {
...order.toObject(),
profit,
};
});

return NextResponse.json(populatedOrders);
} catch (err) {
console.error(err);
return NextResponse.json({ error: "Không thể lấy đơn hàng" }, { status: 500 });
}
}


// --------------------------
// PUT Update Order
// --------------------------
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
try {
const { id } = await context.params;
const data: IOrder = await req.json();

await connectDB();

if (!data.customerName || !data.items?.length || data.total == null) {
return NextResponse.json({ error: "Thiếu thông tin đơn hàng" }, { status: 400 });
}

const updated = await Order.findByIdAndUpdate(id, data, { new: true });
return NextResponse.json(updated);
} catch (err) {
console.error(err);
return NextResponse.json({ error: "Không thể cập nhật đơn hàng" }, { status: 500 });
}
}

// --------------------------
// DELETE Remove Order
// --------------------------
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
try {
const { id } = await context.params;


await connectDB();
await Order.findByIdAndDelete(id);


return NextResponse.json({ message: "Đã xóa đơn hàng" });
} catch (err) {
console.error(err);
return NextResponse.json({ error: "Xóa thất bại" }, { status: 500 });
}
}