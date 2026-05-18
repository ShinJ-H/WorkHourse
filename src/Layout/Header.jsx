import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {

    const [user, setUser] = useState(null);

    const nav = useNavigate();

    // READ USER FROM LOCAL STORAGE
    const readUser = () => {

        try {

            const storedUser = localStorage.getItem("user");

            if (storedUser) {

                setUser(JSON.parse(storedUser));

            } else {

                setUser(null);
            }

        } catch (error) {

            console.log(error);
            setUser(null);
        }
    };

    // LOAD USER
    useEffect(() => {

        readUser();

        // SAME TAB UPDATE
        window.addEventListener(
            "userChanged",
            readUser
        );

        // DIFFERENT TAB UPDATE
        window.addEventListener(
            "storage",
            readUser
        );

        return () => {

            window.removeEventListener(
                "userChanged",
                readUser
            );

            window.removeEventListener(
                "storage",
                readUser
            );
        };

    }, []);

    // LOGOUT
    const handleLogout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("managerToken");

        setUser(null);

        window.dispatchEvent(
            new Event("userChanged")
        );

        nav("/");
    };

    // AVATAR IMAGE
    const avatarFileName =
        user?.avatar?.url ||
        user?.avatar?.public_id ||
        user?.avatar ||
        null;

    const avatarSrc = avatarFileName
        ? `http://localhost:5000/uploads/${avatarFileName}`
        : `https://ui-avatars.com/api/?name=${user?.name}`;

    return (
        <>
            <div className="container-fluid-nav">

                <div className="container">

                    <nav className="navbar navbar-dark navbar-expand py-0">

                        {/* LOGO */}
                        <Link to={"/"} className="navbar-brand">

                            <h1 className="text-white fw-bold d-block">

                                <img
                                    src="/img/logo1.png"
                                    alt="Logo"
                                    className="h-10 w-auto float-start mr-5"
                                />

                                <img
                                    src="/img/logo2.png"
                                    alt="Logo"
                                    className="h-8 w-auto float-start mr-1"
                                />

                            </h1>

                        </Link>

                        {/* MOBILE BUTTON */}
                        <button
                            type="button"
                            className="navbar-toggler me-0"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>

                        {/* NAVBAR */}
                        <div
                            className="navbar-collapse bg-transparent"
                            id="navbarCollapse"
                        >

                            <div className="navbar-nav ms-auto mx-xl-auto p-0">

                                <Link
                                    to={"/"}
                                    className="nav-item nav-link active text-secondary"
                                >
                                    Home
                                </Link>

                                <Link
                                    to={"/aboutus"}
                                    className="nav-item nav-link"
                                >
                                    About
                                </Link>

                                <Link
                                    to={"/notes"}
                                    className="nav-item nav-link"
                                >
                                    Notes
                                </Link>

                                <Link
                                    to={"/tasks"}
                                    className="nav-item nav-link"
                                >
                                    Tasks
                                </Link>

                                <Link
                                    to={"/contactus"}
                                    className="nav-item nav-link"
                                >
                                    Contact
                                </Link>

                            </div>

                            {/* USER LOGIN */}
                            {user ? (

                                <div
                                    className="dropdown"
                                    style={{
                                        position: "relative",
                                        left: "50px",
                                    }}
                                >

                                    {/* DROPDOWN BUTTON */}
                                    <div
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                        }}
                                    >

                                        {/* USER IMAGE */}
                                        {avatarSrc ? (

                                            <img
                                                src={avatarSrc}
                                                alt={user.name}
                                                onError={(e) => {
                                                    e.target.src =
                                                        `https://ui-avatars.com/api/?name=${user.name}`;
                                                }}
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    border: "2px solid #ffc107",
                                                }}
                                            />
                                        ) : (

                                            // FALLBACK LETTER
                                            <div
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                    borderRadius: "50%",
                                                    background: "#ffc107",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontWeight: "bold",
                                                    color: "#000",
                                                    fontSize: "18px",
                                                }}
                                            >
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>

                                        )}

                                        {/* USER NAME */}
                                        <span
                                            className="text-white"
                                            style={{
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            {user.name}
                                        </span>

                                    </div>

                                    {/* DROPDOWN MENU */}
                                    <ul
                                        className="dropdown-menu dropdown-menu-end rounded shadow mt-2"
                                        style={{
                                            minWidth: "220px",
                                        }}
                                    >

                                        {/* USER INFO */}
                                        <li
                                            className="px-3 py-2 d-flex align-items-center gap-2"
                                            style={{
                                                borderBottom: "1px solid #eee",
                                            }}
                                        >

                                            {avatarSrc ? (

                                                <img
                                                    src={avatarSrc}
                                                    alt=""
                                                    style={{
                                                        width: "38px",
                                                        height: "38px",
                                                        borderRadius: "50%",
                                                        objectFit: "cover",
                                                    }}
                                                />

                                            ) : (

                                                <div
                                                    style={{
                                                        width: "38px",
                                                        height: "38px",
                                                        borderRadius: "50%",
                                                        background: "#ffc107",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>

                                            )}

                                            <div>
                                                <strong
                                                    style={{
                                                        fontSize: "0.85rem",
                                                        display: "block",
                                                    }}
                                                >
                                                    {user.name}
                                                </strong>

                                                <small className="text-muted">
                                                    {user.email}
                                                </small>
                                            </div>

                                        </li>

                                        {/* PROFILE */}
                                        <li>
                                            <Link
                                                to={"/profile"}
                                                className="dropdown-item"
                                            >
                                                <i className="fas fa-user-alt me-2"></i>
                                                My Profile
                                            </Link>
                                        </li>

                                        {/* CHAT */}
                                        <li>
                                            <Link
                                                to={"/chat"}
                                                className="dropdown-item"
                                            >
                                                <i className="fas fa-comment-alt me-2"></i>
                                                Inbox
                                            </Link>
                                        </li>

                                        {/* SETTINGS */}
                                        <li>
                                            <Link
                                                to={"/account-settings"}
                                                className="dropdown-item"
                                            >
                                                <i className="fas fa-cog me-2"></i>
                                                Account Settings
                                            </Link>
                                        </li>

                                        {/* ADMIN */}
                                        {user.role === "Admin" && (
                                            <li>
                                                <Link
                                                    to={"/admin-dashboard"}
                                                    className="dropdown-item"
                                                >
                                                    <i className="fas fa-user-shield me-2"></i>
                                                    Admin Dashboard
                                                </Link>
                                            </li>
                                        )}

                                        {/* MANAGER */}
                                        {user.role === "Manager" && (
                                            <li>
                                                <Link
                                                    to={"/manager-dashboard"}
                                                    className="dropdown-item"
                                                >
                                                    <i className="fas fa-briefcase me-2"></i>
                                                    Manager Dashboard
                                                </Link>
                                            </li>
                                        )}

                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>

                                        {/* LOGOUT */}
                                        <li>
                                            <button
                                                className="dropdown-item text-danger fw-semibold"
                                                onClick={handleLogout}
                                            >
                                                <i className="fas fa-power-off me-2"></i>
                                                Log Out
                                            </button>
                                        </li>

                                    </ul>

                                </div>

                            ) : (

                                // LOGIN BUTTON
                                <li
                                    style={{
                                        position: "relative",
                                        left: "50px",
                                        listStyle: "none",
                                    }}
                                >
                                    <Link to={"/userlog"}>
                                        <button className="btn btn-warning">
                                            Login
                                        </button>
                                    </Link>
                                </li>

                            )}

                        </div>

                    </nav>

                </div>

            </div>
        </>
    );
}
