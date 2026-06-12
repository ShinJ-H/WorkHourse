import axios from "axios";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalManagers: 0,
    totalTasks: 0,
    totalProjects: 0,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          "http://192.168.29.34:5000/api/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(res.data);
        setError("");
      } catch (err) {
        console.log(err);
        setError("Error fetching data");
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const usersManagersData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Managers", value: stats.totalManagers },
  ];

  const tasksProjectsData = [
    { name: "Tasks", value: stats.totalTasks },
    { name: "Projects", value: stats.totalProjects },
  ];

  const USERS_COLOR = "#36A2EB";
  const MANAGERS_COLOR = "#FF6384";
  const TASKS_COLOR = "#4CAF50";
  const PROJECTS_COLOR = "#8E44AD";



  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white animated slideInDown">
            Dashboard
          </h1>
        </div>
      </div>
      {/* Page Header End */}

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>
          {error}
        </p>
      )}

      {/* 🔥 Dashboard */}
      <div className="container py-5">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <h2 className="text-center md:text-left text-2xl font-extrabold text-slate-900">
            System Overview
          </h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 ring-1 ring-purple-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-purple-700" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h7"/></svg>
            <span className="text-sm font-semibold text-purple-900">Live</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-2xl bg-white p-5 shadow border">
            <div className="flex items-center justify-between">
              <div className="text-slate-700 font-semibold">Users</div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-600" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{stats.totalUsers}</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow border">
            <div className="flex items-center justify-between">
              <div className="text-slate-700 font-semibold">Managers</div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-pink-600" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{stats.totalManagers}</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow border">
            <div className="flex items-center justify-between">
              <div className="text-slate-700 font-semibold">Tasks</div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-600" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h14"/></svg>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{stats.totalTasks}</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow border">
            <div className="flex items-center justify-between">
              <div className="text-slate-700 font-semibold">Projects</div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-purple-700" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h7"/></svg>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{stats.totalProjects}</div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-start">
          <div className="rounded-2xl bg-white p-5 shadow border">
            <h3 className="text-center text-lg font-bold text-slate-900 mb-3">Users & Managers</h3>
            <div style={{ width: 360, maxWidth: "100%", margin: "0 auto" }}>
              <PieChart width={360} height={360}>
                <Pie
                  data={usersManagersData}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  dataKey="value"
                  label
                >
                  {usersManagersData.map((entry, index) => (
                    <Cell
                      key={`um-${index}`}
                      fill={index === 0 ? USERS_COLOR : MANAGERS_COLOR}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow border">
            <h3 className="text-center text-lg font-bold text-slate-900 mb-3">Tasks & Projects</h3>
            <div style={{ width: 360, maxWidth: "100%", margin: "0 auto" }}>
              <PieChart width={360} height={360}>
                <Pie
                  data={tasksProjectsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  dataKey="value"
                  label
                >
                  {tasksProjectsData.map((entry, index) => (
                    <Cell
                      key={`tp-${index}`}
                      fill={index === 0 ? TASKS_COLOR : PROJECTS_COLOR}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


