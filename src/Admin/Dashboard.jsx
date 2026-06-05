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
          "http://localhost:5000/api/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setStats(res.data);

      } catch (err) {
        console.log(err);
        setError("Error fetching data");
      }
    };

    fetchStats();

    // Refresh stats every 3 seconds so the dashboard updates immediately
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);


  // ✅ Pie Data
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

      {/* 🔥 Pie Chart */}
      <div className="container py-5">
        <h2 className="text-center">System Overview</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            flexWrap: "wrap",
          }}
        >
          {/* Users vs Managers */}
          <div>
            <h3 style={{ textAlign: "center" }}>Users & Managers</h3>
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

          {/* Tasks vs Projects */}
          <div>
            <h3 style={{ textAlign: "center" }}>Tasks & Projects</h3>
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
    </>
  );
}


