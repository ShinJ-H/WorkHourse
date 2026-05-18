import Project from "../models/Project.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { title, description, startDate, endDate, status, team } = req.body;

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
      team,
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
    const projects = await Project.find().populate("team");

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

    const project = await Project.findById(id).populate("team");

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
    const { title, description, startDate, endDate, status, team } = req.body;

    // Replace ALL existing files on update (per requirement)
    const files = (req.files || []).map((file) => ({
      url: `http://localhost:5000/uploads/${file.filename}`,
      public_id: file.filename,
      mimeType: file.mimetype,
      originalName: file.originalname,
    }));

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        description,
        startDate,
        endDate,
        status,
        team,
        files,
      },
      { new: true }
    ).populate("team");

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

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

            team: userId,

        }).populate("team");

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