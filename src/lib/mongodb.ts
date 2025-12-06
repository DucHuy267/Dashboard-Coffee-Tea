// lib/mongodb.ts
import mongoose, { Mongoose } from "mongoose";
import "@/models"; // Đảm bảo tất cả các model được đăng ký

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI in .env.local");
}

// Khai báo interface cho cache connection
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Sử dụng globalThis để lưu cache giữa các lần hot reload (Next.js dev mode)
declare global {
  // Thêm property mongoose vào globalThis
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis._mongooseCache || { conn: null, promise: null };

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => {
      console.log("✅ MongoDB connected!");
      return m;
    });
  }

  cached.conn = await cached.promise;
  globalThis._mongooseCache = cached;

  return cached.conn;
}
