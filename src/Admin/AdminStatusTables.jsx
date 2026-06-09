import { useEffect, useState } from "react";
import axios from "axios";

const StatusTile = ({
  icon,
  title,
  subtitle,
  value,
  valueClassName,
  topBorder = false,
}) => {
  return (
    <div className={topBorder ? "p-4 border-t border-purple-100/60" : "p-4"}>
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-purple-100/60 text-slate-800">
            {icon}
          </span>
          <div>
            <div className="text-slate-900 font-semibold">{title}</div>
            <div className="text-xs text-slate-500">{subtitle}</div>
          </div>
        </div>
        <div className={valueClassName}>{value}</div>
      </div>
    </div>
  );
};

export default function AdminStatusTables() {
  const [taskStats, setTaskStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });

  const [projectStats, setProjectStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchTaskStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/dashboard/task-status",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTaskStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProjectStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/dashboard/project-status",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjectStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchTaskStats();
      await fetchProjectStats();
      setLoading(false);
    };

    loadData();

    window.addEventListener("taskUpdated", fetchTaskStats);
    window.addEventListener("projectUpdated", fetchProjectStats);

    return () => {
      window.removeEventListener("taskUpdated", fetchTaskStats);
      window.removeEventListener("projectUpdated", fetchProjectStats);
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-lg font-semibold">
        Loading Status Data...
      </div>
    );
  }

  const safeTaskStats = {
    pending: taskStats?.pending ?? 0,
    inProgress: taskStats?.inProgress ?? 0,
    completed: taskStats?.completed ?? 0,
    overdue: taskStats?.overdue ?? 0,
  };

  const safeProjectStats = {
    pending: projectStats?.pending ?? 0,
    inProgress: projectStats?.inProgress ?? 0,
    completed: projectStats?.completed ?? 0,
    overdue: projectStats?.overdue ?? 0,
  };

  // SVG icons (no emojis)
  const iconClock = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 mr-2 opacity-95 group-hover:opacity-100"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v5l3 2" />
    </svg>
  );

  const iconProgress = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 mr-2 opacity-95 group-hover:opacity-100"
      aria-hidden="true"
    >
      <path d="M12 2v6" />
      <path d="M12 16v6" />
      <path d="M5 12H2" />
      <path d="M22 12h-3" />
      <path d="M4.93 4.93l1.77 1.77" />
      <path d="M17.3 17.3l1.77 1.77" />
      <path d="M19.07 4.93l-1.77 1.77" />
      <path d="M6.7 17.3l-1.77 1.77" />
    </svg>
  );

  const iconCheck = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 mr-2 opacity-95 group-hover:opacity-100"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );

  const iconAlert = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 mr-2 opacity-95 group-hover:opacity-100"
      aria-hidden="true"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <div className="rounded-2xl bg-gradient-to-r from-purple-900/10 via-fuchsia-900/10 to-indigo-900/10 ring-1 ring-purple-200/60 p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Admin Overview</h2>
              <p className="text-slate-600 mt-1">Quick status snapshot for tasks and projects.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 ring-1 ring-purple-200/60 shadow-sm">
              <span className="text-2xl">✓</span>
              <span className="text-sm font-semibold text-purple-900">Live Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task status */}
      <div className="rounded-2xl bg-white p-6 shadow-lg border">
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="text-2xl font-bold text-slate-800">Task Status</h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 ring-1 ring-purple-100">
            <span className="text-purple-700 text-sm font-semibold">Live</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <div className="grid grid-cols-2 sm:grid-cols-2 divide-x divide-purple-100/60">
            <StatusTile
              icon={iconClock}
              title="Pending"
              subtitle="Queued tasks"
              value={safeTaskStats.pending}
              valueClassName="text-slate-900 font-extrabold text-lg"
            />
            <StatusTile
              icon={iconProgress}
              title="In Progress"
              subtitle="Actively being worked"
              value={safeTaskStats.inProgress}
              valueClassName="text-slate-900 font-bold text-lg"
            />
            <StatusTile
              icon={iconCheck}
              title="Completed"
              subtitle="Done & verified"
              value={safeTaskStats.completed}
              valueClassName="text-slate-900 font-bold text-lg"
              topBorder
            />
            <StatusTile
              icon={iconAlert}
              title="Overdue"
              subtitle="Needs attention"
              value={safeTaskStats.overdue}
              valueClassName="text-red-700 font-bold text-lg"
              topBorder
            />
          </div>
        </div>
      </div>

      {/* Project status */}
      <div className="rounded-2xl bg-white p-6 shadow-lg border">
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="text-2xl font-bold text-slate-800">Project Status</h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 ring-1 ring-purple-100">
            <span className="text-purple-700 text-sm font-semibold">Live</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <div className="grid grid-cols-2 sm:grid-cols-2 divide-x divide-purple-100/60">
            <StatusTile
              icon={iconClock}
              title="Pending"
              subtitle="Not started yet"
              value={safeProjectStats.pending}
              valueClassName="text-slate-900 font-extrabold text-lg"
            />
            <StatusTile
              icon={iconProgress}
              title="In Progress"
              subtitle="Currently active"
              value={safeProjectStats.inProgress}
              valueClassName="text-slate-900 font-bold text-lg"
            />
            <StatusTile
              icon={iconCheck}
              title="Completed"
              subtitle="Finished & closed"
              value={safeProjectStats.completed}
              valueClassName="text-slate-900 font-bold text-lg"
              topBorder
            />
            <StatusTile
              icon={iconAlert}
              title="Overdue"
              subtitle="Over deadline"
              value={safeProjectStats.overdue}
              valueClassName="text-red-700 font-bold text-lg"
              topBorder
            />
          </div>
        </div>
      </div>
    </div>
  );
}

