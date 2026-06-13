import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    project: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // NOTE: this endpoint must exist in backend.
      // If you haven't created it yet, add a POST /api/contactus (or /api/queries)
      // that saves the message into the Queries table/collection.
      await axios.post("/api/queries", form);

      setForm({ name: "", email: "", project: "", message: "" });
      setSuccess("Message sent successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid page-header py-5">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white animated slideInDown">Contact Us</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item" aria-current="page">
                Contact
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-fluid py-5 mt-5">
        <div className="container py-5">
          <div
            className="text-center mx-auto pb-5 wow fadeIn"
            data-wow-delay=".3s"
            style={{ maxWidth: 600 }}
          >
            <h5 className="!text-purple-900">Get In Touch</h5>
            <h1 className="mb-3">Contact for any query</h1>
          </div>

          <div className="contact-detail position-relative p-4 p-md-5">
            <div className="row g-5 justify-content-center">
              <div className="col-lg-6 wow fadeIn" data-wow-delay=".5s">
                <div className="p-4 p-md-5 rounded contact-form">
                  {error && <div className="mb-3 text-red-600">{error}</div>}
                  {success && <div className="mb-3 text-green-600">{success}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4 rounded-xl">
                      <input
                        type="text"
                        name="name"
                        className="form-control py-3"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={onChange}
                        required
                      />
                    </div>

                    <div className="mb-4 rounded-xl">
                      <input
                        type="email"
                        name="email"
                        className="form-control py-3"
                        placeholder="Your Email"
                        value={form.email}
                        onChange={onChange}
                        required
                      />
                    </div>

                    <div className="mb-4 rounded-xl">
                      <input
                        type="text"
                        name="project"
                        className="form-control py-3"
                        placeholder="Query Name"
                        value={form.project}
                        onChange={onChange}
                      />
                    </div>


                    <div className="mb-4 rounded-xl">
                      <textarea
                        name="message"
                        className="w-100 form-control py-3"
                        rows={6}
                        cols={10}
                        placeholder="Message"
                        value={form.message}
                        onChange={onChange}
                        required
                      />
                    </div>

                    <div className="text-center">
                      <button
                        className="inline-flex items-center justify-center !rounded-md bg-purple-900 px-16 py-3 text-white font-semibold shadow-sm hover:bg-purple-800 disabled:opacity-70"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Send Message"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

