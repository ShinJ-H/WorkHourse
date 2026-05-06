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
    totalTasks: 0
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
  }, []);

  // ✅ Pie Data
  const data = [
    { name: "Users", value: stats.totalUsers },
    { name: "Managers", value: stats.totalManagers },
    { name: "Tasks", value: stats.totalTasks }
  ];

  const COLORS = ["#36A2EB", "#FF6384", "#4CAF50"];

  return (
    <>
      {/* Header */}
      <div className="container-fluid page-header py-5">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white">
            Admin Dashboard
          </h1>
        </div>
      </div>

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>
          {error}
        </p>
      )}

      {/* 🔥 Pie Chart */}
      <div className="container py-5">
        <h2 className="text-center mb-4">System Overview</h2>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={150}
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </>
  );
}