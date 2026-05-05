import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const nav = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 Handle image change
  const handleChangeImage = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("avatar", file);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      localStorage.setItem("token", res.data.token);
      console.log("SAVED TOKEN:", localStorage.getItem("token"));

      // ✅ EVERYTHING MUST BE INSIDE TRY
      console.log("FULL RESPONSE:", res.data);

      if (res.data.token) {
        console.log("TOKEN:", res.data.token);
        localStorage.setItem("token", res.data.token);
      } else {
        console.log("❌ TOKEN NOT RECEIVED");
      }

      setMessage(res.data.message);

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: ""
      });

      setFile(null);
      setPreview(null);
      setFileKey(prev => prev + 1);

      setTimeout(() => {
        nav("/userlog");
      }, 2000);

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);

      setError(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };
  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white mb-4 animated slideInDown">
            User Registration
          </h1>
        </div>
      </div>
      {/* Page Header End */}
      {/* Contact Start */}
      <div className="container-fluid">
        <div className="container py-5">
          <div className="text-center mx-auto pb-5 wow fadeIn" data-wow-delay=".3s" style={{ maxWidth: 600 }} >
            <h1 className="mb-3">Welcome User</h1>
          </div>
          <div className="contact-detail position-relative p-4 p-md-5">
            <div className="row g-5">
              <div className="col-lg-6 wow fadeIn" data-wow-delay=".5s" style={{ marginLeft: "25%" }}>
                {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                {preview && (
                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        width: "70%",
                        height: "70%",
                        objectFit: "cover",
                        borderRadius: "50%"
                      }}
                    />
                  </div>
                )}
                <form className="p-4 p-md-5 rounded contact-form" onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <input className="form-control border-0 py-3" type="text"
                      name="name"
                      placeholder="Enter Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input className="form-control border-0 py-3" type="email"
                      name="email"
                      placeholder="Enter Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input className="form-control border-0 py-3" type="password"
                      name="password"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      key={fileKey}
                      type="file"
                      onChange={handleChangeImage}
                    />
                  </div>
                  <div className="text-start">
                    <button className="btn bg-primary text-white py-3 px-5" type="submit">
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div >
      {/* Contact End */}
    </>
  );
}