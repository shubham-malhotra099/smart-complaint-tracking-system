import { useEffect, useState } from "react";

import API from "../../services/api";

const DEFAULT_IMAGE = "/default-complaint.svg";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/my");

      setComplaints(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/complaints/my/${id}`);

      alert("Complaint deleted successfully");

      fetchComplaints();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  const handleEdit = async (complaint) => {
    const title = prompt("Enter title", complaint.title);

    if (title === null) return;

    const description = prompt(
      "Enter description",
      complaint.description
    );

    if (description === null) return;

    const category = prompt(
      "Enter category",
      complaint.category
    );

    if (category === null) return;

    const location = prompt(
      "Enter location",
      complaint.location
    );

    if (location === null) return;

    if (
      !title.trim() ||
      !description.trim() ||
      !category.trim() ||
      !location.trim()
    ) {
      alert("All fields are required");
      return;
    }

    try {
      await API.put(
        `/complaints/my/${complaint._id}`,
        {
          title,
          description,
          category,
          location,
        }
      );

      alert("Complaint updated successfully");

      fetchComplaints();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Update failed"
      );
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">
        My Complaints
      </h1>

      {complaints.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold">
            No complaints found
          </h2>

          <p className="text-gray-600 mt-3">
            Create your first complaint.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* LEFT SIDE */}
                <div>
                  <div className="w-full h-72 bg-gray-200 overflow-hidden rounded-lg mb-5">
                    <img
                      src={complaint.image || DEFAULT_IMAGE}
                      alt="Complaint"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <h2 className="text-3xl font-bold">
                    {complaint.title}
                  </h2>

                  <p className="text-gray-700 mt-4">
                    {complaint.description}
                  </p>

                  <div className="mt-5 space-y-2">
                    <p>
                      <span className="font-semibold">
                        Category:
                      </span>{" "}
                      {complaint.category}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Location:
                      </span>{" "}
                      {complaint.location}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Created:
                      </span>{" "}
                      {new Date(
                        complaint.createdAt
                      ).toLocaleString()}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Last Updated:
                      </span>{" "}
                      {new Date(
                        complaint.updatedAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  {complaint.status === "Pending" && (
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() =>
                          handleEdit(complaint)
                        }
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(complaint._id)
                        }
                        className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* RIGHT SIDE */}
                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    Complaint Tracking
                  </h3>

                  <div className="mb-6">
                    <span
                      className={`px-5 py-2 rounded-full text-white font-bold ${
                        complaint.status === "Pending"
                          ? "bg-yellow-500"
                          : complaint.status === "Resolved"
                          ? "bg-green-600"
                          : complaint.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-blue-600"
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  <div className="space-y-5 border-l-4 border-blue-500 pl-5">
                    <div>
                      <h4 className="font-bold">
                        Complaint Submitted
                      </h4>

                      <p className="text-gray-600">
                        Your complaint has been registered.
                      </p>
                    </div>

                    {complaint.status !== "Pending" && (
                      <div>
                        <h4 className="font-bold">
                          Complaint Reviewed
                        </h4>

                        <p className="text-gray-600">
                          Admin has reviewed your complaint.
                        </p>
                      </div>
                    )}

                    {complaint.status === "In Progress" && (
                      <div>
                        <h4 className="font-bold">
                          Work In Progress
                        </h4>

                        <p className="text-gray-600">
                          Authorities are working on the issue.
                        </p>
                      </div>
                    )}

                    {complaint.status === "Resolved" && (
                      <div>
                        <h4 className="font-bold text-green-700">
                          Complaint Resolved
                        </h4>

                        <p className="text-gray-600">
                          Your issue has been resolved successfully.
                        </p>
                      </div>
                    )}

                    {complaint.status === "Rejected" && (
                      <div>
                        <h4 className="font-bold text-red-600">
                          Complaint Rejected
                        </h4>

                        <p className="text-gray-600">
                          Your complaint was rejected by admin.
                        </p>
                      </div>
                    )}
                  </div>

                  {complaint.adminRemark && (
                    <div className="mt-8 bg-gray-100 p-5 rounded-lg">
                      <h3 className="text-xl font-bold mb-2">
                        Admin Remark
                      </h3>

                      <p>{complaint.adminRemark}</p>
                    </div>
                  )}

                  {complaint.resolutionImage && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">
                        Resolution Proof
                      </h3>

                      <div className="w-full h-64 bg-gray-200 overflow-hidden rounded-lg">
                        <img
                          src={complaint.resolutionImage}
                          alt="Resolution Proof"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;