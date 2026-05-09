import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function UserLogin() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const nav = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); setError("");

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", formData);

            setMessage(res.data.message);

            // ✅ Backend now returns { user, token } — user.avatar.url is just the filename
            const u = res.data.user;

            const userObj = {
                _id: u._id,
                name: u.name,
                email: u.email,
                role: u.role,
                avatar: u.avatar,   // { url: "filename.jpg" }
                token: res.data.token,
            };

            localStorage.setItem("user", JSON.stringify(userObj));
            localStorage.setItem("token", res.data.token);

            // Tell Header to re-read localStorage right now (same tab)
            window.dispatchEvent(new Event("userChanged"));

            setFormData({ email: "", password: "" });
            setTimeout(() => nav("/"), 1500);

        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <>
            <div className="container-fluid page-header py-5">
                <div className="container text-center py-5">
                    <h1 className="display-2 text-white mb-4 animated slideInDown">User Login</h1>
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
                                <form className="p-4 p-md-5 rounded contact-form" onSubmit={handleSubmit}>
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
                                    <div className="text-start">
                                        <button className="btn bg-primary text-white py-3 px-5" type="submit">Login</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <h4 style={{ textAlign: "center" }}>
                            If you are not registered then first <Link to={'/register'}>register</Link> your email
                        </h4>
                    </div>
                </div>
            </div>
        </>
    );
}
