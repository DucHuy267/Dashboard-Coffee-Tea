import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { NextResponse } from 'next/server';

interface AdminRequestBody {
  username: string;
  password: string;
  masterPassword: string;
}

export async function POST(req: Request) {
  try {
    const body: AdminRequestBody = await req.json();

    const { username, password, masterPassword } = body;

    if (masterPassword !== process.env.CREATE_ADMIN_MASTER_PASS) {
      return NextResponse.json({ message: 'Mật khẩu bảo vệ không đúng' }, { status: 401 });
    }

    if (!username || !password) {
      return NextResponse.json({ message: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ message: 'Server chưa được cấu hình MongoDB' }, { status: 500 });
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: 'Admin đã tồn tại' }, { status: 400 });
    }

    const admin = new User({ username, password }); // để pre-save tự hash

    await admin.save();
    
    console.log("🔐 RAW PASSWORD:", password);

    return NextResponse.json({ message: 'Admin tạo thành công!' });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ message: 'Đã xảy ra lỗi server' }, { status: 500 });
  }
  
}


