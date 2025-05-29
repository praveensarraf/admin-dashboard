import Agent from "../models/Agent.js";
import bcrypt from "bcryptjs";

// Add new agent
export const addAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const agent = await Agent.findOne({ email, mobile });
    if (agent) {
      return res
        .status(400)
        .json({ message: "Agent already exists!", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgent = new Agent({
      name,
      email,
      mobile,
      password: hashedPassword,
    });
    await newAgent.save();

    res.status(201).json({
      message: "Agent added successfully!",
      agent: {
        _id: newAgent._id,
        name: newAgent.name,
        email: newAgent.email,
        mobile: newAgent.mobile,
      },
      success: true,
    });
  } catch (error) {
    if (err.name === 'ValidationError') {
      const emailError = err.errors.email?.message;
      if (emailError) {
        return res.status(400).json({ message: emailError });
      }
      return res.status(400).json({ message: 'Validation failed!' });
    }

    res.status(500).json({ message: 'Server error!' });
  }
};

// Get all agents
export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select("-password");
    res.status(200).json({
      agents,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error!' });
  }
};

// Delete agent
export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    await Agent.findByIdAndDelete(id);
    res.status(200).json({
      message: "Agent deleted successfully!",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
};
