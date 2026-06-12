import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(7);

  const nav = useNavigate();
  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://192.168.29.34:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://192.168.29.34:5000/api/users/${id}`);
      fetchUsers(); // refresh list
    } catch (err) {
      console.log(err);
    }
  };

  // Search filter
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Page Header Start */}
                  <div className="container-fluid page-header py-5">
                    <div className="container text-center py-5">
                      <h1 className="display-2 text-white animated slideInDown">
                        Users
                      </h1>
                      <nav aria-label="breadcrumb animated slideInDown">
                        <ol className="breadcrumb justify-content-center mb-0">
                          <li className="breadcrumb-item">
                            <Link to={'/'}>Dashboard</Link>
                          </li>
                          <li className="breadcrumb-item" aria-current="page">
                            Users
                          </li>
                        </ol>
                      </nav>
                    </div>
                  </div>
                  {/* Page Header End */}
      <div className="container py-5">
        <div className="p-4 p-md-1 rounded contact-form">

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-purple-900 opacity-80">
                </svg>
              </div>
              <input
                className="w-full form-control border-0 py-3 pl-12 pr-12 rounded-2xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                type="text"
                placeholder="Search users by email (type to filter)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search.trim() && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-800">{filteredUsers.slice(0, visible).length}</span> of <span className="font-semibold text-gray-800">{filteredUsers.length}</span>
            </div>
          </div>
        </div>
        {/* User List (Styled like manager side) */}
        <div className="overflow-x-auto rounded-3xl border border-purple-100 bg-gradient-to-b from-white to-purple-50/30 shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3 text-xs font-semibold text-purple-900">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-2xl bg-purple-100">🧠</span>
              <span>Admin Users • manage & audit</span>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-800 to-fuchsia-800 text-white">
              <tr className="text-left">
                <th className="px-5 py-4 text-sm font-semibold text-center">👤 Name</th>
                <th className="px-5 py-4 text-sm font-semibold text-center">✉️ Email</th>
                <th className="px-5 py-4 text-sm font-semibold text-center">🏷️ Role</th>
                <th className="px-5 py-4 text-sm font-semibold text-center">⚙️ Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/60">
              {filteredUsers.slice(0, visible).map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition text-center"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-purple-100 text-purple-900">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 truncate">{user.name || "—"}</div>
                        </div>
                      </div>
                  </td>
                  <td className="px-5 py-4 text-gray-700">
                    {user.email || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset ${
                        user.role === "Admin"
                          ? "bg-red-50 text-red-700 ring-red-200"
                          : user.role === "Manager"
                            ? "bg-yellow-50 text-yellow-800 ring-yellow-200"
                            : "bg-purple-50 text-purple-900 ring-purple-200"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                      {user.role || "User"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => nav(`/admin/edit-user/${user._id}`)}
                        className="group inline-flex items-center justify-center rounded-xl px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-cyan-300"
                        aria-label={`Edit ${user.name}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 mr-2 opacity-95 group-hover:opacity-100"
                        >
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        Update
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!window.confirm("Delete this user?")) return;
                          handleDelete(user._id);
                        }}
                        className="group inline-flex items-center justify-center rounded-xl px-4 py-2 bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-rose-300"
                        aria-label={`Delete ${user.name}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 mr-2 opacity-95 group-hover:opacity-100"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.slice(0, visible).length === 0 && (
                <tr className="border-t border-gray-100">
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        {/* Load More */}
        {visible < filteredUsers.length && (
          <div className="text-center mt-8">
            <button
              type="button"
              className="group inline-flex items-center justify-center rounded-2xl px-8 py-3 bg-gradient-to-r from-purple-900 to-fuchsia-700 text-white font-semibold shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-purple-300"
              onClick={() => setVisible(visible + 7)}
            >
              Load More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 ml-2 opacity-95 group-hover:opacity-100"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}