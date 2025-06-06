import Agent from "../models/Agent.js";
import Task from "../models/Task.js";
import bcrypt from "bcryptjs";

// Add new agent
export const addAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if email exists
    const emailExists = await Agent.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        message: "Email already exists. Try another one!",
        success: false,
      });
    }

    // Check if mobile exists
    const mobileExists = await Agent.findOne({ mobile });
    if (mobileExists) {
      return res.status(400).json({
        message: "Mobile number already exists. Try another one!",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgent = new Agent({
      name,
      email,
      mobile,
      password: hashedPassword,
      createdBy: req.user._id,
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
    if (error.name === "ValidationError") {
      const emailError = error.errors.email?.message;
      if (emailError) {
        return res.status(400).json({ message: emailError });
      }
      return res.status(400).json({ message: "Validation failed!" });
    }

    res.status(500).json({ message: "Server error!" });
  }
};

// ✅ Get all agents
export const getAgents = async (req, res) => {
  try {
    const userId = req.user._id;
    const agents = await Agent.find({ createdBy: userId }).select("-password");

    const agentsWithTasks = await Promise.all(
      agents.map(async (agent) => {
        const tasks = await Task.find({ assignedTo: agent._id }).populate("assignedTo", "name email");
        return {
          ...agent.toObject(),
          tasks,
        };
      })
    );

    res.status(200).json({
      agents: agentsWithTasks,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
};

// Delete agent (only by creator)
export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findOne({ _id: id, createdBy: req.user._id });

    if (!agent) {
      return res
        .status(404)
        .json({ message: "Agent not found", success: false });
    }

    await agent.deleteOne();

    res.status(200).json({
      message: "Agent deleted successfully!",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
};
