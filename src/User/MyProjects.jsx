import { useEffect, useState } from "react";
import axios from "axios";

export default function MyProjects() {
    const [projects, setProjects] = useState([]);
    const user = JSON.parse(
        localStorage.getItem("user")
    );
    const fetchProjects = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/projects/user/${user._id}`
            );
            setProjects(res.data.projects);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchProjects();
    }, []);
    return (
        <div className="container mt-4">
            <h2 className="mb-4">
                My Projects
            </h2>
            <div className="row">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div
                            className="col-md-4 mb-4"
                            key={project._id}
                        >
                            <div className="card shadow p-3 h-100">
                                <h4>
                                    {project.title}
                                </h4>
                                <p>
                                    {project.description}
                                </p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    {project.status}
                                </p>
                                <p>
                                    <strong>Start Date:</strong>{" "}
                                    {project.startDate
                                        ? new Date(
                                            project.startDate
                                        ).toLocaleDateString()
                                        : "N/A"}
                                </p>
                                <p>
                                    <strong>End Date:</strong>{" "}
                                    {project.endDate
                                        ? new Date(
                                            project.endDate
                                        ).toLocaleDateString()
                                        : "N/A"}
                                </p>
                                {/* FILES */}
                                <div className="mt-3">
                                    <h6>
                                        Files
                                    </h6>
                                    {project.files?.length ? (
                                        <ul className="ps-3">
                                            {project.files.map(
                                                (f, idx) => {
                                                    const isImage =
                                                        f.mimeType?.startsWith(
                                                            "image/"
                                                        );
                                                    return (
                                                        <li key={idx} className="mb-2">
                                                            {isImage ? (
                                                                <div>
                                                                    <div className="w-100 bg-light rounded overflow-hidden">
                                                                        <img
                                                                            src={f.url}
                                                                            alt={
                                                                                f.originalName ||
                                                                                "Uploaded file"
                                                                            }
                                                                            className="w-100 h-48 object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="mt-1">
                                                                        <a
                                                                            href={f.url}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="text-decoration-none"
                                                                        >
                                                                            {f.originalName ||
                                                                                "View"}
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <a
                                                                        href={f.url}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="text-decoration-none"
                                                                    >
                                                                        {f.originalName ||
                                                                            "File"}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="text-secondary">
                                            No files
                                        </p>
                                    )}
                                </div>
                                {/* TEAM */}
                                <h6 className="mt-3">
                                    Team Members
                                </h6>
                                <ul>
                                    {project.team?.map(
                                        (member) => (
                                            <li
                                                key={member._id}
                                            >
                                                {member.name}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))
                ) : (
                    <h5>
                        No Projects Assigned
                    </h5>
                )}
            </div>
        </div>
    );
}