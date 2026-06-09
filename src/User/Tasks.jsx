import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import UpdateModal from "./UpdateModal";
import { Link } from "react-router-dom";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filters (like Admin search UX)
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // Pending | In Progress | Completed | Overdue
  const [priorityFilter, setPriorityFilter] = useState("All"); // High | Medium | Low


  const currentUser = useMemo(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://192.168.29.34:5000/api/tasks");
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!currentUser?._id) return [];

    const kw = String(keyword || "").trim().toLowerCase();

    return tasks
      .filter((task) => {
        // Backend stores `user` field as a userId (not necessarily populated)
        const assignedId = task?.user?._id || task?.userId || task?.user;
        return assignedId && String(assignedId) === String(currentUser._id);
      })
      .filter((task) => {
        const s = String(task?.status ?? "").toLowerCase();
        const matchesStatus =
          statusFilter === "All" ? true : (() => {
            const f = String(statusFilter).toLowerCase();
            // normalize a bit
            const normalized = s
              .replaceAll("_", " ")
              .replaceAll("-", " ")
              .replace(/\s+/g, " ")
              .trim();
            return normalized === f;
          })();

        const p = String(task?.priority ?? "").toLowerCase();
        const matchesPriority =
          priorityFilter === "All" ? true : p === String(priorityFilter).toLowerCase();

        const matchesKeyword =
          !kw
            ? true
            : [task?.title, task?.description, task?.status, task?.priority]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(kw));

        return matchesStatus && matchesPriority && matchesKeyword;
      });
  }, [tasks, currentUser?._id, keyword, statusFilter, priorityFilter]);



  useEffect(() => {
    fetchTasks();

    const interval = setInterval(fetchTasks, 3000);

    return () => clearInterval(interval);
  }, [currentUser?._id]);


  return (
<>
{/* Page Header Start */}
      <div className="container-fluid page-header py-5">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white animated slideInDown">
            Tasks
          </h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item">
                <Link to={'/'}>Home</Link>
              </li>
              <li className="breadcrumb-item" aria-current="page">
                Tasks
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}
    <div className="w-full py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Search/Filter Bar */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="md:col-span-1">
              <input
                className="form-control border-0 py-3"
                type="text"
                placeholder="Search keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div>
              <select
                className="form-control border-0 py-3"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div>
              <select
                className="form-control border-0 py-3"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                className="btn btn-outline-dark w-full"
                onClick={() => {
                  setKeyword("");
                  setStatusFilter("All");
                  setPriorityFilter("All");
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {filteredTasks.length === 0 ? (


          <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10">
            <p className="text-base font-medium text-slate-700">
              No Tasks Found
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => {
              const taskId = task._id || task.id;
              const isImage =
                task.file?.url &&
                task.file.url.match(/\.(jpg|jpeg|png|webp)$/i);
              return (
                <div
                  key={taskId}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedItem(task);
                    setModalOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedItem(task);
                      setModalOpen(true);
                    }
                  }}
                  className="cursor-pointer overflow-hidden rounded-2xl mb-4 border-slate-200 bg-white shadow-sm"
                >

                  {/* IMAGE */}
                  <div className="relative h-44 w-full bg-slate-100">

                    {isImage ? (
                      <img
                        src={task.file.url}
                        alt=""
                        className="h-full w-full cursor-pointer object-cover"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(task.file.url);
                        }}
                      />
                    ) : ( 
                      <div className="flex h-full items-center justify-center">
                        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center">
                          <p className="text-sm font-semibold text-slate-700">
                            Document
                          </p>
                        </div>
                      </div>
                    )}

                    {/* STATUS */}
                    <span
                      className={(() => {
                        const s = String(task.status ?? "").toLowerCase();
                        if (s === "pending") return "absolute right-3 top-3 rounded-full bg-yellow-600 px-3 py-1 text-xs font-semibold text-white";
                        if (s === "in progress" || s === "in_progress" || s === "in-progress") return "absolute right-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white";
                        if (s === "complete" || s === "completed") return "absolute right-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white";
                        if (s === "overdue") return "absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white";
                        return "absolute right-3 top-3 rounded-full bg-purple-900 px-3 py-1 text-xs font-semibold text-white";
                      })()}
                    >
                      {task.status}
                    </span>
                  </div>
                  {/* CONTENT */}
                  <div className="p-4">

                    {/* TITLE */}
                    <h3 className="text-lg font-bold text-slate-800">
                      {task.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="mt-2 text-sm text-slate-600">
                      {task.description}
                    </p>

                    {/* DETAILS */}
                    <div className="mt-4 space-y-1 text-sm text-slate-600">

                      <p>
                        <span className="font-semibold">
                          Priority:
                        </span>{" "}
                        {task.priority}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Start:
                        </span>{" "}
                        {task.startDate
                          ? new Date(task.startDate).toDateString()
                          : "N/A"}
                      </p>

                      <p>
                        <span className="font-semibold">
                          End:
                        </span>{" "}
                        {task.endDate
                          ? new Date(task.endDate).toDateString()
                          : "N/A"}
                      </p>

                    </div>

                    {/* FILE BUTTON */}
                    {task.file?.url && !isImage && (
                      <a
                        href={task.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex w-full items-center justify-center rounded-lg bg-purple-900 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Open File
                      </a>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >

          <button
            type="button"
            className="absolute right-6 top-6 text-4xl text-white"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>

          <img
            src={selectedImage}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

        </div>
      )}

      <UpdateModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        mode="task"
        item={selectedItem}
      />
    </div>
    </>
  );
};

export default Tasks;
