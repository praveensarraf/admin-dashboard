import mongoose from "mongoose";

// Task Schema
const taskSchema = new mongoose.Schema({
  firstName: String,
  phone: Number,
  notes: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent"
  }
}, { timestamps: true });

// Task  Model
const Task = mongoose.model("Task", taskSchema);

export default Task;