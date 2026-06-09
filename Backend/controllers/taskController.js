import Task from "../models/Task.js";

const buildFileData = (file) => {
  if (!file) return null;
  return {
    url: `http://localhost:5000/uploads/${file.filename}`,
    public_id: file.filename,
  };
};

export const createTask = async (req, res) => {
  try {
    const { title, description, userId, priority, startDate, endDate, fileLink } = req.body;

    const task = await Task.create({
      title,
      description,
      user: userId,
      priority,
      startDate,
      endDate,
      file: buildFileData(req.file),
      fileLink,
    });

    res.status(201).json({
      message: "Task assigned successfully",
      task,
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

export const updateTask = async (req, res) => {
  try {
    const { title, description, userId, priority, startDate, endDate, status, fileLink } = req.body;

    const normalizeStatus = (s) => {
      if (s == null) return undefined;
      const v = String(s).toLowerCase();
      if (v.includes("complete")) return "Completed";
      if (v.includes("progress")) return "In Progress";
      if (v === "inprogress") return "In Progress";
      if (v.includes("in")) return "In Progress";
      if (v.includes("pending")) return "Pending";
      return s;
    };

    // Build update object only with defined fields.
    // Also normalize enum values coming from the frontend.
    const update = {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(userId !== undefined ? { user: userId } : {}),
      ...(priority !== undefined ? { priority } : {}),
      ...(startDate !== undefined ? { startDate } : {}),
      ...(endDate !== undefined ? { endDate } : {}),
      ...(status !== undefined ? { status: normalizeStatus(status) } : {}),
      ...(fileLink !== undefined ? { fileLink } : {}),
    };

    // Only override file if a new one is uploaded
    if (req.file) {
      update.file = buildFileData(req.file);
    }

    const task = await Task.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
