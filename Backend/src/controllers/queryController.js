import Query from "../models/Query.js";

// Create query (from ContactUs)
export const createQuery = async (req, res) => {
  try {
    const { name, email, project, message } = req.body;

    const query = await Query.create({
      name,
      email,
      project: project || "",
      message,
    });

    res.status(201).json(query);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all queries (for admin)
export const getQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete query (optional admin action)
export const deleteQuery = async (req, res) => {
  try {
    await Query.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Query deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

