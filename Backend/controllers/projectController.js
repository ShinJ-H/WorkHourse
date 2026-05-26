// projectController.js

import Project from "../models/Project.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { title, description, startDate, endDate, status, priority, team } = req.body;

    const files = (req.files || []).map((file) => ({
      url: `http://localhost:5000/uploads/${file.filename}`,
      public_id: file.filename,
      mimeType: file.mimetype,
      originalName: file.originalname,
    }));

    const project = await Project.create({
      title,
      description,
      startDate,
      endDate,
      status,
      priority,
      team: team.map((id) => ({
        user: id,
        status: "Pending",
      })),
      files,
    });

    res.status(201).json({
      success: true,
      message: "Project Created",
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PROJECTS
export const getProjects = async (req, res) => {

  try {

    const projects = await Project.find()
      .populate("team.user");

    res.status(200).json({

      success: true,

      projects,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });
  }
};

// GET SINGLE PROJECT
export const getSingleProject = async (req, res) => {

  try {

    const { id } = req.params;

    const project = await Project.findById(id)
      .populate("team.user");

    if (!project) {

      return res.status(404).json({

        success: false,

        message: "Project not found",

      });
    }

    res.status(200).json({

      success: true,

      project,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });
  }
};

// UPDATE PROJECT
export const updateProject = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      title,
      description,
      startDate,
      endDate,
      status,
      priority,
      team,
    } = req.body;

    const oldProject = await Project.findById(id);

    if (!oldProject) {

      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // FILES
    const files =
      (req.files || []).map((file) => ({

        url: `http://localhost:5000/uploads/${file.filename}`,

        public_id: file.filename,

        mimeType: file.mimetype,

        originalName: file.originalname,

      }));


    // KEEP OLD MEMBER STATUS
    let updatedTeam = oldProject.team;

    // ONLY UPDATE TEAM IF ADMIN CHANGED TEAM MEMBERS
    if (team && Array.isArray(team)) {

      updatedTeam = team.map((id) => {

        // CHECK OLD MEMBER
        const existingMember =
          oldProject.team.find(
            (m) =>
              m.user.toString() === id.toString()
          );

        // KEEP OLD STATUS
        if (existingMember) {

          return existingMember;
        }

        // NEW MEMBER
        return {

          user: id,

          status: "Pending",

        };
      });
    }

    const updatedProject =
      await Project.findByIdAndUpdate(

        id,

        {

          title,

          description,

          startDate,

          endDate,

          status,

          priority,

          team: updatedTeam,

          // KEEP OLD FILES IF NO NEW FILES
          files:
            files.length > 0
              ? files
              : oldProject.files,

        },

        {
          returnDocument: "after",
        }

      ).populate("team.user");


    res.status(200).json({

      success: true,

      message: "Project updated",

      project: updatedProject,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted",
      project: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET USER PROJECTS
export const getUserProjects = async (req, res) => {

  try {

    const userId = req.params.userId;

    const projects = await Project.find({

  "team.user": userId,

}).populate("team.user")

    res.status(200).json({

      success: true,
      projects,
    });

  } catch (error) {

    res.status(500).json({

      success: false,
      message: error.message,
    });
  }
};

export const updateProjectMemberStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const project = await Project.findById(
      req.params.id
    );

    if (!project) {

      return res.status(404).json({
        message: "Project not found",
      });
    }

    const member = project.team.find(
      (m) =>
        m.user.toString() ===
        req.user._id.toString()
    );

    if (!member) {

      return res.status(403).json({
        message: "Not assigned to project",
      });
    }

    member.status = status;

    if (status === "Completed") {

      member.completedAt = new Date();
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project status updated",
      project,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};