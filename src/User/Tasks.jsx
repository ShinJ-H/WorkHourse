import { useEffect, useState } from "react";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();

    const interval = setInterval(fetchTasks, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {tasks.length === 0 ? (

          <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10">
            <p className="text-base font-medium text-slate-700">
              No Tasks Found
            </p>
          </div>

        ) : (

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {tasks.map((task) => {

              const taskId = task._id || task.id;

              const isImage =
                task.file?.url &&
                task.file.url.match(/\.(jpg|jpeg|png|webp)$/i);

              return (
                <div
                  key={taskId}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >

                  {/* IMAGE */}
                  <div className="relative h-44 w-full bg-slate-100">

                    {isImage ? (
                      <img
                        src={task.file.url}
                        alt=""
                        className="h-full w-full cursor-pointer object-cover"
                        onClick={() =>
                          setSelectedImage(task.file.url)
                        }
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center">
                          <p className="text-sm font-semibold text-slate-700">
                            Document
                          </p>
                        </div>
                      </div>
                    )}

                    {/* STATUS */}
                    <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                      {task.status}
                    </span>

                  </div>

                  {/* CONTENT */}
                  <div className="p-4">

                    {/* TITLE */}
                    <h3 className="text-lg font-bold text-slate-800">
                      {task.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="mt-2 text-sm text-slate-600">
                      {task.description}
                    </p>

                    {/* DETAILS */}
                    <div className="mt-4 space-y-1 text-sm text-slate-600">

                      <p>
                        <span className="font-semibold">
                          Priority:
                        </span>{" "}
                        {task.priority}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Start:
                        </span>{" "}
                        {task.startDate
                          ? new Date(task.startDate).toDateString()
                          : "N/A"}
                      </p>

                      <p>
                        <span className="font-semibold">
                          End:
                        </span>{" "}
                        {task.endDate
                          ? new Date(task.endDate).toDateString()
                          : "N/A"}
                      </p>

                    </div>

                    {/* FILE BUTTON */}
                    {task.file?.url && !isImage && (
                      <a
                        href={task.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                      >
                        Open File
                      </a>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >

          <button
            type="button"
            className="absolute right-6 top-6 text-4xl text-white"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>

          <img
            src={selectedImage}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

        </div>
      )}
    </div>
  );
};

export default Tasks;