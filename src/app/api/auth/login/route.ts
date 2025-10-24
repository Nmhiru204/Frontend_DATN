import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "Email không tồn tại" }, { status: 400 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ message: "Sai mật khẩu" }, { status: 401 });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // ✅ role
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      message: "Đăng nhập thành công",
      token,
      user: { email: user.email, role: user.role }
    });
    res.cookies.set("token", token, {
      httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7
    });
    return res;
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 });
  }
}
