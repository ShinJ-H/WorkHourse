import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch users (manager side)
  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      const res = await axios.get("http://192.168.29.34:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Admin side expects res.data to be an array
      setUsers(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    (user.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const [visible, setVisible] = useState(7);

  const visibleUsers = filteredUsers.slice(0, visible);

  useEffect(() => {
    // reset pagination when search changes
    setVisible(7);
  }, [search]);

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
                      <Link to={'/'}>Manager Dashboard</Link>
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
              Showing <span className="font-semibold text-gray-800">{visibleUsers.length}</span> of <span className="font-semibold text-gray-800">{filteredUsers.length}</span>
            </div>
          </div>
        </div>

        {/* User List (More visual table) */}
        <div className="overflow-x-auto rounded-3xl border border-purple-100 bg-gradient-to-b from-white to-purple-50/30 shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3 text-xs font-semibold text-purple-900">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-2xl bg-purple-100">👥</span>
              <span>Users • click Update/Delete in Admin side</span>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-800 to-fuchsia-800 text-white">
              <tr className="text-left text-center">
                <th className="px-5 py-4 text-sm font-semibold">
                  👤 Name
                </th>
                <th className="px-5 py-4 text-sm font-semibold">
                  ✉️ Email
                </th>
                <th className="px-5 py-4 text-sm font-semibold">
                  🧩 Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/60 text-center">
              {visibleUsers.length > 0 ? (
                visibleUsers.map((user, idx) => (
                  <tr
                    key={user._id}
                    className={`border-t border-purple-100/60 hover:bg-white/80 transition ${idx % 2 === 0 ? "bg-white/60" : "bg-purple-50/30"}`}
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
                      <div className="font-medium text-gray-800">{user.email || "—"}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset ${
                          user.role === "Admin"
                            ? "bg-red-100 text-red-800 ring-red-200"
                            : user.role === "Manager"
                              ? "bg-yellow-100 text-yellow-900 ring-yellow-200"
                              : "bg-purple-100 text-purple-900 ring-purple-200"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                        {user.role || "User"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t border-purple-100/60">
                  <td colSpan={3} className="px-5 py-10 text-center text-gray-500">
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

