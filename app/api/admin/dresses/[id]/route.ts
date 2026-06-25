import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID không hợp lệ." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "dream_dress");

    const dress = await db.collection("dresses").findOne({ _id: new ObjectId(id) });
    if (!dress) {
      return NextResponse.json({ message: "Không tìm thấy váy." }, { status: 404 });
    }

    return NextResponse.json(dress);
  } catch (error) {
    console.error("GET dress error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID không hợp lệ." }, { status: 400 });
    }

    const data = await request.json();
    // Prevent updating _id
    delete data._id;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "dream_dress");

    // Check code duplication
    if (data.code) {
      const existing = await db.collection("dresses").findOne({ code: data.code, _id: { $ne: new ObjectId(id) } });
      if (existing) {
        return NextResponse.json({ message: "Mã váy đã tồn tại." }, { status: 400 });
      }
    }

    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    const result = await db.collection("dresses").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Không tìm thấy váy." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT dress error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID không hợp lệ." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "dream_dress");

    // Block deletion if active rentals exist
    const activeRentalsCount = await db.collection("rentals").countDocuments({
      dressId: new ObjectId(id),
      status: { $in: ["dat-coc", "dang-thue"] }
    });

    if (activeRentalsCount > 0) {
      return NextResponse.json({ message: "Không thể xoá vì váy đang có đơn thuê hoặc đặt cọc." }, { status: 400 });
    }

    const result = await db.collection("dresses").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Không tìm thấy váy." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE dress error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}
