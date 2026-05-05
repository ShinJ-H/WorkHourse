import axios from "axios";
import { useEffect, useState } from "react";

export default function AssignTasks() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        userId: "",
        priority: "",
        startDate: "",
        endDate: ""
    });

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [fileKey, setFileKey] = useState(Date.now());

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get("http://localhost:5000/api/users");
            setUsers(res.data);
        };

        fetchUsers();
    }, []);

    // Handle input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ✅ Handle file
    const handleChangeImage = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        setFile(selectedFile);

        // Create preview URL for ALL files
        setPreview({
            url: URL.createObjectURL(selectedFile),
            type: selectedFile.type,
            name: selectedFile.name
        });
    };

    // Submit task
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            setError("End date must be after start date");
            return;
        }

        try {
            const data = new FormData();

            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("userId", formData.userId);
            data.append("priority", formData.priority);
            data.append("startDate", formData.startDate);
            data.append("endDate", formData.endDate);

            if (file) {
                data.append("file", file);
            }
            const res = await axios.post(
                "http://localhost:5000/api/tasks/create",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setMessage(res.data.message);

            setFormData({
                title: "",
                description: "",
                userId: "",
                priority: "",
                startDate: "",
                endDate: ""
            });
            setFile(null);
            setPreview(null);
            setFileKey(Date.now());

        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Something went wrong");
        }
    };
    return (
        <>
            {/* Page Header Start */}
            <div className="container-fluid page-header py-5">
                <div className="container text-center py-5">
                    <h1 className="display-2 text-white mb-4 animated slideInDown">
                        Assign Tasks
                    </h1>
                </div>
            </div>
            {/* Page Header End */}
            {/* Contact Start */}
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="text-center mx-auto pb-5 wow fadeIn" data-wow-delay=".3s" style={{ maxWidth: 600 }} >
                        <h1 className="mb-3">Welcome User</h1>
                    </div>
                    <div className="contact-detail position-relative p-4 p-md-5">
                        <div className="row g-5">
                            <div className="col-lg-6 wow fadeIn" data-wow-delay=".5s" style={{ marginLeft: "25%" }}>
                                {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
                                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                                {preview && (
                                    <div style={{ textAlign: "center", marginTop: "10px" }}>

                                        {/* IMAGE */}
                                        {preview.type.startsWith("image") && (
                                            <img
                                                src={preview.url}
                                                alt="Preview"
                                                style={{
                                                    width: "70%",
                                                    height: "70%",
                                                    objectFit: "cover",
                                                    borderRadius: "10px"
                                                }}
                                            />
                                        )}

                                        {/* PDF */}
                                        {preview.type === "application/pdf" && (
                                            <iframe
                                                src={preview.url}
                                                title="PDF Preview"
                                                width="100%"
                                                height="400px"
                                            />
                                        )}

                                        {/* OTHER FILES */}
                                        {!preview.type.startsWith("image") &&
                                            preview.type !== "application/pdf" && (
                                                <p>{preview.name}</p>
                                            )}
                                    </div>
                                )}
                                <form className="p-4 p-md-5 rounded contact-form" onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <input className="form-control border-0 py-3" type="text"
                                            name="title"
                                            placeholder="Task Title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <textarea className="form-control border-0 py-3" type="text"
                                            name="description"
                                            placeholder="Task Description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <select className="form-control border-0 py-3" type="text"
                                            name="userId"
                                            value={formData.userId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select User</option>

                                            {users.map((user) => (
                                                <option key={user._id} value={user._id}>
                                                    {user.name} ({user.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <select
                                            className="form-control border-0 py-3"
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Priority</option>
                                            <option value="Low">Low Priority</option>
                                            <option value="Medium">Medium Priority</option>
                                            <option value="High">High Priority</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            required
                                            className="form-control border-0 py-3"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            required
                                            className="form-control border-0 py-3"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <input
                                            key={fileKey}
                                            type="file"
                                            onChange={handleChangeImage}
                                        />
                                    </div>
                                    <div className="text-start">
                                        <button className="btn bg-primary text-white py-3 px-5" type="submit">
                                            Assign Task
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {/* Contact End */}
        </>
    )
}