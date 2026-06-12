import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
    const [user, setUser] = useState({});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const BASE_URL = "http://192.168.29.34:5000/api";

    const getToken = () => {
        try {
            const data = localStorage.getItem("user");
            if (!data) return null;

            const parsed = JSON.parse(data);
            return parsed.token || null;
        } catch {
            return null;
        }
    };

    // ✅ Fetch Profile (ONLY ONCE)
    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            setUser(res.data);
            setName(res.data.name || "");
            setEmail(res.data.email || "");

            // Keep header in sync immediately after avatar/name updates
            // (Header listens to `userChanged` and reads `localStorage.user`.)
            try {
                const stored = localStorage.getItem("user");
                const parsed = stored ? JSON.parse(stored) : null;

                if (parsed) {
                    const updatedUser = {
                        ...parsed,
                        // Prefer the fresh values from profile endpoint
                        name: res.data.name || parsed.name,
                        email: res.data.email || parsed.email,
                        role: res.data.role || parsed.role,
                        // Backend avatar schema is { url, public_id }
                        avatar: res.data.avatar ?? parsed.avatar,
                        _id: res.data._id || parsed._id,
                        token: parsed.token,
                    };

                    localStorage.setItem("user", JSON.stringify(updatedUser));

                    // Ensure Header refreshes immediately
                    window.dispatchEvent(new Event("userChanged"));
                    window.dispatchEvent(new Event("storage"));
                }
            } catch {
                // ignore
            }

        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    useEffect(() => {
        const token = getToken();
        // Prevent calling protected API with missing/invalid token
        if (!token) return;

        fetchProfile();
    }, []);

    const admin = JSON.parse(localStorage.getItem("admin"));

    // ✅ Update Profile
    //     const handleUpdate = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const token = getToken();

    //         const formData = new FormData();
    //         formData.append("name", name);
    //         formData.append("email", email);

    //         // If you want checkbox values to be saved too
    //         if (user.darkMode !== undefined) {
    //             formData.append("darkMode", String(!!user.darkMode));
    //         }
    //         // Send checkbox values based on UI state (not existing server user object)
    //         // This prevents sending undefined/incorrect values.
    //         formData.append(
    //             "emailNotifications",
    //             String(!!user.emailNotifications)
    //         );
    //         formData.append("reminders", String(!!user.reminders));


    //         if (image) {
    //             formData.append("image", image);
    //         }

    //         const res = await axios.put(
    //             `${BASE_URL}/users/profile`,
    //             formData,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                     "Content-Type": "multipart/form-data",
    //                 },
    //             }
    //         );

    //         // Update state
    //         setUser((prev) => ({
    //             ...prev,
    //             name: res.data.name || name,
    //             email: res.data.email || email,
    //             avatar: res.data.avatar || prev.avatar,
    //         }));

    //         // Update localStorage user
    //         const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    //         localStorage.setItem(
    //             "user",
    //             JSON.stringify({
    //                 ...storedUser,
    //                 name: res.data.name || name,
    //                 email: res.data.email || email,
    //                 avatar: res.data.avatar || storedUser.avatar,
    //             })
    //         );

    //         // Update localStorage manager if logged in as manager
    //         const storedManager = JSON.parse(
    //             localStorage.getItem("manager") || "null"
    //         );

    //         if (storedManager) {
    //             localStorage.setItem(
    //                 "manager",
    //                 JSON.stringify({
    //                     ...storedManager,
    //                     name: res.data.name || name,
    //                     email: res.data.email || email,
    //                     avatar: res.data.avatar || storedManager.avatar,
    //                 })
    //             );
    //         }

    //         // Update localStorage admin if logged in as admin
    //         const storedAdmin = JSON.parse(
    //             localStorage.getItem("admin") || "null"
    //         );

    //         if (storedAdmin) {
    //             localStorage.setItem(
    //                 "admin",
    //                 JSON.stringify({
    //                     ...storedAdmin,
    //                     name: res.data.name || name,
    //                     email: res.data.email || email,
    //                     avatar: res.data.avatar || storedAdmin.avatar,
    //                 })
    //             );
    //         }

    //         // Refresh Navbar/Header instantly
    //         window.dispatchEvent(new Event("userChanged"));
    //         window.dispatchEvent(new Event("storage"));

    //         alert("Profile updated successfully");

    //     } catch (error) {
    //         console.error(error);
    //         alert(
    //             error.response?.data?.message ||
    //             "Failed to update profile"
    //         );
    //     }
    // };
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const admin = JSON.parse(localStorage.getItem("admin"));
            const manager = JSON.parse(localStorage.getItem("manager"));
            const userData = JSON.parse(localStorage.getItem("user"));

            if (admin) {
                const res = await axios.put(
                    `${BASE_URL}/admin/profile/${admin._id}`,
                    { name, email }
                );

                localStorage.setItem(
                    "admin",
                    JSON.stringify({
                        ...admin,
                        ...res.data,
                    })
                );
            }

            else if (manager) {
                const res = await axios.put(
                    `${BASE_URL}/manager/profile/${manager._id}`,
                    { name, email }
                );

                localStorage.setItem(
                    "manager",
                    JSON.stringify({
                        ...manager,
                        ...res.data,
                    })
                );
            }

            else if (userData) {
                const formData = new FormData();

                formData.append("name", name);
                formData.append("email", email);

                if (image) {
                    formData.append("image", image);
                }

                await axios.put(
                    `${BASE_URL}/users/profile`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                        },
                    }
                );
            }

            fetchProfile();

            window.dispatchEvent(
                new Event("userChanged")
            );

            alert("Profile updated successfully");

        } catch (err) {
            console.log(err.response?.data || err.message);
            alert("Failed to update profile");
        }
    };

    // ✅ Progress calculation (safe)
    const progress =
        user.stats?.total > 0
            ? Math.round((user.stats.completed / user.stats.total) * 100)
            : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6 flex justify-center">
            <div className="w-full max-w-4xl space-y-6">
                {/* Hero */}
                {/* Profile Card */}
                <div className="relative overflow-hidden bg-white rounded-3xl shadow p-6 flex items-center gap-6 mb-4">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-900/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-28 -left-28 w-64 h-64 bg-fuchsia-700/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <p className="text-xs font-semibold tracking-widest text-purple-700">PROFILE DASHBOARD</p>
                        <img
                            src={
                                preview ||
                                (user.avatar?.url
                                    ? `http://192.168.29.34:5000/uploads/${user.avatar.url}`
                                    : "/default-avatar.png")
                            }
                            className="w-24 h-24 rounded-full object-cover border-2 border-purple-100 shadow-sm"
                            alt="profile"
                        />
                        <div className="mt-3 text-xs font-medium text-gray-500 text-center">Avatar</div>
                    </div>
                    <div className="relative">
                        <h2 className="text-2xl font-extrabold text-gray-900">
                            {user.name || "—"}
                        </h2>
                        <p className="text-gray-600 mt-1">{user.email || "—"}</p>
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-4 py-2 text-sm font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            Active
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 text-purple-900 px-4 py-2 text-sm font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                <path d="M12 2v20" />
                                <path d="M17 7H7" />
                                <path d="M7 17h10" />
                            </svg>
                            {user.role || "User"}
                        </span>
                        <div className="absolute -inset-100 bg-gradient-to-r from-purple-600/10 to-fuchsia-600/10 rounded-full blur-2xl" />
                        <div className="relative inline-flex items-center gap-3 rounded-2xl bg-white/80 border border-purple-100 px-5 py-3 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-700">
                                <path d="M20 21V9" />
                                <path d="M4 21V3" />
                                <path d="M14 21V13" />
                                <path d="M8 21V7" />
                            </svg>
                            <div className="text-left">
                                <div className="text-xs font-semibold text-gray-500">Progress</div>
                                <div className="text-lg font-extrabold text-gray-900">{progress}%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 rounded-xl">
                    <Stat title="Total" value={user.stats?.total} />
                    <Stat title="Completed" value={user.stats?.completed} />
                    <Stat title="Pending" value={user.stats?.pending} />
                    <Stat title="In Progress" value={user.stats?.inProgress} />
                    <Stat title="Overdue" value={user.stats?.overdue} />
                </div>

                {/* Progress */}
                <div className="bg-white p-6 rounded-3xl shadow mb-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-gray-600 text-sm">Task Completion</p>
                            <p className="mt-1 font-semibold text-gray-900">
                                Completed: {user.stats?.completed || 0} / {user.stats?.total || 0}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-extrabold text-purple-900">{progress}%</div>
                            <div className="text-xs text-gray-500">Overall</div>
                        </div>
                    </div>

                    <div className="mt-4 w-full bg-gray-100 border border-gray-100 h-4 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Update Form */}
                <form
                    onSubmit={handleUpdate}
                    className="bg-white p-6 rounded-2xl shadow space-y-4 mb-4"
                >
                    <h3 className="text-lg font-bold">Update Profile</h3>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 mb-4 rounded-lg"
                        placeholder="Full Name"
                    />
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 mb-4 rounded-lg"
                        placeholder="Email"
                    />

                    {/* Image Upload + Preview */}
                    <label>Avatar</label>
                    <input
                        type="file"
                        className="w-full p-3 mb-4 rounded-lg"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setImage(file);
                            if (file) {
                                setPreview(URL.createObjectURL(file));
                            }
                        }}
                    />

                    <button
                        type="submit"
                        className="group w-full inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-900 to-fuchsia-700 px-16 py-3 text-white font-semibold shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-70"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5 mr-2 opacity-95 group-hover:opacity-100"
                            aria-hidden="true"
                        >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        Update Profile
                    </button>
                </form>

            </div>
        </div>
    );
}

// Stat Component
const Stat = ({ title, value }) => (
    <div className="bg-white p-4 rounded-xl shadow text-center">
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-xl font-bold">{value || 0}</h2>
    </div>
);