import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
    const [user, setUser] = useState(null);
    const nav = useNavigate();

    const readUser = () => {
        try {
            const stored = localStorage.getItem("user");
            setUser(stored ? JSON.parse(stored) : null);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        readUser();
        // Same-tab updates (login / register / logout)
        window.addEventListener("userChanged", readUser);
        // Cross-tab updates
        window.addEventListener("storage", readUser);
        return () => {
            window.removeEventListener("userChanged", readUser);
            window.removeEventListener("storage", readUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        window.dispatchEvent(new Event("userChanged"));
        nav("/");
    };

    // ✅ avatar.url is just a filename like "1234567890-photo.jpg"
    // Backend serves it at GET /uploads/:filename
    const avatarSrc = user?.avatar?.url
        ? `http://localhost:5000/uploads/${user.avatar.url}`
        : null;

    return (
        <>
            <div className="container-fluid-nav">
                <div className="container">
                    <nav className="navbar navbar-dark navbar-expand py-0">
                        <Link to={'/'} className="navbar-brand">
                            <h1 className="text-white fw-bold d-block">
                                <img src="/img/logo1.png" alt="Logo" className="h-10 w-auto float-start mr-5" />
                                <img src="/img/logo2.png" alt="Logo" className="h-8 w-auto float-start mr-1" />
                            </h1>
                        </Link>
                        <button type="button" className="navbar-toggler me-0" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                            <span className="navbar-toggler-icon" />
                        </button>

                        <div className="navbar-collapse bg-transparent" id="navbarCollapse">
                            <div className="navbar-nav ms-auto mx-xl-auto p-0">
                                <Link to={'/'} className="nav-item nav-link active text-secondary">Home</Link>
                                <Link to={'/aboutus'} className="nav-item nav-link">About</Link>
                                <Link to={'/notes'} className="nav-item nav-link">Notes</Link>
                                <Link to={'/tasks'} className="nav-item nav-link">Tasks</Link>
                                <Link to={'/contactus'} className="nav-item nav-link">Contact</Link>
                            </div>

                            {user ? (
                                /* ── Logged in: avatar + name dropdown ── */
                                <div className="dropdown" style={{ position: "relative", left: "50px" }}>
                                    <div
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                                    >
                                        {avatarSrc ? (
                                            <img
                                                src={avatarSrc}
                                                alt={user.name}
                                                onError={(e) => { e.target.style.display = "none"; }}
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    border: "2px solid #ffc107",
                                                    flexShrink: 0
                                                }}
                                            />
                                        ) : (
                                            /* Fallback initials circle */
                                            <div style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                backgroundColor: "#ffc107",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold",
                                                fontSize: "17px",
                                                color: "#333",
                                                flexShrink: 0
                                            }}>
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="text-white" style={{
                                            fontSize: "0.9rem",
                                            maxWidth: "110px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {user.name}
                                        </span>
                                    </div>

                                    <ul className="dropdown-menu dropdown-menu-end rounded shadow mt-2" style={{ minWidth: "200px" }}>
                                        {/* User info header */}
                                        <li className="px-3 py-2 d-flex align-items-center gap-2" style={{ borderBottom: "1px solid #eee" }}>
                                            {avatarSrc ? (
                                                <img
                                                    src={avatarSrc}
                                                    alt=""
                                                    style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: "36px", height: "36px", borderRadius: "50%",
                                                    backgroundColor: "#ffc107", display: "flex",
                                                    alignItems: "center", justifyContent: "center",
                                                    fontWeight: "bold", fontSize: "15px", color: "#333"
                                                }}>
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <strong style={{ fontSize: "0.85rem", display: "block" }}>{user.name}</strong>
                                                <small className="text-muted">{user.email}</small>
                                            </div>
                                        </li>
                                        <li><Link to={'/profile'} className="dropdown-item"><i className="fas fa-user-alt me-2"></i>My Profile</Link></li>
                                        <li><Link to={'/chat'} className="dropdown-item"><i className="fas fa-comment-alt me-2"></i>Inbox</Link></li>
                                        <li><Link to={'/account-settings'} className="dropdown-item"><i className="fas fa-cog me-2"></i>Account Settings</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button className="dropdown-item text-danger fw-semibold" onClick={handleLogout}>
                                                <i className="fas fa-power-off me-2"></i>Log Out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                /* ── Not logged in: Login button ── */
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
