import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ManagerProjects() {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "Pending",
        priority: "Low",
        team: [],
        files: [],
    });
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Pending":
                return "bg-warning text-dark";
            case "In Progress":
                return "bg-info text-dark";
            case "Completed":
                return "bg-success";
            case "Overdue":
                return "bg-danger";
            default:
                return "bg-primary";
        }
    };
    const normalizeStatus = (status) => {
        if (["Low", "Medium", "High"].includes(status)) {
            return "Pending";
        }
        return status || "Pending";
    };
    const normalizePriority = (priority, status) => {
        if (priority) return priority;
        if (["Low", "Medium", "High"].includes(status)) return status;
        return "Low";
    };

    const getTeamMemberName = (member) => {
        return (
            member?.user?.name ||
            member?.name ||
            member?.user?.email ||
            member?.email ||
            member?.user?._id ||
            member?._id ||
            "Unknown"
        );
    };

    // FETCH PROJECTS
    const fetchProjects = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/projects"
            );
            setProjects(res.data.projects || []);
        } catch (error) {
            console.log(error);
        }
    };
    // FETCH USERS
    const fetchUsers = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/users"
            );
            setUsers(
                Array.isArray(res.data.users)
                    ? res.data.users
                    : Array.isArray(res.data)
                        ? res.data
                        : []
            );
        } catch (error) {
            console.log(error);
            setUsers([]);
        }
    };
    useEffect(() => {

        fetchProjects();

        fetchUsers();

    }, []);
    // HANDLE INPUT
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
    // CREATE OR UPDATE PROJECT
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            payload.append("title", form.title);
            payload.append("description", form.description);
            payload.append("startDate", form.startDate);
            payload.append("endDate", form.endDate);
            payload.append("status", form.status);
            payload.append("priority", form.priority);
            form.team.forEach((id) => {
                payload.append("team", id);
            });
            if (Array.isArray(form.files)) {
                form.files.forEach((file) => {
                    payload.append("files", file);
                });
            }
            // UPDATE
            if (editingId) {
                await axios.put(
                    `http://localhost:5000/api/projects/${editingId}`,
                    payload,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );
                alert("Project Updated");
                window.dispatchEvent(new Event("projectUpdated"));
            }
            // CREATE
            else {
                await axios.post(
                    "http://localhost:5000/api/projects/create",
                    payload,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );
                alert("Project Created");
                window.dispatchEvent(new Event("projectUpdated"));
            }
            // RESET FORM
            setForm({
                title: "",
                description: "",
                startDate: "",
                endDate: "",
                status: "Pending",
                priority: "Low",
                team: [],
                files: [],
            });
            setEditingId(null);
            fetchProjects();
        } catch (error) {
            console.log(error);
        }
    };
    // DELETE PROJECT
    const deleteProject = async (id) => {
        try {
            if (!window.confirm("Delete this project?")) return;
            await axios.delete(
                `http://localhost:5000/api/projects/${id}`
            );
            alert("Project Deleted");
            window.dispatchEvent(new Event("projectUpdated"));
            fetchProjects();
        } catch (error) {
            console.log(error);
        }
    };
    // EDIT PROJECT
    const editProject = (project) => {
        setEditingId(project._id);
        const projectStatus = normalizeStatus(project.status);
        const projectPriority = normalizePriority(project.priority, project.status);
        setForm({
            title: project.title || "",
            description: project.description || "",
            startDate: project.startDate
                ? project.startDate.split("T")[0]
                : "",
            endDate: project.endDate
                ? project.endDate.split("T")[0]
                : "",
            status: projectStatus,
            priority: projectPriority,
            team:
                project.team?.map(
                    (member) => member.user?._id || member._id
                ) || [],
            files: [],
        });
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    return (
        <>
        {/* Page Header Start */}
            <div className="container-fluid page-header py-5">
              <div className="container text-center py-5">
                <h1 className="display-2 text-white animated slideInDown">
                  Manager Projects
                </h1>
                <nav aria-label="breadcrumb animated slideInDown">
                  <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item">
                      <Link to={'/'}>Manager Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      Manager Projects
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            {/* Page Header End */}
            <div className="container mt-4">
                {/* FORM */}
                <div className="card shadow p-4 mb-5 mb-4">
                    <h2 className="mb-3">
                        {editingId
                            ? "Update Project"
                            : "Create Project Team"}

                    </h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Project Title"
                            className="form-control mb-4"
                            value={form.title}
                            onChange={handleChange}
                        />
                        <textarea
                            name="description"
                            placeholder="Project Description"
                            className="form-control mb-4"
                            value={form.description}
                            onChange={handleChange}
                        />
                        <input
                            type="date"
                            name="startDate"
                            className="form-control mb-4"
                            value={form.startDate}
                            onChange={handleChange}
                        />
                        <input
                            type="date"
                            name="endDate"
                            className="form-control mb-4"
                            value={form.endDate}
                            onChange={handleChange}
                        />
                        <input
                            type="file"
                            className="form-control mb-4"
                            multiple
                            onChange={(e) => {
                                const selected =
                                    Array.from(
                                        e.target.files || []
                                    );
                                setForm((prev) => ({
                                    ...prev,
                                    files: selected,
                                }));
                            }}
                        />
                        <label className="form-label">Priority</label>
                        <select
                            name="priority"
                            className="form-control mb-4"
                            value={form.priority}
                            onChange={handleChange}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <label className="form-label">Status</label>
                        <select
                            name="status"
                            className="form-control mb-4"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                        {/* TEAM */}
                        <div className="dropdown mb-3">
                            <button
                                className="btn btn-outline-dark dropdown-toggle w-100 text-start"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                Select Team Members
                            </button>
                            <ul
                                className="dropdown-menu w-100 p-3"
                                style={{
                                    maxHeight: "250px",
                                    overflowY: "auto",
                                }}
                            >
                                {Array.isArray(users) &&
                                    users.map((user) => (
                                        <li
                                            key={user._id}
                                            className="mb-2"
                                        >
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={form.team.includes(
                                                        user._id
                                                    )}
                                                    onChange={(e) => {
                                                        if (
                                                            e.target.checked
                                                        ) {
                                                            setForm(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    team: [
                                                                        ...prev.team,
                                                                        user._id,
                                                                    ],
                                                                })
                                                            );
                                                        } else {
                                                            setForm(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    team:
                                                                        prev.team.filter(
                                                                            (
                                                                                id
                                                                            ) =>
                                                                                id !==
                                                                                user._id
                                                                        ),
                                                                })
                                                            );
                                                        }
                                                    }}
                                                />
                                                <label
                                                    className="form-check-label"
                                                >
                                                    {user.name} - {user.role}
                                                </label>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <button
                            type="submit"
                            className={`group w-100 inline-flex items-center justify-center rounded-2xl px-6 py-3 text-white font-semibold shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 ${
                                editingId
                                    ? "bg-gradient-to-r from-yellow-500 to-amber-600 focus:ring-yellow-300"
                                    : "bg-gradient-to-r from-purple-900 to-fuchsia-700 focus:ring-purple-300"
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-5 h-5 mr-2 opacity-95 group-hover:opacity-100"
                                aria-hidden="true"
                            >
                                {editingId ? (
                                    <path d="M12 20h9" />
                                ) : (
                                    <>
                                        <path d="M12 5v14" />
                                        <path d="M5 12h14" />
                                    </>
                                )}
                            </svg>
                            {editingId ? "Update Project" : "Create Team Project"}
                        </button>
                    </form>
                </div>
                {/* ALL PROJECTS */}
                <h2 className="mb-3">
                    All Team Projects
                </h2>
                <div className="row">
                    {projects.map((project) => (
                        <div
                            className="col-md-4 mb-3"
                            key={project._id}
                        >
                            <div className="card shadow p-3 h-100 mb-4">
                                <h3>
                                    {project.title}
                                </h3>
                                <p className="text-2xl text-purple-900">
                                    {project.description}
                                </p>
                                {/* STATUS + PRIORITY BADGE */}
                                {
                                    (() => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const endDate = new Date(project.endDate);
                                        endDate.setHours(0, 0, 0, 0);
                                        const allCompleted =
                                            project.team?.length > 0 &&
                                            project.team.every(
                                                (member) => member.status === "Completed"
                                            );
                                        const anyInProgress =
                                            project.team?.some(
                                                (member) => member.status === "In Progress"
                                            );
                                        let finalStatus = "Pending";
                                        // COMPLETED
                                        if (allCompleted) {
                                            finalStatus = "Completed";
                                        }
                                        // IN PROGRESS
                                        else if (anyInProgress) {

                                            finalStatus = "In Progress";
                                        }
                                        // OVERDUE
                                        else if (
                                            project.endDate &&
                                            endDate < today &&
                                            !allCompleted
                                        ) {
                                            finalStatus = "Overdue";
                                        }
                                        return (
                                            <div className="d-flex align-items-center gap-2 mt-2">
                                                <span
                                                    className={`badge rounded-pill ${getStatusBadgeClass(finalStatus)}`}
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        padding: "0.5rem 0.75rem",
                                                    }}
                                                >
                                                    Status: {finalStatus}
                                                </span>
                                                <span
                                                    className="badge rounded-pill bg-light text-dark border"
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        padding: "0.5rem 0.75rem",
                                                    }}
                                                >
                                                    Priority: {project.priority}
                                                </span>
                                            </div>
                                        );
                                    })()
                                }
                                <p>
                                    <strong className="text-black">Start Date:</strong>{" "}
                                    {project.startDate
                                        ? new Date(
                                            project.startDate
                                        ).toLocaleDateString()
                                        : "N/A"}
                                </p>
                                <p>
                                    <strong className="text-black">End Date:</strong>{" "}
                                    {project.endDate
                                        ? new Date(
                                            project.endDate
                                        ).toLocaleDateString()
                                        : "N/A"}
                                </p>
                                {/* FILES */}
                                <div className="mt-3">
                                    <h6>
                                        Files
                                    </h6>
                                    {project.files?.length ? (
                                        <ul className="ps-3 mb-4 rounded-xl">
                                            {project.files.map(
                                                (f, idx) => {
                                                    const isImage =
                                                        f.mimeType?.startsWith(
                                                            "image/"
                                                        );
                                                    return (
                                                        <li key={idx}>
                                                            {isImage ? (
                                                                <div>
                                                                    <div className="w-100 bg-light rounded overflow-hidden">
                                                                        <img
                                                                            src={f.url}
                                                                            alt={
                                                                                f.originalName ||
                                                                                "Uploaded file"
                                                                            }
                                                                            className="w-100 h-48 object-cover"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <a
                                                                            href={f.url}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                        >
                                                                            {f.originalName || "View"}
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <a
                                                                    href={f.url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    {f.originalName ||
                                                                        "File"}
                                                                </a>
                                                            )}
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="text-secondary">
                                            No files
                                        </p>
                                    )}
                                </div>
                                {/* TEAM */}
                                <h6 className="mt-3">
                                    Team Members
                                </h6>
                                <ul>
                                    {project.team?.map(
                                        (member) => (
                                            <li
                                                key={member.user?._id || member._id}
                                            >
                                                {getTeamMemberName(member)}
                                            </li>
                                        )
                                    )}
                                </ul>
                                {/* BUTTONS (like Notes.jsx) */}
                                <div className="flex items-center gap-3 mt-4">
                                    <button
                                        className="group inline-flex items-center justify-center rounded-xl px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-cyan-300"
                                        onClick={() => editProject(project)}
                                        aria-label={`Edit ${project.title}`}
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
                                        onClick={() => deleteProject(project._id)}
                                        aria-label={`Delete ${project.title}`}
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
                    ))}
                </div>
                {/* Load More Projects */}
                {projects.length > 9 && (
                    <div className="text-center mt-6">
                        <button
                            type="button"
                            className="group inline-flex items-center justify-center rounded-2xl px-8 py-3 bg-gradient-to-r from-purple-900 to-fuchsia-700 text-white font-semibold shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-purple-300"
                            onClick={() => {
                                // simple fallback: reload all projects (current UI already renders all)
                                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                            }}
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
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
