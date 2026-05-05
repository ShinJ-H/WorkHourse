import { Link } from "react-router-dom";

export default function ContactUs() {
    return (
        <>
            {/* Page Header Start */}
            <div className="container-fluid page-header py-5">
                <div className="container text-center py-5">
                    <h1 className="display-2 text-white mb-4 animated slideInDown">
                        Contact Us
                    </h1>
                    <nav aria-label="breadcrumb animated slideInDown">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item">
                                <Link to={'/'}>Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={'/'}>Pages</Link>
                            </li>
                            <li className="breadcrumb-item" aria-current="page">
                                Contact
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
            {/* Contact Start */}
            <div className="container-fluid py-5 mt-5">
                <div className="container py-5">
                    <div
                        className="text-center mx-auto pb-5 wow fadeIn"
                        data-wow-delay=".3s"
                        style={{ maxWidth: 600 }}
                    >
                        <h5 className="text-primary">Get In Touch</h5>
                        <h1 className="mb-3">Contact for any query</h1>
                    </div>
                    <div className="contact-detail position-relative p-4 p-md-5">
                        <div className="row g-5 mb-5 justify-content-center">
                            <div className="col-xl-4 col-lg-6 wow fadeIn" data-wow-delay=".3s">
                                <div className="d-flex bg-light p-3 rounded">
                                    <div
                                        className="flex-shrink-0 btn-square bg-secondary rounded-circle"
                                        style={{ width: 64, height: 64 }}
                                    >
                                        <i className="fas fa-map-marker-alt text-white" />
                                    </div>
                                    <div className="ms-3">
                                        <h4 className="text-primary">Address</h4>
                                        <Link
                                            to={'/'}
                                            target="_blank"
                                            className="h5"
                                        >
                                            23 rank Str, NY
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-6 wow fadeIn" data-wow-delay=".5s">
                                <div className="d-flex bg-light p-3 rounded">
                                    <div
                                        className="flex-shrink-0 btn-square bg-secondary rounded-circle"
                                        style={{ width: 64, height: 64 }}
                                    >
                                        <i className="fa fa-phone text-white" />
                                    </div>
                                    <div className="ms-3">
                                        <h4 className="text-primary">Call Us</h4>
                                        <Link className="h5" to={'/'} target="_blank">
                                            +012 3456 7890
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-6 wow fadeIn" data-wow-delay=".7s">
                                <div className="d-flex bg-light p-3 rounded">
                                    <div
                                        className="flex-shrink-0 btn-square bg-secondary rounded-circle"
                                        style={{ width: 64, height: 64 }}
                                    >
                                        <i className="fa fa-envelope text-white" />
                                    </div>
                                    <div className="ms-3">
                                        <h4 className="text-primary">Email Us</h4>
                                        <Link
                                            className="h5"
                                            to={'/'}
                                            target="_blank"
                                        >
                                            info@example.com
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row g-5">
                            <div className="col-lg-6 wow fadeIn" data-wow-delay=".3s">
                                <div className="p-4 p-md-5 h-100 rounded contact-map">
                                    <iframe
                                        className="rounded w-100 h-100"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3025.4710403339755!2d-73.82241512404069!3d40.685622471397615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c26749046ee14f%3A0xea672968476d962c!2s123rd%20St%2C%20Queens%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1686493221834!5m2!1sen!2sbd"
                                        style={{ border: 0, minHeight: 300 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 wow fadeIn" data-wow-delay=".5s">
                                <div className="p-4 p-md-5 rounded contact-form">
                                    <h4 className="mb-4">
                                        Receive messages instantly with our PHP and Ajax contact form -
                                        available in the{" "}
                                        <Link href="https://htmlcodex.com/downloading/?item=2737">
                                            Pro Version
                                        </Link>{" "}
                                        only.
                                    </h4>
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            className="form-control border-0 py-3"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            type="email"
                                            className="form-control border-0 py-3"
                                            placeholder="Your Email"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            className="form-control border-0 py-3"
                                            placeholder="Project"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <textarea
                                            className="w-100 form-control border-0 py-3"
                                            rows={6}
                                            cols={10}
                                            placeholder="Message"
                                            defaultValue={""}
                                        />
                                    </div>
                                    <div className="text-start">
                                        <button
                                            className="btn bg-primary text-white py-3 px-5"
                                            type="button"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Contact End */}
        </>
    )
}