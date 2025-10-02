import mongoose from "mongoose";

async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Database already connected");
      return;
    }

    const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
    await mongoose.connect(`${uri}/TrelloLite`);

    console.log("Database connected");
  } catch (err) {
    console.error("An error occured in connectDB function", err.message);
    process.exit(1);
  }
}

export { connectDB };
