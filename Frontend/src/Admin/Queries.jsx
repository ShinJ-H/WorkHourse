import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Queries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiBase = "http://192.168.29.34:5000";

  useEffect(() => {
    const fetchQueries = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${apiBase}/api/queries`);
        setQueries(res.data || []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load queries"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const sortedQueries = useMemo(() => {
    return [...queries].sort((a, b) => {
      const ad = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bd = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bd - ad;
    });
  }, [queries]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this query?")) return;
    await axios.delete(`${apiBase}/api/queries/${id}`);
    setQueries((prev) => prev.filter((q) => q._id !== id));
  };

  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white animated slideInDown">Queries</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item" aria-current="page">
                Queries
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Incoming Queries</h2>
            <p className="text-gray-600 mt-1">
              {loading
                ? "Loading..."
                : sortedQueries.length
                ? `${sortedQueries.length} query(s) received`
                : "No queries yet"}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        ) : sortedQueries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <span className="text-gray-500">?</span>
            </div>
            <p className="text-gray-700 font-medium">No queries to show</p>
            <p className="text-gray-500 text-sm mt-1">When users submit the form, they’ll appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Query Name</th>
                    <th className="px-5 py-3 font-semibold">Message</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {sortedQueries.map((q) => (
                    <tr key={q._id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-4">
                        <span className="font-medium text-gray-900">{q.name}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-gray-700">{q.email}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-gray-800">
                          {q.project || "-"}
                        </span>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <div className="truncate text-gray-700" title={q.message}>
                          {q.message}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {q.createdAt ? new Date(q.createdAt).toLocaleString() : "-"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDelete(q._id)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

