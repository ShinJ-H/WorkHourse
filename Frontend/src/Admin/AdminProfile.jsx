import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProfile() {
    const [user, setUser] = useState({});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const BASE_URL = "http://192.168.29.34:5000/api";

    const getToken = () => {
        try {
            const data = localStorage.getItem("admin");
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

            // Keep admin in sync immediately after avatar/name updates
            // (Header listens to `userChanged` and reads from localStorage.*)
            try {
                const stored = localStorage.getItem("admin");
                const parsed = stored ? JSON.parse(stored) : null;

                if (parsed) {
                    const updatedAdmin = {
                        ...parsed,
                        name: res.data.name || parsed.name,
                        email: res.data.email || parsed.email,
                        role: res.data.role || parsed.role,
                        avatar: res.data.avatar ?? parsed.avatar,
                        _id: res.data._id || parsed._id,
                        token: parsed.token,
                    };

                    localStorage.setItem("admin", JSON.stringify(updatedAdmin));

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ✅ Update Profile
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = getToken();

            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);

            if (user.darkMode !== undefined) {
                formData.append("darkMode", String(!!user.darkMode));
            }

            formData.append(
                "emailNotifications",
                String(!!user.emailNotifications)
            );
            formData.append("reminders", String(!!user.reminders));

            if (image) {
                formData.append("image", image);
            }

            const res = await axios.put(
                `${BASE_URL}/users/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // Update state
            setUser((prev) => ({
                ...prev,
                name: res.data.name || name,
                email: res.data.email || email,
                avatar: res.data.avatar || prev.avatar,
            }));

            // Update localStorage admin
            const storedAdmin = JSON.parse(
                localStorage.getItem("admin") || "null"
            );

            if (storedAdmin) {
                localStorage.setItem(
                    "admin",
                    JSON.stringify({
                        ...storedAdmin,
                        name: res.data.name || name,
                        email: res.data.email || email,
                        avatar: res.data.avatar || storedAdmin.avatar,
                    })
                );
            }

            // If the app also uses user key for header, keep it in sync
            const storedUser = JSON.parse(
                localStorage.getItem("user") || "null"
            );

            if (storedUser) {
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...storedUser,
                        name: res.data.name || name,
                        email: res.data.email || email,
                        avatar: res.data.avatar || storedUser.avatar,
                    })
                );
            }

            window.dispatchEvent(new Event("userChanged"));
            window.dispatchEvent(new Event("storage"));

            alert("Profile updated successfully");
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message ||
                    "Failed to update profile"
            );
        }
    };

    // ✅ Progress calculation (safe)
    const progress =
        user.stats?.total > 0
            ? Math.round((user.stats.completed / user.stats.total) * 100)
            : 0;

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-4xl space-y-6">
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-6">
                    <img
                        src={
                            preview ||
                            (user.avatar?.url
                                ? `http://192.168.29.34:5000/uploads/${user.avatar.url}`
                                : "/default-avatar.png")
                        }
                        className="w-24 h-24 rounded-full object-cover border"
                        alt="profile"
                    />

                    <div>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-gray-500">{user.email}</p>
                        <span className="bg-blue-100 px-3 py-1 rounded text-sm">
                            {user.role}
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Stat title="Total" value={user.stats?.total} />
                    <Stat title="Completed" value={user.stats?.completed} />
                    <Stat title="Pending" value={user.stats?.pending} />
                    <Stat
                        title="In Progress"
                        value={user.stats?.inProgress}
                    />
                    <Stat title="Overdue" value={user.stats?.overdue} />
                </div>

                {/* Progress */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <p className="mb-2">
                        Completed: {user.stats?.completed || 0} / {user.stats?.total || 0} (
                        {progress}%)
                    </p>

                    <div className="w-full bg-gray-200 h-3 rounded">
                        <div
                            className="bg-green-500 h-3 rounded"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Update Form */}
                <form
                    onSubmit={handleUpdate}
                    className="bg-white p-6 rounded-2xl shadow space-y-4"
                >
                    <h3 className="text-lg font-bold">Update Profile</h3>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Full Name"
                    />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Email"
                    />

                    {/* Image Upload + Preview */}
                    <input
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setImage(file);
                            if (file) {
                                setPreview(URL.createObjectURL(file));
                            }
                        }}
                    />

                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
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

