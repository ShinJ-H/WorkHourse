import { useEffect, useState } from "react";
import axios from "axios";

const AccountSettings = () => {
  const API = "http://localhost:5000/api/users";

  // ✅ FIX TOKEN
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token;
  };

  const [user, setUser] = useState(null);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ FIX ROUTE (/profile instead of /settings)
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/profile`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUser(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ✅ SAVE SETTINGS
  const saveSettings = async () => {
    try {
      const formData = new FormData();

      formData.append("darkMode", String(user.darkMode));
      formData.append("emailNotifications", String(user.emailNotifications));
      formData.append("reminders", String(user.reminders));
      formData.append("theme", user.theme || "light");
      formData.append("language", user.language || "en");

      await axios.put(`${API}/profile`, formData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      alert("Settings saved");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ⚠️ These APIs DON'T EXIST in backend yet
  const changePass = async () => {
    alert("❌ Backend route not created yet: /change-password");
  };

  const logoutAll = async () => {
    alert("❌ Backend route not created yet: /logout-all");
  };

  const deleteAccount = async () => {
    alert("❌ Backend route not created yet: DELETE /me");
  };

  const deactivate = async () => {
    alert("❌ Backend route not created yet: /deactivate");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
  <div className="w-full max-w-3xl space-y-6">

    {/* HEADER */}
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
      <p className="text-gray-500">Manage your account preferences</p>
    </div>

    {/* PROFILE INFO */}
    <div className="bg-white p-6 rounded-2xl shadow space-y-2">
      <h3 className="text-lg font-semibold">Profile</h3>

      <p className="text-gray-700">
        <span className="font-medium">Email:</span> {user.email}
        <span className="ml-2">
          {user.isVerified ? "✅ Verified" : "❌ Not Verified"}
        </span>
      </p>

      <p className="text-gray-700">
        <span className="font-medium">Role:</span> {user.role}
      </p>
    </div>

    {/* PASSWORD */}
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h3 className="text-lg font-semibold">Change Password</h3>

      <input
        type="password"
        placeholder="Current Password"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        onChange={(e) =>
          setPassword({ ...password, currentPassword: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="New Password"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        onChange={(e) =>
          setPassword({ ...password, newPassword: e.target.value })
        }
      />

      <button
        onClick={changePass}
        className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Update Password
      </button>
    </div>

    {/* INFO */}
    <div className="bg-white p-6 rounded-2xl shadow space-y-2">
      <h3 className="text-lg font-semibold">Account Info</h3>

      <p className="text-gray-600">
        <span className="font-medium">Last Login:</span>{" "}
        {user.lastLogin || "Not tracked yet"}
      </p>

      <p className="text-gray-600">
        <span className="font-medium">Device:</span>{" "}
        {user.deviceInfo || "Unknown"}
      </p>
    </div>

    {/* PREFERENCES */}
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h3 className="text-lg font-semibold">Preferences</h3>

      {/* Toggle */}
      <div className="flex justify-between items-center">
        <span>Email Notifications</span>
        <input
          type="checkbox"
          checked={user.emailNotifications || false}
          onChange={(e) =>
            setUser({ ...user, emailNotifications: e.target.checked })
          }
          className="w-5 h-5"
        />
      </div>

      <div className="flex justify-between items-center">
        <span>Dark Mode</span>
        <input
          type="checkbox"
          checked={user.darkMode || false}
          onChange={(e) =>
            setUser({ ...user, darkMode: e.target.checked })
          }
          className="w-5 h-5"
        />
      </div>

      {/* Theme */}
      <div>
        <label className="block mb-1 text-sm text-gray-600">Theme</label>
        <select
          value={user.theme || "light"}
          onChange={(e) =>
            setUser({ ...user, theme: e.target.value })
          }
          className="w-full p-2 border rounded-lg"
        >
          <option value="light">Light ☀️</option>
          <option value="dark">Dark 🌙</option>
          <option value="system">System</option>
        </select>
      </div>

      {/* Language */}
      <div>
        <label className="block mb-1 text-sm text-gray-600">Language</label>
        <select
          value={user.language || "en"}
          onChange={(e) =>
            setUser({ ...user, language: e.target.value })
          }
          className="w-full p-2 border rounded-lg"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </div>

      <button
        onClick={saveSettings}
        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
      >
        Save Settings
      </button>
    </div>

    {/* DANGER ZONE */}
    <div className="bg-red-50 p-6 rounded-2xl border border-red-200 space-y-3">
      <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>

      <button
        onClick={logoutAll}
        className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
      >
        Logout All Devices
      </button>

      <button
        onClick={deactivate}
        className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
      >
        Deactivate Account
      </button>

      <button
        onClick={deleteAccount}
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
      >
        Delete Account ❗
      </button>
    </div>

  </div>
</div>
  );
};

export default AccountSettings;