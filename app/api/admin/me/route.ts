import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user });
}
