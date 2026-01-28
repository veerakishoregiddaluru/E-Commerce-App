import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Mongodb URI", process.env.MONGODB_URI);

  console.log("✅ MongoDB Connected");
  console.log("📌 DB NAME USED BY BACKEND:", mongoose.connection.name);

  const collections = await mongoose.connection.db.listCollections().toArray();

  console.log(
    "📂 COLLECTIONS SEEN BY BACKEND:",
    collections.map((c) => c.name),
  );
};

export default connectDB;
