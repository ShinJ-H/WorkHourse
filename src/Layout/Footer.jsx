import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <>
            {/* Footer Start */}
            <div
                className="container-fluid footer bg-dark wow fadeIn"
                data-wow-delay=".3s"
            >
                <div className="container pt-5 pb-4">
                    <div className="row g-5">
                        <div className="col-lg-3 col-md-6">
                            <Link to={'/'}>
                                <h1 className="text-white fw-bold d-block">
                                    Work<span className="text-secondary">House</span>{" "}
                                </h1>
                            </Link>
                            <div className="d-flex workhouse-link">
                                <Link
                                    to={'/'}
                                    className="btn-light nav-fill btn btn-square rounded-circle me-2"
                                >
                                    <i className="fab fa-facebook-f text-primary" />
                                </Link>
                                <Link
                                    to={'/'}
                                    className="btn-light nav-fill btn btn-square rounded-circle me-2"
                                >
                                    <i className="fab fa-twitter text-primary" />
                                </Link>
                                <Link
                                    to={'/'}
                                    className="btn-light nav-fill btn btn-square rounded-circle me-2"
                                >
                                    <i className="fab fa-instagram text-primary" />
                                </Link>
                                <Link
                                    to={'/'}
                                    className="btn-light nav-fill btn btn-square rounded-circle me-0"
                                >
                                    <i className="fab fa-linkedin-in text-primary" />
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <Link to="#" className="h3 text-secondary">
                                Short Link
                            </Link>
                            <div className="mt-4 d-flex flex-column short-link">
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right text-secondary me-2" />
                                    About us
                                </Link>
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right text-secondary me-2" />
                                    Contact us
                                </Link>
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right text-secondary me-2" />
                                    Our Services
                                </Link>
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right text-secondary me-2" />
                                    Our Projects
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <Link to="#" className="h3 text-secondary">
                                Help Link
                            </Link>
                            <div className="mt-4 d-flex flex-column help-link">
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right text-secondary me-2" />
                                    Terms Of use
                                </Link>
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right text-secondary me-2" />
                                    Privacy Policy
                                </Link>
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right text-secondary me-2" />
                                    Helps
                                </Link>
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right text-secondary me-2" />
                                    Contact
                                </Link>
                            </div>
                        </div>
                    </div>
                    <hr className="text-light mt-5 mb-4" />
                    <div className="row">
                        <div className="col-md-6 text-center text-md-start">
                            <span className="text-light">
                                <Link to="#" className="text-secondary">
                                    <i className="fas fa-copyright text-secondary me-2" />
                                    WorkHouse
                                </Link>
                                , All right reserved.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer End */}
        </>

    )
}