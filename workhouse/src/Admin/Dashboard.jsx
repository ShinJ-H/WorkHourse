import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0
    });

    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("adminToken"); // admin token

                const res = await axios.get(
                    "http://localhost:5000/api/dashboard/stats",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setStats(res.data);

            } catch (err) {
                console.log(err);
                setError("Unauthorized or error fetching data");
            }
        };

        fetchStats();
    }, []);
    return (
        <>
            {/* Page Header Start */}
            <div className="container-fluid page-header py-5">
                <div className="container text-center py-5">
                    <h1 className="display-2 text-white mb-4 animated slideInDown">
                        Admin Dashboard
                    </h1>
                </div>
            </div>
            {/* Page Header End */}
            {error && (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}
            {/*
            <div className="row g-4">
                <div className="col-md-3">
                    <div className="card text-center p-4 shadow">
                        <h5>Total Users</h5>
                        <h2>{stats.totalUsers}</h2>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-4 shadow">
                        <h5>Total Tasks</h5>
                        <h2>{stats.totalTasks}</h2>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-4 shadow">
                        <h5>Completed Tasks</h5>
                        <h2>{stats.completedTasks}</h2>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-4 shadow">
                        <h5>Pending Tasks</h5>
                        <h2>{stats.pendingTasks}</h2>
                    </div>
                </div>

            </div> */}

            {/* Services Start */}
            <div className="container-fluid services py-5 mb-5">
                <div className="container">
                    <div className="row g-5 services-inner">
                        <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".3s">
                            <div className="services-item bg-light">
                                <div className="p-4 text-center services-content">
                                    <div className="services-content-icon">
                                        <i className="fa fa-code fa-7x mb-4 text-primary" />
                                        <h4 className="mb-3">Total Users</h4>
                                        <h2>{stats.totalUsers}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".5s">
                            <div className="services-item bg-light">
                                <div className="p-4 text-center services-content">
                                    <div className="services-content-icon">
                                        <i className="fa fa-file-code fa-7x mb-4 text-primary" />
                                        <h5>Total Tasks</h5>
                                        <h2>{stats.totalTasks}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".7s">
                            <div className="services-item bg-light">
                                <div className="p-4 text-center services-content">
                                    <div className="services-content-icon">
                                        <i className="fa fa-external-link-alt fa-7x mb-4 text-primary" />
                                        <h5>Completed Tasks</h5>
                                        <h2>{stats.completedTasks}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".3s">
                            <div className="services-item bg-light">
                                <div className="p-4 text-center services-content">
                                    <div className="services-content-icon">
                                        <i className="fas fa-user-secret fa-7x mb-4 text-primary" />
                                        <h5>Pending Tasks</h5>
                                        <h2>{stats.pendingTasks}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Services End */}
        </>
    )
}