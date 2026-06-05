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
  // ➕ CREATE
  const handleCreate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    await axios.post("http://localhost:5000/api/notes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setTitle("");
    setContent("");
    setImage(null);

    fetchNotes();
  };

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
          <h1 className="display-2 text-white animated slideInDown">
            Notes
          </h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item">
                <Link to={'/'}>Home</Link>
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
        <div className="max-w-3xl mx-auto mb-10 mb-4 rounded-2xl">
          <div className="bg-white shadow-xl rounded-2xl p-6 border">

            <h2 className="text-2xl font-bold text-gray-700 mb-6">
              Create New Note
            </h2>

            <form onSubmit={handleCreate} className="space-y-5">


              {/* Title */}
              <div>
                <label className="block text-2xl font-medium text-gray-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter note title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 mb-4 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none "
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-2xl font-medium text-gray-600 mb-1">
                  Content
                </label>
                <textarea
                  placeholder="Write your note here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 mb-4 rounded-xl h-32 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-2xl font-medium text-gray-600 mb-2">
                  Upload Image
                </label>

                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg mb-4 w-full">
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
                className="w-full inline-flex items-center justify-center !rounded-md bg-purple-900 px-16 py-3 text-white font-semibold shadow-sm hover:bg-purple-800 disabled:opacity-70"
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
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition mb-4"
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
                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={() => startEdit(note)}
                            className="group inline-flex items-center justify-center rounded-xl px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-cyan-300"
                            aria-label={`Edit ${note.title}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4 mr-2 opacity-95 group-hover:opacity-100"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(note._id)}
                            className="group inline-flex items-center justify-center rounded-xl px-4 py-2 bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-rose-300"
                            aria-label={`Delete ${note.title}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4 mr-2 opacity-95 group-hover:opacity-100"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
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