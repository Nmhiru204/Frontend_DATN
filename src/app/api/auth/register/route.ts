import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();
    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ message: "Email đã tồn tại" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName, lastName, email,
      password: hashed,
      role: "user", // ✅ luôn user khi tự đăng ký
    });

    return NextResponse.json({
      message: "Đăng ký thành công",
      user: { email: user.email, firstName, lastName }
    });
  } catch (e) {
    console.error("REGISTER ERROR:", e);
    return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 });
  }
}
