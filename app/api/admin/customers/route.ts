import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "dream_dress");

    const query: Record<string, unknown> = {};
    if (q) {
      query.$or = [
        { fullName: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } }
      ];
    }

    const items = await db.collection("customers").find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray();
    const total = await db.collection("customers").countDocuments(query);

    return NextResponse.json({ items, total, page, limit });
  } catch (error) {
    console.error("GET customers error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { fullName, phone } = data;

    if (!fullName || !phone) {
      return NextResponse.json({ message: "Vui lòng nhập tên và số điện thoại." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "dream_dress");

    const existing = await db.collection("customers").findOne({ phone });
    if (existing) {
      return NextResponse.json({ message: "Số điện thoại đã tồn tại." }, { status: 400 });
    }

    const newCustomer = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("customers").insertOne(newCustomer);

    return NextResponse.json({ ok: true, id: result.insertedId });
  } catch (error) {
    console.error("POST customers error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}
