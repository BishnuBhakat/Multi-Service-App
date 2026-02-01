require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");
const User = require("./models/User");

const PORT = process.env.PORT || 5000;

async function startServer() {
  // 1️⃣ Connect to DB FIRST
  await connectDB();

  // 2️⃣ Confirm connection + list collections
  const collections = await mongoose.connection.db
    .listCollections()
    .toArray();

  console.log(
    "Collections:",
    collections.map(c => c.name)
  );

  // 3️⃣ Insert test user (ONCE)
  try {
    await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: "123456"
    });
    console.log("✅ Test user inserted");
  } catch (err) {
    console.log("⚠️ User already exists or error:", err.message);
  }

  // 4️⃣ Start server LAST
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("❌ Failed to start server:", err);
});
