import express from "express";
import dotenv from "dotenv";
import { connectDB } from "../lib/db.js";
import authRoutes from "../routes/auth.route.js";
import resumeRoutes from "../routes/resume.route.js"
const app = express();

app.use(express.json());
dotenv.config();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/resume", resumeRoutes)



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Backend is running on PORT ${PORT}, Enjoy Building :) `);
    connectDB();
});
