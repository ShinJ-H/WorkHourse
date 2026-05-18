// src/User/UserLogin.jsx

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function UserLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const nav = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle Login
    const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    try {

        const res = await axios.post(
            "http://localhost:5000/api/users/login",
            formData
        );

        console.log("LOGIN RESPONSE:", res.data);

        const u = res.data.user;

        const userObj = {
            _id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            avatar: u.avatar,
            token: res.data.token,
        };

        localStorage.setItem(
            "user",
            JSON.stringify(userObj)
        );

        localStorage.setItem(
            "token",
            res.data.token
        );

        window.dispatchEvent(
            new Event("userChanged")
        );

        setMessage("Login Successful");

        setFormData({
            email: "",
            password: "",
        });

        // ✅ ROLE BASED LOGIN

        setTimeout(() => {

    if (u.role === "admin") {

        nav("/admin");

    }
    else if (u.role === "Manager") {

        nav("/manager");

    }
    else {

        nav("/");

    }

}, 1000);

    }
    catch (err) {

        console.log(err);

        setError(
            err.response?.data?.message ||
            "Something went wrong"
        );

    }

};

    return (
        <>
            {/* Header */}
            <div className="container-fluid page-header py-5">
                <div className="container text-center py-5">
                    <h1 className="display-2 text-white mb-4 animated slideInDown">
                        User Login
                    </h1>
                </div>
            </div>

            {/* Login Section */}
            <div className="container-fluid">
                <div className="container py-5">

                    <div
                        className="text-center mx-auto pb-5 wow fadeIn"
                        data-wow-delay=".3s"
                        style={{ maxWidth: 600 }}
                    >
                        <h1 className="mb-3">Welcome Back</h1>
                    </div>

                    <div className="contact-detail position-relative p-4 p-md-5">

                        <div className="row g-5">

                            <div
                                className="col-lg-6 wow fadeIn"
                                data-wow-delay=".5s"
                                style={{ marginLeft: "25%" }}
                            >

                                {/* Success Message */}
                                {message && (
                                    <p
                                        style={{
                                            color: "green",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {message}
                                    </p>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <p
                                        style={{
                                            color: "red",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {error}
                                    </p>
                                )}

                                {/* Form */}
                                <form
                                    className="p-4 p-md-5 rounded contact-form"
                                    onSubmit={handleSubmit}
                                >

                                    {/* Email */}
                                    <div className="mb-4">
                                        <input
                                            className="form-control border-0 py-3"
                                            type="email"
                                            name="email"
                                            placeholder="Enter Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="mb-4">
                                        <input
                                            className="form-control border-0 py-3"
                                            type="password"
                                            name="password"
                                            placeholder="Enter Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Button */}
                                    <div className="text-start">
                                        <button
                                            className="btn bg-primary text-white py-3 px-5"
                                            type="submit"
                                        >
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Register */}
                        <h4 style={{ textAlign: "center" }}>
                            If you are not registered then first{" "}
                            <Link to={"/register"}>register</Link> your email
                        </h4>
                    </div>
                </div>
            </div>
        </>
    );
}