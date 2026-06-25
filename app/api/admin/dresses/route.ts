import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "dream_dress");

    const query: Record<string, unknown> = {};
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { code: { $regex: q, $options: "i" } }
      ];
    }
    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }

    const items = await db.collection("dresses").find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray();
    const total = await db.collection("dresses").countDocuments(query);

    return NextResponse.json({ items, total, page, limit });
  } catch (error) {
    console.error("GET dresses error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { code, name, category, size, rentalPrice, status } = data;

    if (!code || !name || !category || !size || rentalPrice === undefined || !status) {
      return NextResponse.json({ message: "Vui lòng điền đủ thông tin bắt buộc." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "dream_dress");

    const existing = await db.collection("dresses").findOne({ code });
    if (existing) {
      return NextResponse.json({ message: "Mã váy đã tồn tại." }, { status: 400 });
    }

    const newDress = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("dresses").insertOne(newDress);

    return NextResponse.json({ ok: true, id: result.insertedId });
  } catch (error) {
    console.error("POST dresses error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}
