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

    const customer = await db.collection("customers").findOne({ _id: new ObjectId(id) });
    if (!customer) {
      return NextResponse.json({ message: "Không tìm thấy khách hàng." }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("GET customer error:", error);
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
    delete data._id;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "dream_dress");

    if (data.phone) {
      const existing = await db.collection("customers").findOne({ phone: data.phone, _id: { $ne: new ObjectId(id) } });
      if (existing) {
        return NextResponse.json({ message: "Số điện thoại đã tồn tại ở khách hàng khác." }, { status: 400 });
      }
    }

    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    const result = await db.collection("customers").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Không tìm thấy khách hàng." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT customer error:", error);
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

    const rentalsCount = await db.collection("rentals").countDocuments({ customerId: new ObjectId(id) });
    if (rentalsCount > 0) {
      return NextResponse.json({ message: "Không thể xoá vì khách hàng này đã có đơn thuê." }, { status: 400 });
    }

    const result = await db.collection("customers").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Không tìm thấy khách hàng." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE customer error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}
