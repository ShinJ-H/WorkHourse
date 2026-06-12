//dashboardController.js

import User from "../models/User.js";
import Task from "../models/Task.js";
import Manager from "../models/Manager.js";
import Project from "../models/Project.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalManagers = await Manager.countDocuments();
    const totalTasks = await Task.countDocuments();
    const totalProjects = await Project.countDocuments();

    res.status(200).json({
      totalUsers,
      totalManagers,
      totalTasks,
      totalProjects,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getOverdueTaskQuery = () => ({
  status: { $ne: "Completed" },
  endDate: { $lt: new Date() },
});

const getOverdueProjectQuery = () => ({
  status: { $ne: "Completed" },
  endDate: { $lt: new Date() },
});

// ✅ Admin/Manager dashboard: show tasks & projects status counts based on assigned users/projects.
// NOTE: protect middleware must attach `req.user`.
// ================= TASK STATUS =================

export const getTaskStatusStats = async (req, res) => {
  try {
    const role = req.user?.role || "user";

    let filter = {};

    // USER sees only own tasks
    if (role === "user") {
      filter.user = req.user._id;
    }


    const pending = await Task.countDocuments({
      ...filter,
      status: "Pending",
    });

    const inProgress = await Task.countDocuments({
      ...filter,
      status: "In Progress",
    });

    const completed = await Task.countDocuments({
      ...filter,
      status: "Completed",
    });

    const overdue = await Task.countDocuments({
      ...filter,
      status: { $ne: "Completed" },
      endDate: { $lt: new Date() },
    });

    res.status(200).json({
      pending,
      inProgress,
      completed,
      overdue,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= PROJECT STATUS =================

export const getProjectStatusStats = async (req, res) => {

  try {
    console.log(req.user);
console.log(req.user.role);

    const role = req.user?.role;

    // ADMIN/MANAGER SEE ALL TEAM STATUS
    if (
      role === "admin" ||
      role === "Manager"
    ) {

      const projects = await Project.find();

      let pending = 0;
      let inProgress = 0;
      let completed = 0;
      let overdue = 0;

      projects.forEach((project) => {

        project.team.forEach((member) => {

          if (member.status === "Pending") {
            pending++;
          }

          if (member.status === "In Progress") {
            inProgress++;
          }

          if (member.status === "Completed") {
            completed++;
          }

          if (
            member.status === "In Progress" &&
            project.endDate &&
            new Date(project.endDate) < new Date()
          ) {
            overdue++;
          }
        });
      });

      return res.status(200).json({
        pending,
        inProgress,
        completed,
        overdue,
      });
    }

    // NORMAL USER
    const projects = await Project.find({
      "team.user": req.user._id,
    });

    let pending = 0;
    let inProgress = 0;
    let completed = 0;
    let overdue = 0;

    projects.forEach((project) => {

      const member = project.team.find(
        (m) =>
          m.user.toString() === req.user._id.toString()
      );

      if (!member) return;

      if (member.status === "Pending") {
        pending++;
      }

      if (member.status === "In Progress") {
        inProgress++;
      }

      if (member.status === "Completed") {
        completed++;
      }

      if (
        member.status === "In Progress" &&
        project.endDate &&
        new Date(project.endDate) < new Date()
      ) {
        overdue++;
      }
    });

    res.status(200).json({
      pending,
      inProgress,
      completed,
      overdue,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


