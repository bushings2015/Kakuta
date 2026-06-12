import React, { useEffect, useState } from "react";
import { Edit3, Mail, X } from "lucide-react";
import authService from "../../services/authService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // ดึงข้อมูล user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.userInfo();
        setUser(res.data.data);
        setFormData({
          username: res.data.data.username || "",
          email: res.data.data.email || "",
          password: "",
        });
      } catch (err) {
        console.error("Failed to load user info:", err);
      }
    };
    fetchUser();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update Profile
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const payload = {
        username: formData.username,
        email: formData.email,
      };

      // ถ้ากรอกรหัสผ่านค่อยส่ง
      if (formData.password && formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      const response = await authService.updateProfile(payload);

      alert("Profile updated successfully!");
      // Update user with fresh data from response
      setUser(response.data.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <img
              src={
                user.avatar ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(user.username || "User")
              }
              alt={user.username}
              className="w-32 h-32 rounded-full border-4 border-blue-100 object-cover"
            />

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-800">
                {user.username}
              </h2>
              <p className="text-gray-500 capitalize">{user.role || "User"}</p>

              <div className="mt-4 space-y-2">
                <p className="flex items-center justify-center sm:justify-start text-gray-600">
                  <Mail className="w-5 h-5 mr-2 text-blue-500" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-6 text-center sm:text-right">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password (leave blank if not changing)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
