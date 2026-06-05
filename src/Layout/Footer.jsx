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
                                <h1 className="!text-purple-300 fw-bold d-block">
                                    Work<span className="text-purple-700">House</span>{" "}
                                </h1>
                            </Link>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <Link to="#" className="h3 !text-purple-700">
                                Short Link
                            </Link>
                            <div className="mt-4 d-flex flex-column short-link">
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right !text-purple-500 me-2" />
                                    About us
                                </Link>
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right !text-purple-500 me-2" />
                                    Contact us
                                </Link>
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right !text-purple-500 me-2" />
                                    Our Services
                                </Link>
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right !text-purple-500 me-2" />
                                    Our Projects
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <Link to="#" className="h3 !text-purple-700">
                                Help Link
                            </Link>
                            <div className="mt-4 d-flex flex-column help-link">
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right !text-purple-500 me-2" />
                                    Terms Of use
                                </Link>
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right !text-purple-500 me-2" />
                                    Privacy Policy
                                </Link>
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right !text-purple-500 me-2" />
                                    Helps
                                </Link>
                                <Link to={'/'} className="mb-2 text-white">
                                    <i className="fas fa-angle-right !text-purple-500 me-2" />
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