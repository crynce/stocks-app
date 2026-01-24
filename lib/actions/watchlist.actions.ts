"use server";

import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";

export const getWatchlistSymbolsByEmail = async (
  email: string,
): Promise<string[]> => {
  try {
    // 1. Find user by email to get userId
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) throw new Error("Database connection not found");

    const user = await db.collection("user").findOne({ email });

    if (!user) {
      console.warn(`User with email ${email} not found.`);
      return [];
    }

    // 2. Query Watchlist by userId (user._id or user.id depending on adapter)
    const userId = user.id || user._id.toString() || "";

    const items = await Watchlist.find({ userId }).select("symbol");

    return items.map((item) => item.symbol);
  } catch (error) {
    console.error("Error fetching watchlist symbols:", error);
    return [];
  }
};
