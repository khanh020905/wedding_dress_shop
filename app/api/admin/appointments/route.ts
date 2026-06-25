import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "dream_dress");

    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    }

    const items = await db.collection("appointments").find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray();
    const total = await db.collection("appointments").countDocuments(query);

    return NextResponse.json({ items, total, page, limit });
  } catch (error) {
    console.error("GET appointments error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}
