import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import UpdateModal from "./UpdateModal";
import { Link } from "react-router-dom";

const formatDate = (d) => {
  if (!d) return "N/A";
  try {
    return new Date(d).toDateString();
  } catch {
    return "N/A";
  }
};

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filters
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // Pending | In Progress | Completed | Overdue (based on my member status)
  const [priorityFilter, setPriorityFilter] = useState("All"); // High | Medium | Low (based on project.priority)


  const user = useMemo(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const fetchProjects = async () => {
    if (!user?._id) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/projects/user/${user._id}`
      );

      setProjects(
        Array.isArray(res.data?.projects) ? res.data.projects : []
      );
    } catch (error) {
      console.log(error);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const filteredProjects = useMemo(() => {
    const kw = String(keyword || "").trim().toLowerCase();

    return projects.filter((project) => {
      const currentMember = project.team?.find((m) => m.user?._id === user?._id);
      const memberStatus = currentMember?.status || "Pending";

      const matchesStatus =
        statusFilter === "All" ? true : (() => {
          const f = String(statusFilter).toLowerCase();
          const normalized = String(memberStatus)
            .toLowerCase()
            .replaceAll("_", " ")
            .replaceAll("-", " ")
            .replace(/\s+/g, " ")
            .trim();
          return normalized === f;
        })();

      const p = String(project?.priority ?? "").toLowerCase();
      const matchesPriority =
        priorityFilter === "All" ? true : p === String(priorityFilter).toLowerCase();

      const matchesKeyword =
        !kw
          ? true
          : [project?.title, project?.description, memberStatus, project?.priority]
              .filter(Boolean)
              .some((v) => String(v).toLowerCase().includes(kw));

      return matchesStatus && matchesPriority && matchesKeyword;
    });
  }, [projects, keyword, statusFilter, priorityFilter, user?._id]);

  return (
    <>
    {/* Page Header Start */}
          <div className="container-fluid page-header py-5">

            <div className="container text-center py-5">
              <h1 className="display-2 text-white animated slideInDown">
                Projects
              </h1>
              <nav aria-label="breadcrumb animated slideInDown">
                <ol className="breadcrumb justify-content-center mb-0">
                  <li className="breadcrumb-item">
                    <Link to={'/'}>Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Projects
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* Page Header End */}
    <div className="w-full py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">My Projects</h2>
          <p className="mt-1 text-sm text-slate-600">View project details and update status.</p>
        </div>

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

        {filteredProjects.length === 0 ? (

          <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10">
            <p className="text-base font-medium text-slate-700">
              No Projects Found
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {

              const projectId = project._id || project.id;
              const currentMember = project.team?.find(
                (m) => m.user?._id === user?._id
              );
              const memberStatus =
                currentMember?.status || "Pending";
              const files = Array.isArray(project.files) ? project.files : [];
              const firstImageFile = files.find(
                (f) => f?.mimeType?.startsWith("image/") && (f?.url || f?.path)
              );

              return (
                <div
                  key={projectId}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedItem(project);
                    setModalOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedItem(project);
                      setModalOpen(true);
                    }
                  }}
                  className="cursor-pointer overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm mb-4"
                >
                  {/* MEDIA */}
                  <div className="relative h-44 w-full bg-slate-100">
                    {firstImageFile?.url ? (
                      <img
                        src={firstImageFile.url}
                        alt="Project file preview"
                        className="h-full w-full object-cover"
                        onClick={(e) => {
                          e.stopPropagation();
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
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${memberStatus === "Completed"
                        ? "bg-green-500"
                        : memberStatus === "In Progress"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                        }`}
                    >
                      {memberStatus}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-slate-800">
                      {project.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="mt-4 space-y-1 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold">Start:</span>{" "}
                        {formatDate(project.startDate)}
                      </p>
                      <p>
                        <span className="font-semibold">End:</span>{" "}
                        {formatDate(project.endDate)}
                      </p>
                    </div>

                    {/* FILES */}
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-slate-800">Files</p>

                      {files.length ? (
                        <div className="mt-2 space-y-2">
                          {files
                            .filter((f) => !f?.mimeType?.startsWith("image/"))
                            .slice(0, 2)
                            .map((f, idx) => (
                              <a
                                key={idx}
                                href={f.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center !rounded-md bg-purple-900 px-16 py-3 text-white font-semibold shadow-sm hover:bg-purple-800 disabled:opacity-70"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Open File
                              </a>
                            ))}

                          {/* If only images exist, show a small note */}
                          {files.filter((f) => f?.mimeType?.startsWith("image/")).length > 0 &&
                            files.filter((f) => !f?.mimeType?.startsWith("image/")).length === 0 && (
                              <p className="text-xs text-slate-500">Images attached</p>
                            )}

                          {/* If there are multiple files, show count */}
                          {files.length > 2 && (
                            <p className="text-xs text-slate-500">+{files.length - 2} more</p>
                          )}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-slate-500">No files</p>
                      )}
                    </div>

                    {/* TEAM */}
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-slate-800">Team Members</p>
                      {Array.isArray(project.team) && project.team.length ? (
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                          {project.team.slice(0, 3).map((member) => (
                            <li key={member._id || member.id}>{member.name}</li>
                          ))}
                          {project.team.length > 3 && (
                            <li className="text-xs text-slate-500">
                              +{project.team.length - 3} more
                            </li>
                          )}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-slate-500">No members</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <UpdateModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        mode="project"
        item={selectedItem}
      />
    </div>
    </>
  );
}


