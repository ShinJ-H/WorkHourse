import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, userId, priority, startDate, endDate } = req.body;
    let fileData = null;
    if (req.file) {
      fileData = {
        url: `http://localhost:5000/uploads/${req.file.filename}`, // ✅ CORRECT
        public_id: req.file.filename
      };
    }

    const task = await Task.create({
      title,
      description,
      user: userId,
      priority,
      startDate,
      endDate,
      file: fileData
    });

    res.status(201).json({
      message: "Task assigned successfully",
      task
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};