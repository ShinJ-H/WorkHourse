import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

function getUserFromStorage() {
    try {
        // Prefer `user` (regular login). If not present, fall back to `admin` (admin login).
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            return JSON.parse(storedUser);
        }

        const storedAdmin = localStorage.getItem("admin");
        if (storedAdmin) {
            const adminObj = JSON.parse(storedAdmin);
            // Normalize shape to match frontend expectations: include `token` if available
            const token = localStorage.getItem("token");
            return {
                _id: adminObj._id || adminObj.id,
                name: adminObj.name || adminObj.email || "Admin",
                email: adminObj.email,
                role: adminObj.role || "admin",
                avatar: adminObj.avatar || null,
                token: token || null,
            };
        }

        return null;
    } catch {
        return null;
    }
}

function getAvatarFileName(user) {
    // Backend stores: user.avatar = { url: filename, public_id: filename }
    // Frontend should use whichever exists.
    const av = user?.avatar;

    if (!av) return null;

    if (typeof av === "string") return av;

    return av?.url || av?.public_id || null;
}


function getAvatarSrc(user) {
    const avatarFileName = getAvatarFileName(user);
    if (avatarFileName) {
        return `http://localhost:5000/uploads/${avatarFileName}`;
    }

    const name = user?.name || "U";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
    )}&background=ffc107&color=000`;
}

function getAvatarFallbackSrc(user) {
    const name = user?.name || "U";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
    )}&background=ffc107&color=000`;
}

