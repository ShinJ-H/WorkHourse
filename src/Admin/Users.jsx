import axios from "axios";
import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(7);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
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
      await axios.delete(`http://localhost:5000/api/users/${id}`);
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
            <input className="form-control border-0 py-3" type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              required
            />
          </div>
        </div>
        {/* User List */}
        <table className="table table-bordered" style={{borderColor: "black", position: "relative", top: "5px"}}>
          <thead className="text-black text-center">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredUsers.slice(0, visible).map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {/* Update */}
                  <button className="btn btn-warning me-2" onClick={() => nav(`/edit-user/${user._id}`)}>
                    Update
                  </button>

                  {/* Delete */}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
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