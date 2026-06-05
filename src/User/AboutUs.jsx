import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AboutUS() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (!isDetailsOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsDetailsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDetailsOpen]);

  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white animated slideInDown">About Us</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item">
                <Link to={'/'}>Home</Link>
              </li>
              <li className="breadcrumb-item" aria-current="page">
                About
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      {/* About Start */}
      <div className="container-fluid py-5 my-5">
        <div className="container py-5">
          <div className="row g-5">
            <div
              className="col-lg-5 col-md-6 col-sm-12 wow fadeIn"
              data-wow-delay=".3s"
            >
              <div className="h-100 position-relative">
                <img
                  src="img/about-1.jpg"
                  className="img-fluid w-75 rounded"
                  alt=""
                  style={{ marginBottom: "0%", maxHeight: "280px", objectFit: "cover" }}
                />
                <div
                  className="position-absolute w-75"
                  style={{ top: "25%", left: "25%" }}
                >
                  <img
                    src="img/about-2.jpg"
                    className="img-fluid w-100 rounded"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <div
              className="col-lg-7 col-md-6 col-sm-12 wow fadeIn"
              data-wow-delay=".5s"
            >
              <h5 className="!text-purple-900">About WorkHouse</h5>
              <h1 className="">
                Innovative task & workflow management
              </h1>
              <p>
                WorkHouse helps teams and individuals plan work, track progress, and finish tasks on time.
                It keeps priorities clear, statuses updated, and everything organized in one place.
              </p>
              <p className="">
                Assign tasks, monitor deadlines, and stay aligned—so your workflow runs smoothly.
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
    </>
  );
}

