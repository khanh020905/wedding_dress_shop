import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID không hợp lệ." }, { status: 400 });
    }

    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ message: "Vui lòng truyền status mới." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "dream_dress");

    const result = await db.collection("appointments").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Không tìm thấy lịch hẹn." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PATCH appointment status error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}
