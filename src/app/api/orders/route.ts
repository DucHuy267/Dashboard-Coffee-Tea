 import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { IOrder, IOrderItem } from "@/types/Order";
import { IProduct } from "@/types/Product";

export async function POST(req: Request) {
  try {
    const data: IOrder = await req.json();
    await connectDB();

    if (!data.customerName || !data.items?.length || data.total == null) {
      return NextResponse.json({ error: "Thiếu thông tin đơn hàng" }, { status: 400 });
    }

    const newOrder = await Order.create(data);
    return NextResponse.json(newOrder);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Không thể tạo đơn hàng" }, { status: 500 });
  }
}

// GET tất cả đơn hàng
export async function GET(req: Request) {
  try {
    await connectDB();

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "items.productId",
        model: "Product",
        select: "name price originalPrice image category",
        populate: {
          path: "category",
          model: "Category",
          select: "name",
        },
      });

    // Tính profit cho từng đơn
    const populatedOrders = orders.map((order) => {
      const obj = order.toObject();

      const profit = obj.items.reduce(
        (sum: number, item: IOrderItem) => {
          if (typeof item.productId === "object" && item.productId) {
            const product = item.productId as IProduct;
            return sum + (product.price - product.originalPrice) * item.quantity;
          }
          return sum;
        },
        0
      );

      return {
        ...obj,
        profit,
      };
    });

    return NextResponse.json(populatedOrders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    return NextResponse.json({ error: "Không thể lấy đơn hàng" }, { status: 500 });
  }
}