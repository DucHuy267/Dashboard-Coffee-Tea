import { IProduct } from "./Product";

export interface IOrderItem {
  productId: string | IProduct; // Có thể là ID hoặc object khi populate
  quantity: number;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "completed" | "cancelled";

export interface IOrder {
  _id?: string; // _id optional, backend sẽ tự tạo
  customerName: string;
  items: IOrderItem[];
  total: number;
  profit?: number; // Thêm trường tiền lời
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
