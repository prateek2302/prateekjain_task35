import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import workoutRoutes from "./routes/workouts.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI is required. Add it to backend/.env.");
  process.exit(1);
}

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/workouts", workoutRoutes);
app.use(notFound);
app.use(errorHandler);

try {
  await mongoose.connect(mongoUri);
  app.listen(port, () => {
    console.log(`Workout Budyyy API listening on port ${port}`);
  });
} catch (error) {
  console.error("Unable to connect to MongoDB:", error.message);
  process.exit(1);
}
