import axios from "axios";
import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch users (manager side)
  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      const res = await axios.get("http://localhost:5000/api/users", {
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
          <h1 className="display-2 text-white mb-4 animated slideInDown">
            Users
          </h1>
        </div>
      </div>
      {/* Page Header End */}

      <div className="container py-5">
        <div className="p-4 p-md-1 rounded contact-form">
          {/* Search Bar */}
          <div className="mb-4">
            <input
              className="form-control border-0 py-3"
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              required
            />
          </div>
        </div>

        {/* User List */}
        <table
          className="table table-bordered"
          style={{
            borderColor: "black",
            position: "relative",
            top: "5px",
          }}
        >
          <thead className="text-black text-center">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {visibleUsers.length > 0 ? (
              visibleUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge px-3 py-2 ${
                        user.role === "Admin"
                          ? "bg-danger"
                          : user.role === "Manager"
                            ? "bg-warning text-dark"
                            : "bg-primary"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-secondary">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Load More */}
        {visible < filteredUsers.length && (
          <div className="text-center">
            <button
              className="btn btn-primary"
              onClick={() => setVisible(visible + 7)}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </>
  );
}

