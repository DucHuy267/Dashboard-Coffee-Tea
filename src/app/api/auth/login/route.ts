import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    console.log("📥 Login request:", { username, password });

    await connectDB();

    const user = await User.findOne({ username });

    console.log("🔍 User found:", user);

    if (!user)
      return NextResponse.json({ message: 'Tài khoản không tồn tại' }, { status: 400 });

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("🔑 Password match:", isMatch);

    if (!isMatch)
      return NextResponse.json({ message: 'Sai mật khẩu' }, { status: 400 });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      message: 'Đăng nhập thành công',
      token,
      username: user.username,
    });

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}
