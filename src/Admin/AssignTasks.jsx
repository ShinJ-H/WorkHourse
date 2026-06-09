import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function AssignTasks() {
  const { id } = useParams();
  const [editingId, setEditingId] = useState(null);

  const apiBase = "http://localhost:5000/api";

  const handlePrefillFromTask = (task) => {
    setEditingId(task?._id || task?.id || null);
    setFormData({
      title: task?.title || "",
      description: task?.description || "",
      userId: task?.user?._id || task?.userId || "",
      priority: task?.priority || "",
      startDate: task?.startDate ? String(task.startDate).split("T")[0] : "",
      endDate: task?.endDate ? String(task.endDate).split("T")[0] : "",
    });
    setFile(null);
    setPreview(null);
  };

  const [users, setUsers] = useState([]);
  const userMap = useMemo(() => {
    const map = new Map();
    if (!Array.isArray(users)) return map;
    users.forEach((u) => {
      if (!u?._id) return;
      map.set(String(u._id), u);
    });
    return map;
  }, [users]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    userId: "",
    status: "",
    priority: "",
    startDate: "",
    endDate: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileKey, setFileKey] = useState(Date.now());

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Tasks list
  const [tasks, setTasks] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [visibleCount, setVisibleCount] = useState(7);

  useEffect(() => {
    setVisibleCount(7);
  }, [id]);


  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${apiBase}/tasks`);
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.log(e);
      setTasks([]);
    }
  };

  // Fetch users + prefill task if editing
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    };

    const fetchTaskForEdit = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`${apiBase}/tasks/${id}`);
        const task = res.data?.task || res.data;
        handlePrefillFromTask(task);

        // Prefill preview for existing uploaded file (optional)
        const existingUrl = task?.file?.url;
        if (existingUrl) {
          const name = task?.file?.originalName || "Task File";
          const mimeType = task?.file?.mimeType || "";
          setPreview({
            url: existingUrl,
            type: mimeType || "application/octet-stream",
            name,
          });
        }

        setMessage("");
        setError("");
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
    fetchTaskForEdit();
  }, [id]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeImage = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview({
      url: URL.createObjectURL(selectedFile),
      type: selectedFile.type,
      name: selectedFile.name,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      userId: "",
      priority: "",
      startDate: "",
      endDate: "",
    });
    setFile(null);
    setPreview(null);
    setFileKey(Date.now());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // UPDATE mode
    if (editingId) {
      try {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("userId", formData.userId);
        data.append("priority", formData.priority);
        data.append("startDate", formData.startDate);
        data.append("endDate", formData.endDate);

        if (file) {
          data.append("file", file);
        }

        await axios.put(`${apiBase}/tasks/${editingId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage("Task Updated");
        setError("");
        resetForm();
        fetchTasks();
      } catch (error) {
        console.log(error);
        setError(error.response?.data?.message || "Something went wrong");
      }
      return;
    }

    // CREATE mode
    setError("");
    setMessage("");

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("End date must be after start date");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("userId", formData.userId);
      data.append("priority", formData.priority);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);

      if (file) {
        data.append("file", file);
      }

      const res = await axios.post(`${apiBase}/tasks/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message || "Task Created");
      setError("");
      resetForm();
      fetchTasks();
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${apiBase}/tasks/${taskId}`);
      alert("Task Deleted");
      fetchTasks();
    } catch (e) {
      console.log(e);
      alert(e.response?.data?.message || "Failed to delete task");
    }
  };

  const editTask = (task) => {
    setEditingId(task._id || task.id);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      userId: task.user?._id || task.userId || "",
      priority: task.priority || "",
      startDate: task.startDate ? String(task.startDate).split("T")[0] : "",
      endDate: task.endDate ? String(task.endDate).split("T")[0] : "",
    });
    setFile(null);
    setPreview(null);
    setFileKey(Date.now());
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Page Header Start */}
            <div className="container-fluid page-header py-5">
              <div className="container text-center py-5">
                <h1 className="display-2 text-white animated slideInDown">
                  Assign Tasks
                </h1>
                <nav aria-label="breadcrumb animated slideInDown">
                  <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item">
                      <Link to={'/'}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      Assign Tasks
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            {/* Page Header End */}

      <div className="container-fluid">
        <div className="container py-5">
          <div
            className="text-center mx-auto pb-5 wow fadeIn"
            data-wow-delay=".3s"
            style={{ maxWidth: 600 }}
          >
            <h1 className="mb-3">Welcome Admin</h1>
          </div>

          <div className="contact-detail position-relative p-4 p-md-5">
            <div className="row g-5">
              <div className="col-lg-6 wow fadeIn" data-wow-delay=".5s" style={{ marginLeft: "25%" }}>
                {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

                {preview && (
                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    {preview.type?.startsWith("image") && (
                      <img
                        src={preview.url}
                        alt="Preview"
                        style={{ width: "70%", height: "70%", objectFit: "cover", borderRadius: "10px" }}
                      />
                    )}

                    {preview.type === "application/pdf" && (
                      <iframe
                        src={preview.url}
                        title="PDF Preview"
                        width="100%"
                        height="400px"
                      />
                    )}

                    {!preview.type?.startsWith("image") && preview.type !== "application/pdf" && <p>{preview.name}</p>}
                  </div>
                )}

                <form className="p-4 p-md-5 rounded contact-form" onSubmit={handleSubmit}>
                  <div className="mb-4 rounded-xl">
                    <input
                      className="form-control border-0 py-3"
                      type="text"
                      name="title"
                      placeholder="Task Title"
                      value={formData.title}
                      onChange={handleChange}
                      required={!editingId}
                    />
                  </div>

                  <div className="mb-4 rounded-xl">
                    <textarea
                      className="form-control border-0 py-3"
                      name="description"
                      placeholder="Task Description"
                      value={formData.description}
                      onChange={handleChange}
                      required={!editingId}
                    />
                  </div>

                  <div className="mb-4 rounded-xl">
                    <select
                      className="form-control border-0 py-3"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      required={!editingId}
                    >
                      <option value="">Select User</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4 rounded-xl">
                    <select
                      className="form-control border-0 py-3"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required={!editingId}
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>

                  <div className="mb-4 rounded-xl">
                    <select
                      className="form-control border-0 py-3"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      required={!editingId}
                    >
                      <option value="">Select Priority</option>
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                    </select>
                  </div>

                  <div className="mb-4 rounded-xl">
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required={!editingId}
                      className="form-control border-0 py-3"
                    />
                  </div>

                  <div className="mb-4 rounded-xl">
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required={!editingId}
                      className="form-control border-0 py-3"
                    />
                  </div>

                  <div className="mb-4 rounded-xl">
                    <input key={fileKey} type="file" onChange={handleChangeImage} />
                    <small className="text-white-50">Upload file (optional when updating)</small>
                  </div>

                  <div className="text-start">
                    <button
                      className="w-full inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-900 to-fuchsia-700 px-16 py-3 text-white font-semibold shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-70"
                      type="submit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                      >
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                      {editingId ? "Update Task" : "Assign Task"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-5">
        <div className="container">
          <h2 className="mb-3">All Assigned Tasks</h2>

          {tasks.length === 0 ? (
            <p className="text-center">No tasks found.</p>
          ) : (
            <>
              <div className="row">
                {tasks.slice(0, visibleCount).map((task) => {
                  const fileUrl =
                    task?.file?.url ||
                    task?.file?.path ||
                    (typeof task?.file === "string"
                      ? task.file.startsWith("http")
                        ? task.file
                        : `http://localhost:5000/uploads/${task.file}`
                      : null);

                  const isImage = fileUrl ? /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(fileUrl) : false;

                  return (
                    <div className="col-md-4 mb-3" key={task._id || task.id}>
                      <div className="card shadow p-3 h-100 mb-4">
                        <h3>{task.title}</h3>
                        <p className="text-2xl text-purple-900">{task.description}</p>

                        {/* ASSIGNED USER */}
                        {(() => {
                          const assignedId =
                            task?.user?._id || task?.userId || task?.user;
                          const assignedUser =
                            assignedId && userMap.get(String(assignedId));

                          if (!assignedUser) return null;

                          return (
                            <p>
                              <strong className="text-black">Assigned To:</strong> {assignedUser.name} ({assignedUser.email})
                            </p>
                          );
                        })()}

                        <div className="d-flex flex-column gap-1">
                          <p>
                            <strong className="text-black">Status:</strong> {task.status || ""}
                          </p>
                          <p>
                            <strong className="text-black">Priority:</strong> {task.priority}
                          </p>
                        </div>

                        <p>
                          <strong className="text-black">Start Date:</strong>{" "}
                          {task.startDate ? new Date(task.startDate).toLocaleDateString() : "N/A"}
                        </p>
                        <p>
                          <strong className="text-black">End Date:</strong>{" "}
                          {task.endDate ? new Date(task.endDate).toLocaleDateString() : "N/A"}
                        </p>

                        {fileUrl && (
                          <div className="mt-3">
                            <h6>File</h6>
                            {isImage ? (
                              <img
                                src={fileUrl}
                                alt={task.file?.originalName || "Task file"}
                                className="w-100 mb-4"
                                style={{ maxHeight: 140, objectFit: "cover", cursor: "pointer" }}
                                onClick={() => setModalImage(fileUrl)}
                              />
                            ) : (
                              <a href={fileUrl} target="_blank" rel="noreferrer">
                                {task.file?.originalName || "Open File"}
                              </a>
                            )}
                          </div>
                        )}

                        {/* BUTTONS (like Notes.jsx) */}
                        <div className="flex items-center gap-3 mt-4">
                          <button
                            className="group inline-flex items-center justify-center rounded-xl px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-cyan-300"
                            onClick={() => editTask(task)}
                            aria-label={`Edit ${task.title}`}
                            type="button"
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
                            Update
                          </button>

                          <button
                            className="group inline-flex items-center justify-center rounded-xl px-4 py-2 bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-rose-300"
                            onClick={() => {
                              if (!window.confirm("Delete this task?")) return;
                              deleteTask(task._id || task.id);
                            }}
                            aria-label={`Delete ${task.title}`}
                            type="button"
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
                      </div>
                    </div>
                  );
                })}
              </div>

              {visibleCount < tasks.length && (
                <div className="text-center mt-6">
                  <button
                    type="button"
                    className="group inline-flex items-center justify-center rounded-2xl px-8 py-3 bg-gradient-to-r from-purple-900 to-fuchsia-700 text-white font-semibold shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-purple-300"
                    onClick={() => setVisibleCount((prev) => prev + 7)}
                  >
                    Show more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 ml-2 opacity-95 group-hover:opacity-100"
                    >
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <button
            type="button"
            onClick={() => setModalImage(null)}
            className="absolute top-4 right-4 z-50 rounded-full bg-white/90 px-4 py-2 text-xl font-bold text-black"
          >
            ×
          </button>
          <img
            src={modalImage}
            alt="Task Image Preview"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

