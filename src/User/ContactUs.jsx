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
                        <div className="row g-5">
                            <div className="col-lg-6 wow fadeIn" data-wow-delay=".5s">
                                <div className="p-4 p-md-5 rounded contact-form">
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