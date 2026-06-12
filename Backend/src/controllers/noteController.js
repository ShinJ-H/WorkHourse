import Note from "../models/Note.js";

// ➕ Add Note
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = new Note({
      title,
      content,
      image: req.file ? req.file.filename : null
    });

    const savedNote = await note.save();

    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get All Notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Note
export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Note
export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const updatedData = {
      title,
      content
    };

    // if new image uploaded
    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};