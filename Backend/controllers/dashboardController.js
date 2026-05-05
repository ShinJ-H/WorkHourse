import User from "../models/User.js";
import Task from "../models/Task.js";
import Manager from "../models/Manager.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalManagers = await Manager.countDocuments(); // ✅ NEW
    const totalTasks = await Task.countDocuments();

    res.status(200).json({
      totalUsers,
      totalManagers,
      totalTasks
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};