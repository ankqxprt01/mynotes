import "dotenv/config";
import mongoose from "mongoose";

mongoose
.connect(process.env.mongo_url)
.then(() => console.log("MongoDB connection successful ✅"))
.catch((err) => console.error("MongoDB connection failed ❌", err));