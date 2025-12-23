import { connectToDatabase } from "../database/mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const testConnection = async () => {
  console.log("🧪 Testing database connection...");

  try {
    const conn = await connectToDatabase();
    console.log("✅ Connection test passed!");

    if (conn) {
      console.log(`   - Database Name: ${conn.connection.name}`);
      console.log(`   - Host: ${conn.connection.host}`);
      console.log(
        `   - State: ${
          conn.connection.readyState === 1 ? "Connected" : "Not Connected"
        }`
      );
    }
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection test failed:", error);
    process.exit(1);
  }
};

testConnection();
