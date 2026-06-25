import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { login } from "@/lib/auth";

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxAttempts = 5;

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - record.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ message: "Quá nhiều lần thử, vui lòng đợi 1 phút." }, { status: 429 });
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: "Vui lòng nhập đầy đủ tài khoản và mật khẩu." }, { status: 400 });
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminUsername || !adminPasswordHash) {
      console.error("ADMIN_USERNAME hoặc ADMIN_PASSWORD_HASH chưa được cấu hình.");
      return NextResponse.json({ message: "Lỗi cấu hình server." }, { status: 500 });
    }

    if (username !== adminUsername) {
      return NextResponse.json({ message: "Sai tài khoản hoặc mật khẩu." }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, adminPasswordHash);

    if (!isMatch) {
      return NextResponse.json({ message: "Sai tài khoản hoặc mật khẩu." }, { status: 401 });
    }

    await login(username);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}
