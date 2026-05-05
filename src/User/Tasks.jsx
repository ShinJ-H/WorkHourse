// import { useEffect, useState } from "react";
// import axios from "axios";

// const Tasks = () => {
//   const [tasks, setTasks] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);

//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/tasks");
//       console.log("TASKS DATA:", res.data);
//       setTasks(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();

//     const interval = setInterval(fetchTasks, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="container-fluid blog py-5 my-5">
//       <div className="container py-5">
//         <div className="row g-5 justify-content-center">

//           {tasks.length === 0 ? (
//             <p>No Tasks Found</p>
//           ) : (
//             tasks.map((task) => {

//               const taskId = task._id || task.id;

//               return (
//                 <div key={taskId} className="col-lg-6 col-xl-4">
//                   <div className="blog-item position-relative bg-light rounded">

//                     {/* ✅ SHOW IMAGE ONLY IF IT IS IMAGE */}
//                     {task.file?.url &&
//                       task.file.url.match(/\.(jpg|jpeg|png|webp)$/i) && (
//                         <img
//                           src={task.file.url}
//                           className="w-100 rounded-top"
//                           alt=""
//                           style={{
//                             height: "200px",
//                             objectFit: "cover",
//                             width: "100%",
//                             cursor: "pointer"
//                           }}
//                           onClick={() => setSelectedImage(task.file.url)}
//                         />
//                       )}

//                     {/* STATUS */}
//                     <span
//                       className="position-absolute px-4 py-3 bg-primary text-white rounded"
//                       style={{ top: "-28px", right: 20 }}
//                     >
//                       {task.status}
//                     </span>

//                     {/* CONTENT */}
//                     <div
//                       className="blog-content text-center px-3"
//                       style={{ marginTop: "-25px" }}
//                     >
//                       <h5>{task.title}</h5>
//                       <p>{task.description}</p>

//                       <small className="text-secondary d-block">
//                         Priority: {task.priority}
//                       </small>

//                       <small className="text-secondary d-block">
//                         Start: {new Date(task.startDate).toDateString()}
//                       </small>

//                       <small className="text-secondary d-block">
//                         End: {new Date(task.endDate).toDateString()}
//                       </small>

//                       {/* FILE BUTTON FOR DOCUMENTS */}
//                       {task.file?.url &&
//                         !task.file.url.match(/\.(jpg|jpeg|png|webp)$/i) && (
//                           <a
//                             href={task.file.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="btn btn-sm btn-primary mt-2"
//                           >
//                             Open File
//                           </a>
//                         )}
//                     </div>

//                     {/* FOOTER */}
//                     <div className="blog-coment d-flex justify-content-between px-4 py-2 border bg-primary rounded-bottom">
//                       <span className="text-white">
//                         Priority: {task.priority}
//                       </span>
//                     </div>

//                   </div>
//                 </div>
//               );
//             })
//           )}

//         </div>
//       </div>

//       {/* IMAGE MODAL */}
//       {selectedImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[9999]"
//           onClick={() => setSelectedImage(null)}
//         >
//           <span
//             className="absolute top-5 right-8 text-white text-4xl cursor-pointer"
//             onClick={() => setSelectedImage(null)}
//           >
//             &times;
//           </span>

//           <img
//             src={selectedImage}
//             alt="Preview"
//             className="max-w-[90%] max-h-[90%] rounded-lg"
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Tasks;

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
    <div className="container-fluid blog py-5 my-5">
      <div className="container py-5">
        <div className="row g-5 justify-content-center">

          {tasks.length === 0 ? (
            <p>No Tasks Found</p>
          ) : (
            tasks.map((task) => {
              const taskId = task._id || task.id;

              const isImage =
                task.file?.url &&
                task.file.url.match(/\.(jpg|jpeg|png|webp)$/i);

              return (
                <div key={taskId} className="col-lg-6 col-xl-4">
                  
                  {/* ✅ FIXED CARD STRUCTURE */}
                  <div className="blog-item position-relative bg-light rounded h-100 d-flex flex-column">

                    {/* ✅ IMAGE / EMPTY SPACE */}
                    <div
                      style={{
                        height: "200px",
                        width: "100%",
                        overflow: "hidden",
                        background: "#f5f5f5",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                      }}
                    >
                      {isImage && (
                        <img
                          src={task.file.url}
                          alt=""
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          onClick={() => setSelectedImage(task.file.url)}
                        />
                      )}
                    </div>

                    {/* STATUS */}
                    <span
                      className="position-absolute px-4 py-3 bg-primary text-white rounded"
                      style={{ top: "-28px", right: 20 }}
                    >
                      {task.status}
                    </span>

                    {/* CONTENT */}
                    <div
                      className="blog-content text-center px-3 flex-grow-1"
                      style={{ marginTop: "-25px" }}
                    >
                      <h5>{task.title}</h5>
                      <p>{task.description}</p>

                      <small className="text-secondary d-block">
                        Priority: {task.priority}
                      </small>

                      <small className="text-secondary d-block">
                        Start:{" "}
                        {task.startDate
                          ? new Date(task.startDate).toDateString()
                          : "N/A"}
                      </small>

                      <small className="text-secondary d-block">
                        End:{" "}
                        {task.endDate
                          ? new Date(task.endDate).toDateString()
                          : "N/A"}
                      </small>

                      {/* ✅ DOCUMENT BUTTON */}
                      {task.file?.url && !isImage && (
                        <a
                          href={task.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary mt-2"
                        >
                          Open File
                        </a>
                      )}
                    </div>

                    {/* FOOTER */}
                    <div className="blog-coment d-flex justify-content-between px-4 py-2 border bg-primary rounded-bottom">
                      <span className="text-white">
                        Priority: {task.priority}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })
          )}

        </div>
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[9999]"
          onClick={() => setSelectedImage(null)}
        >
          <span
            className="absolute top-5 right-8 text-white text-4xl cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </span>

          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Tasks;