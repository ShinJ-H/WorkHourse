import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const nav = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle login
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const res = await axios.post(
                "http://localhost:5000/api/admin/login",
                formData
            );

            setMessage(res.data.message);

            console.log("ADMIN TOKEN:", res.data.token);
            localStorage.setItem("token", res.data.token);

            localStorage.setItem("admin", JSON.stringify(res.data.admin));

            setTimeout(() => {
                nav("/admin");
            }, 1000);

        } catch (err) {
            console.log("FULL ERROR:", err);

            if (err.response) {
                console.log("BACKEND ERROR:", err.response.data);
                setError(err.response.data.message);
            } else if (err.request) {
                setError("No response from server");
            } else {
                setError("Request error");
            }
        }
    };
    return (
        <>
            {/* Page Header Start */}
            <div className="container-fluid page-header py-5">
                <div className="container text-center py-5">
                    <h1 className="display-2 text-white mb-4 animated slideInDown">
                        Admin Login
                    </h1>
                </div>
            </div>
            {/* Page Header End */}
            {/* Contact Start */}
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="text-center mx-auto pb-5 wow fadeIn" data-wow-delay=".3s" style={{ maxWidth: 600 }} >
                        <h1 className="mb-3">Welcome Admin</h1>
                    </div>
                    <div className="contact-detail position-relative p-4 p-md-5">
                        <div className="row g-5">
                            <div className="col-lg-6 wow fadeIn" data-wow-delay=".5s" style={{ marginLeft: "25%" }}>
                                {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
                                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                                <form className="p-4 p-md-5 rounded contact-form" onSubmit={handleSubmit}>
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
                                    <div className="text-start">
                                        <button className="btn bg-primary text-white py-3 px-5" type="submit">
                                            Login
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
    )
}