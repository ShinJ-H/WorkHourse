import { Link } from "react-router-dom";

export default function Notes() {
    return (
        <>
            {/* Page Header Start */}
            <div className="container-fluid page-header py-5">
                <div className="container text-center py-5">
                    <h1 className="display-2 text-white mb-4 animated slideInDown">
                        Notes
                    </h1>
                    <nav aria-label="breadcrumb animated slideInDown">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item">
                                <Link to={'/'}>Home</Link>
                            </li>
                            <li className="breadcrumb-item" aria-current="page">
                                Notes
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            {/* Page Header End */}
            {/* Fact Start */}
            <div className="container-fluid bg-secondary py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 wow fadeIn" data-wow-delay=".1s">
                            <div className="d-flex counter">
                                <h1 className="me-3 text-primary counter-value">99</h1>
                                <h5 className="text-white mt-1">
                                    Success in getting happy customer
                                </h5>
                            </div>
                        </div>
                        <div className="col-lg-3 wow fadeIn" data-wow-delay=".3s">
                            <div className="d-flex counter">
                                <h1 className="me-3 text-primary counter-value">25</h1>
                                <h5 className="text-white mt-1">
                                    Thousands of successful business
                                </h5>
                            </div>
                        </div>
                        <div className="col-lg-3 wow fadeIn" data-wow-delay=".5s">
                            <div className="d-flex counter">
                                <h1 className="me-3 text-primary counter-value">120</h1>
                                <h5 className="text-white mt-1">Total clients who love HighTech</h5>
                            </div>
                        </div>
                        <div className="col-lg-3 wow fadeIn" data-wow-delay=".7s">
                            <div className="d-flex counter">
                                <h1 className="me-3 text-primary counter-value">5</h1>
                                <h5 className="text-white mt-1">
                                    Stars reviews given by satisfied clients
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Fact End */}
            {/* Services Start */}
            <div className="container-fluid services py-5 my-5">
                <div className="container py-5">
                    <div
                        className="text-center mx-auto pb-5 wow fadeIn"
                        data-wow-delay=".3s"
                        style={{ maxWidth: 600 }}
                    >
                        <h5 className="text-primary">Our Services</h5>
                        <h1>Services Built Specifically For Your Business</h1>
                    </div>
                    <div className="row g-5 services-inner">
                        <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".3s">
                            <div className="services-item bg-light">
                                <div className="p-4 text-center services-content">
                                    <div className="services-content-icon">
                                        <i className="fa fa-code fa-7x mb-4 text-primary" />
                                        <h4 className="mb-3">Web Design</h4>
                                        <p className="mb-4">
                                            Lorem ipsum dolor sit amet elit. Sed efficitur quis purus ut
                                            interdum. Aliquam dolor eget urna ultricies tincidunt.
                                        </p>
                                        <Link
                                            to={'/'}
                                            className="btn btn-secondary text-white px-5 py-3 rounded-pill"
                                        >
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".5s">
                            <div className="services-item bg-light">
                                <div className="p-4 text-center services-content">
                                    <div className="services-content-icon">
                                        <i className="fa fa-file-code fa-7x mb-4 text-primary" />
                                        <h4 className="mb-3">Web Development</h4>
                                        <p className="mb-4">
                                            Lorem ipsum dolor sit amet elit. Sed efficitur quis purus ut
                                            interdum. Aliquam dolor eget urna ultricies tincidunt.
                                        </p>
                                        <Link
                                            to={'/'}
                                            className="btn btn-secondary text-white px-5 py-3 rounded-pill"
                                        >
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".7s">
                            <div className="services-item bg-light">
                                <div className="p-4 text-center services-content">
                                    <div className="services-content-icon">
                                        <i className="fa fa-external-link-alt fa-7x mb-4 text-primary" />
                                        <h4 className="mb-3">UI/UX Design</h4>
                                        <p className="mb-4">
                                            Lorem ipsum dolor sit amet elit. Sed efficitur quis purus ut
                                            interdum. Aliquam dolor eget urna ultricies tincidunt.
                                        </p>
                                        <Link
                                            to={'/'}
                                            className="btn btn-secondary text-white px-5 py-3 rounded-pill"
                                        >
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".3s">
                            <div className="services-item bg-light">
                                <div className="p-4 text-center services-content">
                                    <div className="services-content-icon">
                                        <i className="fas fa-user-secret fa-7x mb-4 text-primary" />
                                        <h4 className="mb-3">Web Cecurity</h4>
                                        <p className="mb-4">
                                            Lorem ipsum dolor sit amet elit. Sed efficitur quis purus ut
                                            interdum. Aliquam dolor eget urna ultricies tincidunt.
                                        </p>
                                        <Link
                                            to={'/'}
                                            className="btn btn-secondary text-white px-5 py-3 rounded-pill"
                                        >
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".5s">
                            <div className="services-item bg-light">
                                <div className="p-4 text-center services-content">
                                    <div className="services-content-icon">
                                        <i className="fa fa-envelope-open fa-7x mb-4 text-primary" />
                                        <h4 className="mb-3">Digital Marketing</h4>
                                        <p className="mb-4">
                                            Lorem ipsum dolor sit amet elit. Sed efficitur quis purus ut
                                            interdum. Aliquam dolor eget urna ultricies tincidunt.
                                        </p>
                                        <Link
                                            to={'/'}
                                            className="btn btn-secondary text-white px-5 py-3 rounded-pill"
                                        >
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".7s">
                            <div className="services-item bg-light">
                                <div className="p-4 text-center services-content">
                                    <div className="services-content-icon">
                                        <i className="fas fa-laptop fa-7x mb-4 text-primary" />
                                        <h4 className="mb-3">Programming</h4>
                                        <p className="mb-4">
                                            Lorem ipsum dolor sit amet elit. Sed efficitur quis purus ut
                                            interdum. Aliquam dolor eget urna ultricies tincidunt.
                                        </p>
                                        <Link
                                            to={'/'}
                                            className="btn btn-secondary text-white px-5 py-3 rounded-pill"
                                        >
                                            Read More
                                        </Link>
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