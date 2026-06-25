import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
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

    // Use aggregation to join customer and dress data
    const pipeline: Record<string, unknown>[] = [
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer"
        }
      },
      {
        $lookup: {
          from: "dresses",
          localField: "dressId",
          foreignField: "_id",
          as: "dress"
        }
      },
      {
        $unwind: { path: "$customer", preserveNullAndEmptyArrays: true }
      },
      {
        $unwind: { path: "$dress", preserveNullAndEmptyArrays: true }
      }
    ];

    const items = await db.collection("rentals").aggregate(pipeline).toArray();
    const total = await db.collection("rentals").countDocuments(query);

    return NextResponse.json({ items, total, page, limit });
  } catch (error) {
    console.error("GET rentals error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { customerId, dressId, rentalDate, returnDate, deposit, totalPrice, status } = data;

    if (!customerId || !dressId || !rentalDate || !returnDate || deposit === undefined || totalPrice === undefined || !status) {
      return NextResponse.json({ message: "Vui lòng nhập đủ thông tin bắt buộc." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "dream_dress");

    // Check if dress exists and is available
    const dress = await db.collection("dresses").findOne({ _id: new ObjectId(dressId) });
    if (!dress) {
      return NextResponse.json({ message: "Váy không tồn tại." }, { status: 400 });
    }

    if (dress.status !== "san-sang" && status === "dang-thue") {
      return NextResponse.json({ message: "Váy đang không ở trạng thái sẵn sàng để thuê." }, { status: 400 });
    }

    // Parse dates to Date objects
    const parsedRentalDate = new Date(rentalDate);
    const parsedReturnDate = new Date(returnDate);

    const newRental = {
      customerId: new ObjectId(customerId),
      dressId: new ObjectId(dressId),
      rentalDate: parsedRentalDate,
      returnDate: parsedReturnDate,
      deposit: Number(deposit),
      totalPrice: Number(totalPrice),
      status, // dat-coc, dang-thue, da-tra, huy
      note: data.note || "",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const session = client.startSession();
    try {
      session.startTransaction();

      const result = await db.collection("rentals").insertOne(newRental, { session });

      if (status === "dang-thue") {
        await db.collection("dresses").updateOne(
          { _id: new ObjectId(dressId) },
          { $set: { status: "dang-thue", updatedAt: new Date() } },
          { session }
        );
      }

      await session.commitTransaction();
      return NextResponse.json({ ok: true, id: result.insertedId });
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("POST rentals error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}
