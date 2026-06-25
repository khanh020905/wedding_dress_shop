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

    const rental = await db.collection("rentals").findOne({ _id: new ObjectId(id) });
    if (!rental) {
      return NextResponse.json({ message: "Không tìm thấy đơn thuê." }, { status: 404 });
    }

    const session = client.startSession();
    try {
      session.startTransaction();

      // Update rental status
      await db.collection("rentals").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } },
        { session }
      );

      // Update dress status based on rental status
      // If rental becomes 'dang-thue', dress becomes 'dang-thue'
      // If rental becomes 'da-tra' or 'huy', dress becomes 'san-sang' (if no other active rentals hold it)
      if (status === "dang-thue") {
        await db.collection("dresses").updateOne(
          { _id: new ObjectId(rental.dressId) },
          { $set: { status: "dang-thue", updatedAt: new Date() } },
          { session }
        );
      } else if (status === "da-tra" || status === "huy") {
        // Check if other active rentals are holding this dress
        const otherActiveRentalsCount = await db.collection("rentals").countDocuments(
          { 
            dressId: new ObjectId(rental.dressId), 
            _id: { $ne: new ObjectId(id) },
            status: { $in: ["dat-coc", "dang-thue"] }
          },
          { session }
        );

        if (otherActiveRentalsCount === 0) {
          await db.collection("dresses").updateOne(
            { _id: new ObjectId(rental.dressId) },
            { $set: { status: "san-sang", updatedAt: new Date() } },
            { session }
          );
        }
      }

      await session.commitTransaction();
      return NextResponse.json({ ok: true });
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("PATCH rental status error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}
