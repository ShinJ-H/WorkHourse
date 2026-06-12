import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ManagerDashboard() {
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({ users: 0, tasks: 0, projects: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      const usersRes = await axios.get("http://192.168.29.34:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tasksRes = await axios.get("http://192.168.29.34:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const projectsRes = await axios.get("http://192.168.29.34:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usersCount = usersRes.data?.length ?? 0;
      const tasksCount = tasksRes.data?.length ?? 0;
      const projectsCount = projectsRes.data?.projects?.length ?? 0;

      setSummary({ users: usersCount, tasks: tasksCount, projects: projectsCount });

      setChartData([
        { name: "Users", count: usersCount },
        { name: "Tasks", count: tasksCount },
        { name: "Projects", count: projectsCount },
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {/* Page Header Start */}
            <div className="container-fluid page-header py-5">
              <div className="container text-center py-5">
                <h1 className="display-2 text-white animated slideInDown">
                  Manager Dashboard
                </h1>
              </div>
            </div>
            {/* Page Header End */}
      <div className="container py-5">
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-2xl bg-white p-5 shadow border">
            <div className="flex items-center justify-between">
              <div className="text-slate-700 font-semibold">Users</div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-indigo-600" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{summary.users}</div>
            <div className="text-xs text-slate-500 mt-1">Total registered</div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow border">
            <div className="flex items-center justify-between">
              <div className="text-slate-700 font-semibold">Tasks</div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-600" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h14"/></svg>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{summary.tasks}</div>
            <div className="text-xs text-slate-500 mt-1">Assigned tasks</div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow border">
            <div className="flex items-center justify-between">
              <div className="text-slate-700 font-semibold">Projects</div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-purple-700" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h7"/></svg>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">{summary.projects}</div>
            <div className="text-xs text-slate-500 mt-1">Active teams</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-slate-900">Users, Tasks & Projects</h2>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 ring-1 ring-purple-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-purple-700" aria-hidden="true"><path d="M12 2v6"/><path d="M12 16v6"/><path d="M5 12H2"/><path d="M22 12h-3"/></svg>
              <span className="text-purple-700 text-sm font-semibold">Overview</span>
            </div>
          </div>

          <div style={{ width: "100%", height: 380 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#9100cad5" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  )
}


