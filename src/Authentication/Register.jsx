import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const nav = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangeImage = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (file) data.append("avatar", file);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Show success, clear form, then navigate to login
      // Avatar will show in header after the user logs in
      setMessage(res.data.message || "Registered successfully!");
      setFormData({ name: "", email: "", password: "" });
      setFile(null);
      setPreview(null);
      setFileKey((p) => p + 1);

      setTimeout(() => nav("/userlog"), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="container-fluid page-header py-5">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white mb-4 animated slideInDown">User Registration</h1>
        </div>
      </div>

      <div className="container-fluid">
        <div className="container py-5">
          <div className="text-center mx-auto pb-5 wow fadeIn" data-wow-delay=".3s" style={{ maxWidth: 600 }}>
            <h1 className="mb-3">Welcome User</h1>
          </div>
          <div className="contact-detail position-relative p-4 p-md-5">
            <div className="row g-5">
              <div className="col-lg-6 wow fadeIn" data-wow-delay=".5s" style={{ marginLeft: "25%" }}>
                {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

                {preview && (
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        width: "90px", height: "90px",
                        objectFit: "cover", borderRadius: "50%",
                        border: "3px solid #ffc107"
                      }}
                    />
                    <p className="text-muted mt-1" style={{ fontSize: "0.78rem" }}>
                      This photo will appear in the header after you log in
                    </p>
                  </div>
                )}

                <form className="p-4 p-md-5 rounded contact-form" onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <input className="form-control border-0 py-3" type="text"
                      name="name" placeholder="Enter Name"
                      value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-4">
                    <input className="form-control border-0 py-3" type="email"
                      name="email" placeholder="Enter Email"
                      value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-4">
                    <input className="form-control border-0 py-3" type="password"
                      name="password" placeholder="Enter Password"
                      value={formData.password} onChange={handleChange} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-muted" style={{ fontSize: "0.85rem" }}>
                      Profile Avatar (optional)
                    </label>
                    <input key={fileKey} type="file" className="form-control border-0"
                      accept="image/*" onChange={handleChangeImage} />
                  </div>
                  <div className="text-start">
                    <button className="btn bg-primary text-white py-3 px-5" type="submit">Register</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
