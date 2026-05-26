import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export default function ManagerTasks() {
  const [tasks, setTasks] = useState([]);
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

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    userId: "",
    priority: "",
    startDate: "",
    endDate: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [fileKey, setFileKey] = useState(Date.now());

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [visibleCount, setVisibleCount] = useState(7);

  const apiBase = "http://localhost:5000/api";

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${apiBase}/tasks`);
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.log(e);
      setTasks([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${apiBase}/users`);
      setUsers(
        Array.isArray(res.data.users)
          ? res.data.users
          : Array.isArray(res.data)
            ? res.data
            : []
      );
    } catch (e) {
      console.log(e);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeFile = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview({
      url: URL.createObjectURL(selected),
      type: selected.type,
      name: selected.name,
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      userId: "",
      priority: "",
      startDate: "",
      endDate: "",
    });
    setFile(null);
    setPreview(null);
    setEditingId(null);
    setFileKey(Date.now());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (form.startDate && form.endDate) {
      if (new Date(form.startDate) > new Date(form.endDate)) {
        setError("End date must be after start date");
        return;
      }
    }

    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("userId", form.userId);
      payload.append("priority", form.priority);
      payload.append("startDate", form.startDate);
      payload.append("endDate", form.endDate);

      if (file) {
        payload.append("file", file);
      }

      if (editingId) {
        await axios.put(`${apiBase}/tasks/${editingId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Task Updated");
      } else {
        await axios.post(`${apiBase}/tasks/create`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Task Assigned");
      }

      resetForm();
      fetchTasks();
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Something went wrong");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${apiBase}/tasks/${id}`);
      alert("Task Deleted");
      fetchTasks();
    } catch (e) {
      console.log(e);
      alert(e.response?.data?.message || "Failed to delete task");
    }
  };

  const editTask = (task) => {
    setEditingId(task._id);

    setForm({
      title: task.title || "",
      description: task.description || "",
      userId: task.user?._id || task.user || task.userId || "",
      priority: task.priority || "",
      startDate: task.startDate ? String(task.startDate).split("T")[0] : "",
      endDate: task.endDate ? String(task.endDate).split("T")[0] : "",
    });

    setFile(null);
    setPreview(null);
    setFileKey(Date.now());

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tasksSorted = useMemo(() => {
    return tasks;
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    return tasksSorted.slice(0, visibleCount);
  }, [tasksSorted, visibleCount]);


  return (
    <>
      <div className="container-fluid page-header py-5">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white mb-4 animated slideInDown">Assign Tasks</h1>
        </div>
      </div>

      <div className="container-fluid">
        <div className="container py-5">
          <div className="text-center mx-auto pb-5 wow fadeIn" data-wow-delay=".3s" style={{ maxWidth: 600 }}>
            <h1 className="mb-3">Welcome Manager</h1>
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
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}

                    {preview.type === "application/pdf" && (
                      <iframe src={preview.url} title="PDF Preview" width="100%" height="400px" />
                    )}

                    {!preview.type?.startsWith("image") && preview.type !== "application/pdf" && <p>{preview.name}</p>}
                  </div>
                )}

                <form className="p-4 p-md-5 rounded contact-form" onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="text-white">Task Title</label>
                    <input
                      className="form-control border-0 py-3"
                      type="text"
                      name="title"
                      placeholder="Task Title"
                      value={form.title}
                      onChange={handleChange}
                      required={!editingId}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-white">Task Description</label>
                    <textarea
                      className="form-control border-0 py-3"
                      name="description"
                      placeholder="Task Description"
                      value={form.description}
                      onChange={handleChange}
                      required={!editingId}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-white">Select User</label>
                    <select
                      className="form-control border-0 py-3"
                      name="userId"
                      value={form.userId}
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

                  <div className="mb-4">
                    <label className="text-white">Select Priority</label>
                    <select
                      className="form-control border-0 py-3"
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      required={!editingId}
                    >
                      <option value="">Select Priority</option>
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="text-white">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      required={!editingId}
                      className="form-control border-0 py-3"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-white">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      required={!editingId}
                      className="form-control border-0 py-3"
                    />
                  </div>

                  <div className="mb-4">
                    <input key={fileKey} type="file" onChange={handleChangeFile} className="form-control border-0 py-3" />
                    <small className="text-white-50">Upload file (optional when updating)</small>
                  </div>

                  <div className="text-start">
                    <button className="btn bg-primary text-white py-3 px-5" type="submit">
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
          <h2 className="mb-4">All Assigned Tasks</h2>

          {visibleTasks.length === 0 ? (
            <p className="text-center">No tasks found.</p>
          ) : (
            <div className="row">
            {visibleTasks.map((task) => {
              const fileUrl =
                  task?.file?.url ||
                  task?.file?.path ||
                  // if backend sends filename/string
                  (typeof task?.file === "string"
                    ? task.file.startsWith("http")
                      ? task.file
                      : `http://localhost:5000/uploads/${task.file}`
                    : null) ||
                  null;

              const isImage = fileUrl ? /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(fileUrl) : false;

              return (
                <div className="col-md-4 mb-4" key={task._id}>
                  <div className="card shadow p-3 h-100">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>

                    {/* ASSIGNED USER */}
                    {(() => {
                      const assignedId =
                        task?.user?._id || task?.userId || task?.user;
                      const assignedUser =
                        assignedId && userMap.get(String(assignedId));

                      if (!assignedUser) return null;

                      return (
                        <p>
                          <strong>Assigned To:</strong> {assignedUser.name} ({assignedUser.email})
                        </p>
                      );
                    })()}

                    <p>
                      <strong>Status:</strong> {task.status || ""}
                    </p>


                    <p>
                      <strong>Priority:</strong> {task.priority}
                    </p>

                    <p>
                      <strong>Start Date:</strong> {task.startDate ? new Date(task.startDate).toLocaleDateString() : "N/A"}
                    </p>

                    <p>
                      <strong>End Date:</strong> {task.endDate ? new Date(task.endDate).toLocaleDateString() : "N/A"}
                    </p>

                    {fileUrl && (
                      <div className="mt-3">
                        <h6>File</h6>
                        {isImage ? (
                          <img
                            src={fileUrl}
                            alt={task.file?.originalName || "Task file"}
                            className="w-100"
                            style={{ maxHeight: 140, objectFit: "cover", cursor: "pointer" }}
                            onClick={() => setModalImage(fileUrl)}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <a href={fileUrl} target="_blank" rel="noreferrer">
                            {task.file?.originalName || "Open File"}
                          </a>
                        )}
                      </div>
                    )}

                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-warning btn-sm" onClick={() => editTask(task)}>
                        Update
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

              {visibleCount < tasksSorted.length && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setVisibleCount((prev) => prev + 7)}
                  >
                    Show more
                  </button>
                </div>
              )}

            </div>
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
            ✕
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

