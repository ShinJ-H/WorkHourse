import { Link } from "react-router-dom";

export default function Header() {
    return (
        <>
            {/* Navbar Start */}
            <div className="container-fluid-nav">
                <div className="container">
                    <nav className="navbar navbar-dark navbar-expand py-0">
                        <Link to={'/'} className="navbar-brand">
                            <h1 className="text-white fw-bold d-block">
                                Work<span className="text-secondary">House</span>{" "}
                            </h1>
                        </Link>
                        <button type="button" className="navbar-toggler me-0" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div
                            className="navbar-collapse bg-transparent"
                            id="navbarCollapse"
                        >
                            <div className="navbar-nav ms-auto mx-xl-auto p-0">
                                <Link to={'/'} className="nav-item nav-link active text-secondary" >
                                    Home
                                </Link>
                                <Link to={'/aboutus'} className="nav-item nav-link">
                                    About
                                </Link>
                                <Link to={'/notes'} className="nav-item nav-link">
                                    Notes
                                </Link>
                                <Link to={'/tasks'} className="nav-item nav-link">
                                    Tasks
                                </Link>
                                <Link to={'/contactus'} className="nav-item nav-link">
                                    Contact
                                </Link>
                            </div>
                            <li style={{position: "relative", left: "50px"}}>
                                <Link to={"/adminlog"}>
                                    <button className="btn btn-success w-75.1">Admin</button>
                                </Link>
                            </li>
                            <li style={{position: "relative", left: "50px"}}>
                                <Link to={"/managerlog"}>
                                    <button className="btn btn-danger w-75.1">Manager</button>
                                </Link>
                            </li>
                            <li style={{position: "relative", left: "50px"}}>
                                <Link to={"/userlog"}>
                                    <button className="btn btn-warning w-75.1">User</button>
                                </Link>
                            </li>
                            <div className="dropdown" style={{position: "relative", left: "55px", border: "2px solid purple", backgroundColor: "grey", padding: "5px", borderRadius: "10px"}}>
                            <Link to={'/'} className="dropdown-toggle text-dark" data-bs-toggle="dropdown">
                            <small><i className="fa fa-home text-dark me-2"></i> My Dashboard</small></Link>
                            <div className="dropdown-menu rounded">
                                <Link to={'/'} className="dropdown-item"><i className="fas fa-user-alt me-2"></i> My Profile</Link>
                                <Link to={'/'} className="dropdown-item"><i className="fas fa-comment-alt me-2"></i> Inbox</Link>
                                <Link to={'/'} className="dropdown-item"><i className="fas fa-bell me-2"></i> Notifications</Link>
                                <Link to={'/'} className="dropdown-item"><i className="fas fa-cog me-2"></i> Account Settings</Link>
                                <Link to={'/'} className="dropdown-item"><i className="fas fa-power-off me-2"></i> Log Out</Link>
                            </div>
                        </div>
                            
                        </div>
                    </nav>
                </div>
            </div>
            {/* Navbar End */}
        </>
    )
}