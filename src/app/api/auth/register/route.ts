import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from "@/lib/mongodb";
import User from '../../../../models/User';

type Data = { message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  await connectDB();
  const { username, password, secret } = req.body;

  if (secret !== process.env.REGISTER_SECRET) {
    return res.status(401).json({ message: 'Secret key không hợp lệ' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User đã tồn tại' });

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'User tạo thành công' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}
