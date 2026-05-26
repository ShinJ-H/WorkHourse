//UpdateModal.jsx

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const getUniqueExtensions = (items) => {
  const exts = new Set();
  if (!Array.isArray(items)) return [];

  for (const f of items) {
    const url = f?.url || f?.path;
    const originalName = f?.originalName;
    const mimeType = f?.mimeType;

    const candidate = originalName || (url ? String(url).split("/").pop() : "");
    const match = candidate?.match(/\.([A-Za-z0-9]+)$/);
    if (match?.[1]) {
      exts.add(match[1].toLowerCase());
      continue;
    }

    // Fallback: try from mimeType
    if (mimeType === "application/pdf") exts.add("pdf");
  }

  return [...exts];
};

const normalizeStatus = (status) => {
  if (!status) return "inProgress";
  const s = String(status).toLowerCase();
  if (s.includes("complete")) return "completed";
  if (s.includes("progress")) return "inProgress";
  if (s.includes("in")) return "inProgress";
  if (s.includes("pending")) return "inProgress";
  return "inProgress";
};

const formatDate = (d) => {
  if (!d) return "N/A";
  try {
    return new Date(d).toDateString();
  } catch {
    return "N/A";
  }
};

export default function UpdateModal({
  open,
  onClose,
  mode,
  item,
}) {
  const [localStatus, setLocalStatus] = useState("inProgress");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);



  useEffect(() => {

  if (!open) return;

  if (mode === "project") {

    const currentUser = JSON.parse(
      localStorage.getItem("user")
    );

    const member = item?.team?.find(
      (m) =>
        m.user?._id === currentUser?._id
    );

    setLocalStatus(
      normalizeStatus(member?.status)
    );

  } else {

    setLocalStatus(
      normalizeStatus(item?.status)
    );
  }

  setSelectedFiles([]);

}, [open, item, mode]);

  const extensionsValue = useMemo(() => {
    if (!item) return "";

    if (mode === "task") {
      const url = item?.file?.url || item?.file?.path;
      const originalName = item?.file?.originalName;
      const candidate = originalName || (url ? String(url).split("/").pop() : "");
      const match = candidate?.match(/\.([A-Za-z0-9]+)$/);
      if (match?.[1]) return match[1].toLowerCase();

      if (item?.file?.mimeType === "application/pdf") return "pdf";

      return "";
    }

    // project
    const exts = getUniqueExtensions(item?.files);
    return exts.join(", ");
  }, [item, mode]);

  const statusLabel = useMemo(() => {
    if (localStatus === "completed") return "Completed";
    return "In Progress";
  }, [localStatus]);

  if (!open || !item) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl bg-white p-4 max-h-[85vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {mode === "task" ? "Task Details" : "Project Details"}
            </h2>
            <p className="text-sm text-slate-600">
              Read-only details from saved record
            </p>
          </div>
          <button
            type="button"
            className="text-3xl leading-none text-slate-900"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="mt-4 space-y-4">

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Title
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
              value={item?.title || ""}
              disabled
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              className="mt-1 w-full resize-none rounded-lg border border-slate-200 px-3 py-2"
              rows={3}
              value={item?.description || ""}
              disabled
              readOnly
            />
          </div>

          {mode === "task" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Priority
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={item?.priority || ""}
                  disabled
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Status
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 bg-white"
                  value={localStatus}
                  onChange={(e) => setLocalStatus(e.target.value)}
                >
                  <option value="inProgress">In Progress</option>
                  <option value="completed">Complete</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">Current: {statusLabel}</p>
              </div>
            </div>
          )}

          {/* PROJECT MODAL */}

          {mode === "project" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Status
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 bg-white"
                  value={localStatus}
                  onChange={(e) => setLocalStatus(e.target.value)}
                >
                  <option value="inProgress">In Progress</option>
                  <option value="completed">Complete</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">Current: {statusLabel}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  File extensions
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={extensionsValue}
                  disabled
                  readOnly
                />
              </div>
            </div>
          )}

          {mode === "task" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                File extensions
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                value={extensionsValue}
                disabled
                readOnly
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Start Date
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                value={formatDate(item?.startDate)}
                disabled
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                End Date
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                value={formatDate(item?.endDate)}
                disabled
                readOnly
              />
            </div>
          </div>

          {mode === "task" ? (
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                File extensions
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                value={extensionsValue}
                disabled
                readOnly
              />

              <div className="mt-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Attached file
                </label>
                {item?.file?.url ? (
                  <a
                    href={item.file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                  >
                    Open File
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">No file</p>
                )}

                <div className="mt-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Choose file to attach
                  </label>
                  <input
                    type="file"
                    className="mt-1 w-full"
                    accept="*/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setSelectedFiles(files);
                    }}
                  />

                  {selectedFiles.length ? (
                    <p className="mt-2 text-xs text-slate-600">
                      Selected: {selectedFiles.map((f) => f.name).join(", ")}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">No new file selected</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Files (read-only)
              </label>
              <div className="mt-2 space-y-2">
                {Array.isArray(item?.files) && item.files.length ? (
                  <div className="space-y-2">
                    {item.files.map((f, idx) => (
                      <div key={idx}>
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-700 underline"
                        >
                          {f.originalName || `File ${idx + 1}`}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">No files</p>
                )}
              </div>

              <div className="mt-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Choose files to attach
                </label>
                <input
                  type="file"
                  multiple
                  className="mt-1 w-full"
                  accept="*/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setSelectedFiles(files);
                  }}
                />

                {selectedFiles.length ? (
                  <p className="mt-2 text-xs text-slate-600">
                    Selected: {selectedFiles.map((f) => f.name).join(", ")}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">No new files selected</p>
                )}
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              disabled={submitting}
              onClick={async () => {

  if (submitting) return;

  const tokenUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const userId = tokenUser?._id;

  try {

    setSubmitting(true);

    // ================= TASK =================

    if (mode === "task") {

      const formData = new FormData();

      formData.append(
        "title",
        item?.title || ""
      );

      formData.append(
        "description",
        item?.description || ""
      );

      if (item?.priority != null) {

        formData.append(
          "priority",
          item?.priority
        );
      }

      formData.append(
        "userId",
        userId || item?.user || ""
      );

      formData.append(
        "startDate",
        item?.startDate || ""
      );

      formData.append(
        "endDate",
        item?.endDate || ""
      );

      formData.append(
        "status",
        localStatus === "completed"
          ? "Completed"
          : "In Progress"
      );

      // SINGLE FILE
      if (selectedFiles?.length) {

        formData.append(
          "file",
          selectedFiles[0]
        );
      }

      await axios.put(
        `http://localhost:5000/api/tasks/${item?._id || item?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      window.dispatchEvent(
        new Event("taskUpdated")
      );

    }

    // ================= PROJECT =================

    else {

      await axios.put(
        `http://localhost:5000/api/projects/member-status/${item?._id || item?.id}`,
        {
          status:
            localStatus === "completed"
              ? "Completed"
              : "In Progress",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      window.dispatchEvent(
        new Event("projectUpdated")
      );
    }

    onClose();

  } catch (e) {

    console.log(e);

  } finally {

    setSubmitting(false);
  }
}}
            >
              Submit to Admin & Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

