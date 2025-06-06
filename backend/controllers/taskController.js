import csv from "csvtojson";
import xlsx from "xlsx";
import Agent from "../models/Agent.js";
import Task from "../models/Task.js";

// Upload and Distribute Tasks
export const uploadAndDistribute = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "File is required!",
        success: false,
      });
    }

    const ext = file.originalname.split(".").pop().toLowerCase();
    let jsonData = [];

    // Convert file buffer to JSON
    if (ext === "csv") {
      const csvStr = file.buffer.toString("utf-8");
      jsonData = await csv().fromString(csvStr);
    } else if (ext === "xlsx" || ext === "xls") {
      const workbook = xlsx.read(file.buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      jsonData = xlsx.utils.sheet_to_json(sheet);
    } else {
      return res.status(400).json({
        message: "Invalid file type! Only CSV, XLSX, XLS allowed.",
        success: false,
      });
    }

    // Validate each row
    const isValid = jsonData.every(
      (item) => item.FirstName && item.Phone && item.Notes
    );
    if (!isValid) {
      return res.status(400).json({
        message: "Invalid file format! Missing required fields.",
        success: false,
      });
    }

    // Get agents created by this user only
    const agents = await Agent.find({ createdBy: req.user._id });
    const agentCount = agents.length;

    if (agentCount === 0) {
      return res.status(400).json({
        message: "No agents found for this user!",
        success: false,
      });
    }

    // Check for duplicate phone numbers
    const phoneNumbersFromCSV = jsonData.map((item) => item.Phone);
    const existingTasks = await Task.find({
      phone: { $in: phoneNumbersFromCSV },
    });
    const existingPhones = existingTasks.map((task) => task.phone);

    if (existingPhones.length > 0) {
      return res.status(400).json({
        message: `The following phone numbers already exist: ${existingPhones.join(
          ", "
        )}`,
        success: false,
      });
    }

    // Distribute tasks among user's agents
    const tasks = [];
    let currentAgentIndex = 0;

    for (const item of jsonData) {
      const agent = agents[currentAgentIndex];

      tasks.push({
        firstName: item.FirstName,
        phone: item.Phone,
        notes: item.Notes,
        assignedTo: agent._id,
      });

      currentAgentIndex = (currentAgentIndex + 1) % agentCount;
    }

    // Save tasks in DB
    await Task.insertMany(tasks);

    res.status(201).json({
      message: `Tasks uploaded and distributed among ${agentCount} agent(s)!`,
      success: true,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error!", success: false });
  }
};

// Get Tasks Grouped by Agent
export const getTasksGroupedByAgent = async (req, res) => {
  try {
    const agents = await Agent.find({ createdBy: req.user._id });
    const groupedData = [];

    for (const agent of agents) {
      const tasks = await Task.find({ assignedTo: agent._id }).populate('assignedTo', 'name email');

      groupedData.push({
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        taskCount: tasks.length,
        tasks,
      });
    }

    res.status(200).json({ data: groupedData, success: true });
  } catch (error) {
    console.error("Group Fetch Error:", error);
    res.status(500).json({ message: "Server Error!", success: false });
  }
};
