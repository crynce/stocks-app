"use server";

import { connectToDatabase } from "@/database/mongoose";

export const getAllUsersForNewsEmail = async () => {
  try {
    //we care connecting to the mongoose because we're in serverless enviroment which means for every new server action we've to reconnect to the database but it's efficient because we're caching it from the database
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not found");
    }
    const users = await db
      .collection("user")
      .find(
        { email: { $exists: true, $ne: null } },
        { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } },
      )
      .toArray();
    console.log(users, "users");
    return users
      .filter((user) => user.email && user.name)
      .map((user) => ({
        id: user.id || user._id || "",
        email: user.email,
        name: user.name,
      }));
  } catch (error) {
    console.error("Error fetching users for news email", error);
    //send a empty array as user fetching reulted in error
    return [];
  }
};
