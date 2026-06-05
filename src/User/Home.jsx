import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


function TasksPreview() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/tasks");
        const data = await res.json();
        if (!ignore) setTasks(Array.isArray(data) ? data : []);
      } catch {
        if (!ignore) setTasks([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchTasks();
    return () => {
      ignore = true;
    };
  }, []);

  const visibleTasks = showAll ? tasks : tasks.slice(0, 3);

  return (
    <div>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : visibleTasks.length === 0 ? (
        <div className="text-center py-4 text-muted">No tasks found.</div>
      ) : (
        <div className="row g-4">
          {visibleTasks.map((task) => (
            <div key={task._id || task.id} className="col-md-4">
              <div className="card h-100 shadow-sm" style={{ borderRadius: 14 }}>
                <div className="card-body">
                  <h5 className="card-title">{task.title || task.taskName || "Untitled"}</h5>
                  <p className="card-text text-muted" style={{ minHeight: 44 }}>
                    {task.description || task.taskDescription || "No description"}
                  </p>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="badge bg-purple-900">{task.status || "Pending"}</span>
                    <span className="text-secondary" style={{ fontSize: 12 }}>
                      {task.dueDate || task.deadline || ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tasks.length > 3 && (
        <div className="text-center mt-4">
          <button
            className="inline-flex items-center justify-center !rounded-full bg-purple-900 px-16 py-3 text-white font-semibold shadow-sm hover:bg-purple-800 disabled:opacity-70"
            onClick={() => setShowAll((v) => !v)}
            type="button"
          >
            {showAll ? "Show Less" : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", project: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);


  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/queries", form);
      setForm({ name: "", email: "", project: "", message: "" });
      setSuccess("Message sent successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };


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
    window.addEventListener("userChanged", readUser);
    window.addEventListener("storage", readUser);
    return () => {
      window.removeEventListener("userChanged", readUser);
      window.removeEventListener("storage", readUser);
    };
  }, []);

  const isLoggedIn = !!user;

  return (
    <>
      {/* Carousel Start */}
      <div className="container-fluid px-0">
        <div id="carouselId" className="carousel slide" data-bs-ride="carousel">
          <ol className="carousel-indicators">
            <li
              data-bs-target="#carouselId"
              data-bs-slide-to={0}
              className="active"
              aria-current="true"
              aria-label="First slide"
            />
            <li data-bs-target="#carouselId" data-bs-slide-to={1} aria-label="Second slide" />
          </ol>

          <div className="carousel-inner" role="listbox">
            <div className="carousel-item active">
              <img src="img/carousel-1.jpg" className="img-fluid" alt="First slide" />
              <div className="carousel-caption">
                <div className="container carousel-content">
                  <h6 className="h4 animated fadeInUp0" style={{ color: "white" }}>
                    Work Smarter with WorkHorse
                  </h6>
                  <h1 className="text-white display-1 animated fadeInRight">
                    An Innovative Work Management Solution
                  </h1>
                  <p className="text-white fs-5 animated fadeInDown">
                    Manage your tasks efficiently with a smart and intuitive system. WorkHorse helps you organize, track,
                    and complete your work on time while improving productivity and collaboration.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsReadMoreOpen(true)}
                    className="inline-flex items-center justify-center !rounded-full bg-purple-900 px-16 py-3 text-white font-semibold shadow-sm hover:bg-purple-800 disabled:opacity-70"
                  >
                    Read More
                  </button>

                  <Link to="/contactus" className="ms-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center !rounded-full bg-purple-900 px-16 py-3 text-white font-semibold shadow-sm hover:bg-purple-800 disabled:opacity-70"
                    >
                      Contact Us
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="carousel-item">
              <img src="img/carousel-2.jpg" className="img-fluid" alt="Second slide" />
              <div className="carousel-caption">
                <div className="container carousel-content">
                  <h6 className="h4 animated fadeInUp text-white">Work Smarter with WorkHorse</h6>
                  <h1 className="text-white display-1 animated fadeInLeft">
                    Quality Task Management You Can Rely On
                  </h1>
                  <p className="text-white fs-5 animated fadeInDown">
                    WorkHorse helps you streamline your tasks and manage workflows efficiently. Stay organized, track
                    progress, and achieve your goals with ease using a simple and powerful platform.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsReadMoreOpen(true)}
                    className="inline-flex items-center justify-center !rounded-full bg-purple-900 px-16 py-3 text-white font-semibold shadow-sm hover:bg-purple-800 disabled:opacity-70"
                  >
                    Read More
                  </button>
                  <Link to="/contactus" className="ms-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center !rounded-full bg-purple-900 px-16 py-3 text-white font-semibold shadow-sm hover:bg-purple-800 disabled:opacity-70"
                    >
                      Contact Us
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselId"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselId"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      {/* Carousel End */}

      {/* About Start */}
      <div className="container-fluid py-5 my-5">
        <div className="container pt-5">
          <div className="row g-5">
            <div className="col-lg-5 col-md-6 col-sm-12 wow fadeIn" data-wow-delay=".3s">
              <div className="h-100 position-relative">
                <img
                  src="img/about-1.jpg"
                  className="img-fluid w-75 rounded"
                  alt=""
                  style={{ marginBottom: "25%" }}
                />
                <div className="position-absolute w-75" style={{ top: "25%", left: "25%" }}>
                  <img src="img/about-2.jpg" className="img-fluid w-100 rounded" alt="" />
                </div>
              </div>
            </div>

            <div className="col-lg-7 col-md-6 col-sm-12 wow fadeIn" data-wow-delay=".5s">
              <h5 className="!text-purple-900">About Us</h5>
              <h1 className="">About WorkHorse: Innovative Task & Workflow Management</h1>
              <p>
                WorkHorse is designed to simplify task and workflow management for individuals and teams. Our platform helps
                users organize tasks, set priorities, and track progress efficiently. With a focus on productivity and ease of use,
                WorkHorse enables better collaboration and ensures that every task is completed on time.
              </p>
              <p className="">
                WorkHorse provides a structured and efficient way to manage tasks and workflows. It helps users stay organized,
                prioritize work, and maintain consistency in completing tasks.
              </p>
              <button
                type="button"
                onClick={() => setIsDetailsOpen(true)}
                className="inline-flex items-center justify-center !rounded-full bg-purple-900 px-16 py-3 text-white font-semibold shadow-sm hover:bg-purple-800"
              >
                More Details
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}

      {/* Services Start */}
      <div className="container-fluid services py-5 mb-5">
        <div className="container">
          <div
            className="text-center mx-auto pb-5 wow fadeIn"
            data-wow-delay=".3s"
            style={{ maxWidth: 600 }}
          >
            <h5 className="!text-purple-900">Your Tasks</h5>
            <h1>Solutions Built for Your Workflow</h1>
            <p className="text-muted mb-0">Showing up to 3 tasks. Click Load more to see others.</p>
          </div>

          {isLoggedIn ? (
            <TasksPreview />
          ) : (
            <div className="text-center">
              <Link to="/userlog" className="btn btn-warning rounded-pill px-4 py-3">
                Login to see your tasks
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* Services End */}

      {/* Contact Start */}
      <div className="container-fluid py-5 mb-5">


        <div className="container">
          <div
            className="text-center mx-auto pb-5 wow fadeIn"
            data-wow-delay=".3s"
            style={{ maxWidth: 600 }}
          >
            <h5 className="!text-purple-900">Get In Touch</h5>
            <h1 className="mb-3">Contact for any query</h1>
          </div>

          {/* Contact form (from ContactUs.jsx) */}
          <div className="contact-detail position-relative p-4 p-md-5 ">
            <div className="row g-5 justify-content-center">
              <div className="col-lg-6 wow fadeIn" data-wow-delay=".5s">
                <div className="p-4 p-md-5 rounded contact-form">
                  {/* NOTE: handled by Home component state/logic */}
                  <div className="mb-4 rounded-xl">
                    <input
                      type="text"
                      className="form-control py-3"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={onChange}
                      name="name"
                      required
                    />
                  </div>

                  <div className="mb-4 rounded-xl">
                    <input
                      type="email"
                      className="form-control py-3"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={onChange}
                      name="email"
                      required
                    />
                  </div>

                  <div className="mb-4 rounded-xl">
                    <input
                      type="text"
                      className="form-control py-3"
                      placeholder="Query Name"
                      value={form.project}
                      onChange={onChange}
                      name="project"
                    />
                  </div>

                  <div className="mb-4 rounded-xl">
                    <textarea
                      className="w-100 form-control py-3"
                      rows={6}
                      cols={10}
                      placeholder="Message"
                      value={form.message}
                      onChange={onChange}
                      name="message"
                      required
                    />
                  </div>

                  {error && <div className="mb-3 text-red-600">{error}</div>}
                  {success && <div className="mb-3 text-green-600">{success}</div>}

                  <div className="text-center">
                    <button
                      className="inline-flex items-center justify-center !rounded-md bg-purple-900 px-16 py-3 text-white font-semibold shadow-sm hover:bg-purple-800 disabled:opacity-70"
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact End */}


      {/* Tailwind Read More Modal */}
      {isReadMoreOpen && (
        <div className="fixed inset-0 z-50" role="presentation">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsReadMoreOpen(false)}
            aria-hidden="true"
          />

          <div className="relative min-h-full flex items-center justify-center p-4">
            <div
              className="w-full max-w-md rounded-2xl bg-white text-gray-900 shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Read more about WorkHouse"
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsReadMoreOpen(false);
              }}
            >
              <div className="p-5 border-b border-gray-200 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">What is WorkHouse?</h2>
                  <p className="text-gray-600 mt-1">
                    WorkHouse is a simple yet powerful work management platform that helps individuals and teams
                    organize tasks, track progress, and complete work on time.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsReadMoreOpen(false)}
                  className="shrink-0 inline-flex items-center justify-center rounded-full p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Close modal"
                >
                  <span aria-hidden="true" className="text-xl leading-none">
                    ×
                  </span>
                </button>
              </div>

              <div className="p-5">
                <button
                  type="button"
                  onClick={() => setIsReadMoreOpen(false)}
                  className="w-full inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-2.5 text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tailwind More Details Modal */}
      {isDetailsOpen && (
        <div className="fixed inset-0 z-50" role="presentation">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsDetailsOpen(false)}
            aria-hidden="true"
          />

          {/* Keep modal small + centered; allow internal scrolling */}

          <div className="relative min-h-full flex items-center justify-center p-4">
            <div
              className="w-full max-w-3xl rounded-2xl bg-white text-gray-900 shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="More Details"
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsDetailsOpen(false);
              }}
            >
              <div className="max-h-[70vh] overflow-y-auto">
                <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">About WorkHouse</h2>
                    <p className="text-gray-600 mt-1">
                      Innovative task & workflow management designed for real productivity.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsDetailsOpen(false)}
                    className="shrink-0 inline-flex items-center justify-center rounded-full p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Close modal"
                  >
                    <span aria-hidden="true" className="text-xl leading-none">
                      ×
                    </span>
                  </button>
                </div>

                <div className="p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-indigo-50 p-4">
                      <h3 className="font-semibold">Organize</h3>
                      <p className="text-gray-700 mt-1">
                        Keep tasks structured, set priorities, and track everything in one place.
                      </p>
                    </div>
                    <div className="rounded-xl bg-indigo-50 p-4">
                      <h3 className="font-semibold">Track Progress</h3>
                      <p className="text-gray-700 mt-1">
                        Stay updated with clear status and due dates so work never goes missing.
                      </p>
                    </div>
                    <div className="rounded-xl bg-indigo-50 p-4">
                      <h3 className="font-semibold">Collaborate</h3>
                      <p className="text-gray-700 mt-1">
                        Share progress and stay aligned with teams through a simple workflow.
                      </p>
                    </div>
                    <div className="rounded-xl bg-indigo-50 p-4">
                      <h3 className="font-semibold">Work Smarter</h3>
                      <p className="text-gray-700 mt-1">
                        Reduce effort with an interface that helps you focus on completing tasks.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-gray-200 p-4 bg-white">
                    <p className="text-gray-700">
                      WorkHouse is built to make task management effortless—helping individuals and teams
                      organize, prioritize, and deliver on time.
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsDetailsOpen(false)}
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-2.5 text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chatbot Button (only for logged-in users) */}
      {isLoggedIn ? (
        <Link to="/chatbot">
          <div className="fixed bottom-6 right-6 z-50">
            <div className="relative w-30 h-30">
              <img
                src="img/ChatBot.png"
                alt="Chatbot"
                className="w-full h-full rounded-full shadow-xl object-cover cursor-pointer transition-transform duration-300 hover:scale-110"
              />
              <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-3 h-3 bg-red-500 rounded-full" />
            </div>
          </div>
        </Link>
      ) : null}
    </>
  );
}