export default function RoleNavbar() {
    const nav = useNavigate();
    const [user, setUser] = useState(() => getUserFromStorage());

    useEffect(() => {
        const onUserChanged = () => setUser(getUserFromStorage());

        const onStorage = (e) => {
            if (e.key === "user" || e.key === "token") onUserChanged();
        };

        // Keep existing behavior used elsewhere in the app.
        window.addEventListener("userChanged", onUserChanged);
        window.addEventListener("storage", onStorage);

        return () => {
            window.removeEventListener("userChanged", onUserChanged);
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        window.dispatchEvent(new Event("userChanged"));
        nav("/");
    };

    const avatarSrc = useMemo(() => (user ? getAvatarSrc(user) : ""), [user]);
    const avatarBorder =
        user?.role === "admin"
            ? "2px solid #198754"
            : user?.role === "Manager"
              ? "2px solid #0d6efd"
              : "2px solid #5c0091";

    const avatarFallback = (e) => {
        if (!user) return;
        e.currentTarget.src = getAvatarFallbackSrc(user);
    };

    const renderRoleNavLinks = () => {
        if (user?.role === "admin") {
            return (
                <>
                    <Link to={"/admin"} className="nav-item nav-link">Dashboard</Link>
                    <Link to={"/admin/assigntasks"} className="nav-item nav-link">Assign Tasks</Link>
                    <Link to={"/admin/users"} className="nav-item nav-link">Users</Link>
                    <Link to={"/admin/projects"} className="nav-link"> Projects </Link>
                    <Link to={"/admin/queries"} className="nav-link"> Queries </Link>
                </>
            );
        }

        if (user?.role === "Manager") {
            return (
                <>
                    <Link to={"/manager"} className="nav-item nav-link">Dashboard</Link>
                    <Link to={"/manager/users"} className="nav-item nav-link">Users</Link>
                    <Link to={"/manager/assigntasks"} className="nav-item nav-link">Assign Tasks</Link>
                    <Link to={"/manager/projects"} className="nav-item nav-link">Projects</Link>
                    {/* <Link to={"/manager/managetasks"} className="nav-item nav-link">Manage Tasks</Link> */}
                </>
            );
        }

        // Guest links (only when no one is logged in)
        if (!user) {
            return (
                <>
                    <Link
                        to={"/"}
                        className="nav-item nav-link active text-secondary"
                    >
                        Home
                    </Link>
                    <Link to={"/aboutus"} className="nav-item nav-link">
                        About
                    </Link>
                    <Link to={"/notes"} className="nav-item nav-link">
                        Notes
                    </Link>
                    <Link to={"/contactus"} className="nav-item nav-link">
                        Contact
                    </Link>
                </>
            );
        }

        // Logged-in non-admin/non-manager users (keep existing behavior)
        return (
            <>
                <Link
                    to={"/"}
                    className="nav-item nav-link active text-secondary"
                >
                    Home
                </Link>
                <Link to={"/aboutus"} className="nav-item nav-link">
                    About
                </Link>
                <Link to={"/notes"} className="nav-item nav-link">
                    Notes
                </Link>
                <Link to={"/tasks"} className="nav-item nav-link">Tasks</Link>
                <Link
                    to={"/myprojects"}
                    className="nav-item nav-link"
                >
                    My Projects
                </Link>
                <Link to={"/contactus"} className="nav-item nav-link">
                    Contact
                </Link>
            </>
        );
    };

    return (
        <>
            <div className="container-fluid-nav">
                <div className="container">
                    <nav className="navbar navbar-dark navbar-expand py-0">
                        {/* LOGO */}
                        <Link to={"/"} className="navbar-brand">
                            <h1 className="text-white fw-bold d-block">
                                <img src="/img/logo1.png" alt="Logo" className="h-10 w-auto float-start mr-5" />
                                <img src="/img/logo2.png" alt="Logo" className="h-8 w-auto float-start mr-1" />
                            </h1>
                        </Link>

                        {/* MOBILE TOGGLE */}
                        <button
                            type="button"
                            className="navbar-toggler me-0"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>

                        <div className="navbar-collapse bg-transparent" id="navbarCollapse">
                            <div className="navbar-nav ms-auto mx-xl-auto p-0">
                                {renderRoleNavLinks()}
                            </div>

                            {/* ── AVATAR DROPDOWN (logged in) ── */}
                            {user ? (
                                <div className="dropdown" style={{ position: "relative", left: "50px" }}>
                                    <div
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
                                    >
                                        <img
                                            src={avatarSrc}
                                            alt={user.name}
                                            onError={avatarFallback}
                                            style={{
                                                width: "42px",
                                                height: "42px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                border: avatarBorder,
                                            }}
                                        />
                                        <span className="text-white" style={{ fontSize: "0.9rem" }}>
                                            {user.name}
                                        </span>
                                    </div>

                                    {/* DROPDOWN MENU */}
                                    <ul className="dropdown-menu dropdown-menu-end rounded shadow mt-2" style={{ minWidth: "220px" }}>
                                        {/* USER INFO HEADER */}
                                        <li className="px-3 py-2 d-flex align-items-center gap-2" style={{ borderBottom: "1px solid #eee" }}>
                                        <img
                                            src={avatarSrc}
                                            alt=""
                                            onError={avatarFallback}
                                            style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }}
                                        />
                                            <div>
                                                <strong style={{ fontSize: "0.85rem", display: "block" }}>{user.name}</strong>
                                                <small className="text-muted">{user.email}</small>
                                                <small
                                                    className="d-block fw-semibold"
                                                    style={{
                                                        color:
                                                            user.role === "admin"
                                                                ? "#198754"
                                                                : user.role === "Manager"
                                                                  ? "#0d6efd"
                                                                  : "#5c0091",
                                                        fontSize: "0.75rem",
                                                    }}
                                                >
                                                    {user.role || "User"}
                                                </small>
                                            </div>
                                        </li>

                                        {/* ROLE-BASED DASHBOARD LINK */}
                                        {user.role === "admin" && (
                                            <li>
                                                <Link to={"/admin/statustable"} className="dropdown-item">
                                                    <i className="fas fa-user-shield me-2 text-success"></i>Status Dashboard
                                                </Link>
                                            </li>
                                        )}
                                        {user.role === "Manager" && (
                                            <li>
                                                <Link to={"/manager/statustable"} className="dropdown-item">
                                                    <i className="fas fa-briefcase me-2 text-primary"></i>Status Dashboard
                                                </Link>
                                            </li>
                                        )}

                                        {/* COMMON LINKS */}
                                        <li>
                                            <Link to={"/profile"} className="dropdown-item">
                                                <i className="fas fa-user-alt me-2 text-purple-900"></i>My Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={"/chat"} className="dropdown-item">
                                                <i className="fas fa-comment-alt me-2 text-purple-900"></i>Inbox
                                            </Link>
                                        </li>

                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>

                                        {/* LOGOUT */}
                                        <li>
                                            <button className="dropdown-item text-danger fw-semibold" onClick={handleLogout}>
                                                <i className="fas fa-power-off me-2"></i>Log Out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                /* ── LOGIN BUTTON (not logged in) ── */
                                <li style={{ position: "relative", left: "50px", listStyle: "none" }}>
                                    <Link to={"/userlog"}>
                                        <button className="btn btn-warning">Login</button>
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

