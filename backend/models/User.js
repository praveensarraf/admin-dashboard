import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email!'],
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },
}, {timestamps: true});


// User Model
const User = mongoose.model("User", userSchema);

export default User;
