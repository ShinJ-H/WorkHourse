import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

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
                    <span className="badge bg-primary">{task.status || "Pending"}</span>
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
            className="btn btn-outline-primary rounded-pill px-5 py-3"
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
      {isLoggedIn && (
        <div className="container" style={{ paddingTop: 10, paddingBottom: 20, marginTop: 0 }}>
          <div className="text-center" style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1 className="mb-3" style={{ marginTop: 20 }}>
              Welcome back, {user?.name}
            </h1>
            <p className="mb-4 text-muted">
              You are logged in as <b>{user?.role || "User"}</b>. Continue to your dashboard or your tasks.
            </p>

            <div className="d-flex flex-wrap gap-3 justify-content-center">
              {user?.role === "Admin" ? (
                <Link to="/admin" className="btn btn-success rounded-pill px-4 py-3">
                  Go to Admin Dashboard
                </Link>
              ) : null}

              {user?.role === "Manager" ? (
                <Link to="/manager" className="btn btn-primary rounded-pill px-4 py-3">
                  Go to Manager Dashboard
                </Link>
              ) : null}

              {user?.role !== "Admin" && user?.role !== "Manager" ? (
                <Link to="/tasks" className="btn btn-primary rounded-pill px-4 py-3">
                  Go to My Tasks
                </Link>
              ) : null}

              <Link to="/account-settings" className="btn btn-outline-secondary rounded-pill px-4 py-3">
                Account Settings
              </Link>
            </div>
          </div>
        </div>
      )}

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
                  <h1 className="text-white display-1 mb-4 animated fadeInRight">
                    An Innovative Work Management Solution
                  </h1>
                  <p className="mb-4 text-white fs-5 animated fadeInDown">
                    Manage your tasks efficiently with a smart and intuitive system. WorkHorse helps you organize, track,
                    and complete your work on time while improving productivity and collaboration.
                  </p>
                  <Link to="/" className="me-2">
                    <button
                      type="button"
                      className="px-4 py-sm-3 px-sm-5 btn btn-primary rounded-pill carousel-content-btn1 animated fadeInLeft"
                    >
                      Read More
                    </button>
                  </Link>
                  <Link to="/" className="ms-2">
                    <button
                      type="button"
                      className="px-4 py-sm-3 px-sm-5 btn btn-primary rounded-pill carousel-content-btn2 animated fadeInRight"
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
                  <h6 className="h4 animated fadeInUp">Work Smarter with WorkHorse</h6>
                  <h1 className="text-white display-1 mb-4 animated fadeInLeft">
                    Quality Task Management You Can Rely On
                  </h1>
                  <p className="mb-4 text-white fs-5 animated fadeInDown">
                    WorkHorse helps you streamline your tasks and manage workflows efficiently. Stay organized, track
                    progress, and achieve your goals with ease using a simple and powerful platform.
                  </p>
                  <Link to="/" className="me-2">
                    <button
                      type="button"
                      className="px-4 py-sm-3 px-sm-5 btn btn-primary rounded-pill carousel-content-btn1 animated fadeInLeft"
                    >
                      Read More
                    </button>
                  </Link>
                  <Link to="/" className="ms-2">
                    <button
                      type="button"
                      className="px-4 py-sm-3 px-sm-5 btn btn-primary rounded-pill carousel-content-btn2 animated fadeInRight"
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
              <h5 className="text-primary">About Us</h5>
              <h1 className="mb-4">About WorkHorse: Innovative Task & Workflow Management</h1>
              <p>
                WorkHorse is designed to simplify task and workflow management for individuals and teams. Our platform helps
                users organize tasks, set priorities, and track progress efficiently. With a focus on productivity and ease of use,
                WorkHorse enables better collaboration and ensures that every task is completed on time.
              </p>
              <p className="mb-4">
                WorkHorse provides a structured and efficient way to manage tasks and workflows. It helps users stay organized,
                prioritize work, and maintain consistency in completing tasks.
              </p>
              <Link to="/" className="btn btn-secondary rounded-pill px-5 py-3 text-white">
                More Details
              </Link>
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
            <h5 className="text-primary">Your Tasks</h5>
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
            <h5 className="text-primary">Get In Touch</h5>
            <h1 className="mb-3">Contact for any query</h1>
          </div>

          <div className="contact-detail position-relative p-4 p-md-5 ">
            <div className="row g-5">
              <div className="col-lg-6 wow fadeIn" data-wow-delay=".5s">
                <div className="p-4 p-md-5 rounded contact-form">
                  <div className="mb-4">
                    <input type="text" className="form-control border-0 py-3" placeholder="Your Name" />
                  </div>
                  <div className="mb-4">
                    <input type="email" className="form-control border-0 py-3" placeholder="Your Email" />
                  </div>
                  <div className="mb-4">
                    <input type="text" className="form-control border-0 py-3" placeholder="Project" />
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
                    <button className="btn bg-primary text-white py-3 px-5" type="button">
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

