import { useEffect, useState } from "react";
import axios from "axios";

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

  // ================= FETCH TASK STATS =================

  const fetchTaskStats = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/dashboard/task-status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTaskStats(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  // ================= FETCH PROJECT STATS =================

  const fetchProjectStats = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/dashboard/project-status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjectStats(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  // ================= LOAD DATA =================

  useEffect(() => {

    const loadData = async () => {

      setLoading(true);

      await fetchTaskStats();

      await fetchProjectStats();

      setLoading(false);
    };

    loadData();

    // AUTO REFRESH WHEN TASK UPDATED
    window.addEventListener(
      "taskUpdated",
      fetchTaskStats
    );

    // AUTO REFRESH WHEN PROJECT UPDATED
    window.addEventListener(
      "projectUpdated",
      fetchProjectStats
    );

    return () => {

      window.removeEventListener(
        "taskUpdated",
        fetchTaskStats
      );

      window.removeEventListener(
        "projectUpdated",
        fetchProjectStats
      );
    };

  }, []);

  // ================= LOADING =================

  if (loading) {

    return (
      <div className="p-6 text-center text-lg font-semibold">
        Loading Status Data...
      </div>
    );
  }

  return (

    <div className="grid gap-6 md:grid-cols-2">

      {/* ================= TASK STATUS ================= */}

      <div className="rounded-2xl bg-white p-6 shadow-lg border">

        <h2 className="mb-5 text-2xl font-bold text-slate-800">
          Task Status
        </h2>

        <div className="overflow-hidden rounded-xl border">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-4 py-3 text-left">
                  Status
                </th>

                <th className="px-4 py-3 text-left">
                  Count
                </th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-t">
                <td className="px-4 py-3 font-medium">
                  Pending
                </td>

                <td className="px-4 py-3">
                  {taskStats.pending}
                </td>
              </tr>

              <tr className="border-t">
                <td className="px-4 py-3 font-medium">
                  In Progress
                </td>

                <td className="px-4 py-3">
                  {taskStats.inProgress}
                </td>
              </tr>

              <tr className="border-t">
                <td className="px-4 py-3 font-medium">
                  Completed
                </td>

                <td className="px-4 py-3">
                  {taskStats.completed}
                </td>
              </tr>

              <tr className="border-t">
                <td className="px-4 py-3 font-medium text-red-600">
                  Overdue
                </td>

                <td className="px-4 py-3 text-red-600 font-bold">
                  {taskStats.overdue}
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= PROJECT STATUS ================= */}

      <div className="rounded-2xl bg-white p-6 shadow-lg border">

        <h2 className="mb-5 text-2xl font-bold text-slate-800">
          Project Status
        </h2>

        <div className="overflow-hidden rounded-xl border">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-4 py-3 text-left">
                  Status
                </th>

                <th className="px-4 py-3 text-left">
                  Count
                </th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-t">
                <td className="px-4 py-3 font-medium">
                  Pending
                </td>

                <td className="px-4 py-3">
                  {projectStats.pending}
                </td>
              </tr>

              <tr className="border-t">
                <td className="px-4 py-3 font-medium">
                  In Progress
                </td>

                <td className="px-4 py-3">
                  {projectStats.inProgress}
                </td>
              </tr>

              <tr className="border-t">
                <td className="px-4 py-3 font-medium">
                  Completed
                </td>

                <td className="px-4 py-3">
                  {projectStats.completed}
                </td>
              </tr>

              <tr className="border-t">
                <td className="px-4 py-3 font-medium text-red-600">
                  Overdue
                </td>

                <td className="px-4 py-3 text-red-600 font-bold">
                  {projectStats.overdue}
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}