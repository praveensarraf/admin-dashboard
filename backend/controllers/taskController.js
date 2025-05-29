import fs from "fs";
import path from "path";
import csv from "csvtojson";
import xlsx from "xlsx";
import Agent from "../models/Agent.js";
import Task from "../models/Task.js";

export const uploadAndDistribute = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "File is required!",
        success: false,
      });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    let jsonData = [];

    if (ext === ".csv") {
      jsonData = await csv().fromFile(file.path);
    } else if (ext === ".xlsx" || ext === ".xls") {
      const workbook = xlsx.readFile(file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      jsonData = xlsx.utils.sheet_to_json(sheet);
    } else {
      return res
        .status(400)
        .json({ message: "Invalid file type! Only CSV, XLSX, XLS allowed.", success: false });
    }

    // Validate required fields
    const isValid = jsonData.every(
      (item) => item.FirstName && item.Phone && item.Notes
    );
    if (!isValid) {
      return res
        .status(400)
        .json({ message: "Invalid file format! Missing required fields.", success: false });
    }

    const agents = await Agent.find();
    const agentCount = agents.length;

    if (agentCount === 0) {
      return res.status(400).json({ message: "No agents found!", success: false });
    }

    // Distribute tasks equally among agents (even if not divisible)
    const tasks = [];
    let currentAgentIndex = 0;

    jsonData.forEach((item) => {
      const agent = agents[currentAgentIndex];
      tasks.push({
        firstName: item.FirstName,
        phone: item.Phone,
        notes: item.Notes,
        assignedTo: agent._id,
      });

      currentAgentIndex = (currentAgentIndex + 1) % agentCount;
    });

    await Task.insertMany(tasks);
    await fs.promises.unlink(file.path);

    res.status(201).json({
      message: `Tasks uploaded and distributed among ${agentCount} agent(s)!`,
      success: true,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error!", success: false });
  }
};

export const getTasksGroupedByAgent = async (req, res) => {
  try {
    const agents = await Agent.find();
    const groupedData = [];

    for (const agent of agents) {
      const tasks = await Task.find({ assignedTo: agent._id });
      groupedData.push({
        agent: {
          _id: agent._id,
          name: agent.name,
          email: agent.email,
        },
        tasks,
      });
    }

    res.status(200).json({ data: groupedData, success: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error!", success: false });
  }
};
