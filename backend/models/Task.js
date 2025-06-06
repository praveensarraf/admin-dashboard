import mongoose from "mongoose";

// Task Schema
const taskSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      unique: true,
      required: true,
    },
    notes: {
      type: String,
      required: true,
    },
    
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },
  },
  { timestamps: true }
);

// Task  Model
const Task = mongoose.model("Task", taskSchema);

export default Task;
