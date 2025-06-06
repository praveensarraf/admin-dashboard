import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import Task from "./models/Task.js";

import authRoutes from "./routes/authRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
const corsOptions = {
  origin: "https://dashboard-by-praveen.netlify.app",
  // origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", authRoutes);
app.use("/api/v1/agents", agentRoutes);
app.use("/api/v1/tasks", taskRoutes);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();
    await Task.syncIndexes();
    app.listen(port, () => {
      console.log(`Server is running on ${port}..!!`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
