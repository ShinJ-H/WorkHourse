import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);

  // Fetch notes
  const fetchNotes = async () => {
    const res = await axios.get("http://localhost:5000/api/notes");
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Submit note
  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    await axios.delete(`http://localhost:5000/api/notes/${id}`);
    fetchNotes();
  };

  // 🔥 START EDIT
  const startEdit = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  // 🔥 UPDATE
  const handleUpdate = async (id) => {
    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("content", editContent);
    if (editImage) formData.append("image", editImage);

    await axios.put(`http://localhost:5000/api/notes/${id}`, formData);

    setEditingId(null);
    setEditImage(null);

    fetchNotes();
  };

  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white mb-4 animated slideInDown">
            Notes
          </h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item">
                <Link to={'/'}>Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={'/'}>Pages</Link>
              </li>
              <li className="breadcrumb-item" aria-current="page">
                Notes
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}
      <div className="min-h-screen bg-gray-100 p-6">

        {/* Add Note Form */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-white shadow-xl rounded-2xl p-6 border">

            <h2 className="text-2xl font-bold text-gray-700 mb-6">
              Create New Note
            </h2>

            <form onSubmit={handleDelete} className="space-y-5">

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter note title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Content
                </label>
                <textarea
                  placeholder="Write your note here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl h-32 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Upload Image
                </label>

                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border">
                    Choose File
                    <input
                      type="file"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="hidden"
                    />
                  </label>

                  {image && (
                    <span className="text-sm text-gray-600">
                      {image.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-semibold hover:opacity-90"
              >
                Add Note
              </button>

            </form>
          </div>
        </div>

        {/* 🔹 Notes Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-700">
            All Notes
          </h2>

          {notes.length === 0 ? (
            <p className="text-center text-gray-500">
              No notes yet
            </p>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  {note.image && (
                    <img
                      src={`http://localhost:5000/uploads/${note.image}`}
                      alt=""
                      onClick={() =>
                        setSelectedImage(`http://localhost:5000/uploads/${note.image}`)
                      }
                      className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition"
                    />
                  )}

                  <div className="p-4">

                    {editingId === note._id ? (
                      <>
                        {/* EDIT MODE */}
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full border p-2 rounded mb-2"
                        />

                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full border p-2 rounded mb-2"
                        />

                        <input
                          type="file"
                          onChange={(e) => setEditImage(e.target.files[0])}
                          className="mb-2"
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(note._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>

                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-400 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* NORMAL VIEW */}
                        <h3 className="text-lg font-semibold text-gray-800">
                          {note.title}
                        </h3>

                        <p className="text-gray-600 mt-2 text-sm">
                          {note.content}
                        </p>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => startEdit(note)}
                            className="text-blue-500 font-medium p-1 bg-blue-300 border-2 border-blue-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(note._id)}
                            className="text-red-500 font-medium p-1 bg-red-300 border-2 border-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

        {/*  Image Modal */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-5 right-5 text-white text-3xl font-bold"
            >
              ✕
            </button>

            {/* Image */}
            <img
              src={selectedImage}
              alt="Full View"
              onClick={(e) => e.stopPropagation()}
              className="max-w-[90%] max-h-[90%] rounded-xl shadow-lg"
            />
          </div>
        )}

      </div>
    </>
  );
};

export default Notes;