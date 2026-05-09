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

export default function ManageUsers() {

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      const token = JSON.parse(localStorage.getItem("user"))?.token;

      // Get users
      const usersRes = await axios.get(
        "http://localhost:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get tasks
      const tasksRes = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Graph data
      const data = [
        {
          name: "Users",
          count: usersRes.data.length,
        },
        {
          name: "Tasks",
          count: tasksRes.data.length,
        },
      ];

      setChartData(data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        Users & Tasks Count
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="count"
            fill="#3b82f6"
            radius={[5, 5, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}