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

    const rental = await db.collection("rentals").findOne({ _id: new ObjectId(id) });
    if (!rental) {
      return NextResponse.json({ message: "Không tìm thấy đơn thuê." }, { status: 404 });
    }

    return NextResponse.json(rental);
  } catch (error) {
    console.error("GET rental error:", error);
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

    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date()
    };

    if (data.customerId) updateData.customerId = new ObjectId(data.customerId);
    if (data.dressId) updateData.dressId = new ObjectId(data.dressId);
    if (data.rentalDate) updateData.rentalDate = new Date(data.rentalDate);
    if (data.returnDate) updateData.returnDate = new Date(data.returnDate);
    if (data.deposit !== undefined) updateData.deposit = Number(data.deposit);
    if (data.totalPrice !== undefined) updateData.totalPrice = Number(data.totalPrice);

    // If status changes here, we should ideally handle the dress status update as well.
    // However, we have a dedicated PATCH /status endpoint for that to simplify logic.
    // We will just do a simple update here without side-effects on dresses, assuming status changes via PATCH.

    const result = await db.collection("rentals").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Không tìm thấy đơn thuê." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT rental error:", error);
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

    const result = await db.collection("rentals").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Không tìm thấy đơn thuê." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE rental error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}
