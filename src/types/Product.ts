import { ICategory } from "./Category";

export interface IProduct {
  _id?: string;
  name: string;
  price: number;         // Giá hiện tại
  originalPrice: number; // Giá gốc
  category?: ICategory; // 🔹 Thay vì string/any, dùng type ICategory
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}
