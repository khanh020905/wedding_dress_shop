import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "dream_dress");

    const totalDresses = await db.collection("dresses").countDocuments();
    const rentedDresses = await db.collection("dresses").countDocuments({ status: "dang-thue" });
    
    const newAppointments = await db.collection("appointments").countDocuments({ status: "moi" });

    // Aggregate rentals by status
    const rentalsByStatusArray = await db.collection("rentals").aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    const rentalsByStatus = rentalsByStatusArray.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Calculate revenue for the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const currentMonthRevenueArray = await db.collection("rentals").aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: { $in: ["da-tra", "dang-thue", "dat-coc"] } // Adjust logic based on business rules for what counts as revenue
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" }
        }
      }
    ]).toArray();

    const currentMonthRevenue = currentMonthRevenueArray.length > 0 ? currentMonthRevenueArray[0].total : 0;

    return NextResponse.json({
      totalDresses,
      rentedDresses,
      newAppointments,
      rentalsByStatus,
      currentMonthRevenue
    });
  } catch (error) {
    console.error("GET stats error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}
