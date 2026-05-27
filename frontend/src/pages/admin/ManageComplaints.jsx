import { useEffect, useState } from "react";

import API from "../../services/api";

const DEFAULT_IMAGE = "/default-complaint.svg";

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  const [filter, setFilter] = useState("All");

  const [adminRemark, setAdminRemark] = useState({});

  const [resolutionImage, setResolutionImage] = useState({});

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");

      setComplaints(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const formData = new FormData();

      formData.append("status", status);

      formData.append("adminRemark", adminRemark[id] || "");

      if (resolutionImage[id]) {
        formData.append("resolutionImage", resolutionImage[id]);
      }

      await API.put(`/complaints/${id}`, formData);

      alert("Complaint updated successfully");

      setAdminRemark({
        ...adminRemark,
        [id]: "",
      });

      setResolutionImage({
        ...resolutionImage,
        [id]: null,
      });

      fetchComplaints();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update complaint"
      );
    }
  };

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter((complaint) => complaint.status === filter);

  const sortedComplaints = [...filteredComplaints].sort(
    (a, b) => (b.votes?.length || 0) - (a.votes?.length || 0)
  );

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-3">
        Manage Complaints
      </h1>

      <p className="text-gray-600 mb-8">
        Review citizen complaints, update their status, add remarks, and upload resolution proof.
      </p>

      {/* FILTERS */}
      <div className="flex gap-4 mb-8 flex-wrap">
        {[
          "All",
          "Pending",
          "In Progress",
          "Resolved",
          "Rejected",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* COMPLAINTS */}
      {sortedComplaints.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold">
            No complaints found
          </h2>

          <p className="text-gray-600 mt-3">
            There are no complaints for the selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedComplaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* LEFT SIDE */}
                <div>
                  <div className="w-full h-72 bg-gray-200 overflow-hidden rounded-lg mb-4">
                    <img
                      src={complaint.image || DEFAULT_IMAGE}
                      alt="Complaint"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <h2 className="text-2xl font-bold">
                    {complaint.title}
                  </h2>

                  <p className="text-gray-700 mt-3">
                    {complaint.description}
                  </p>

                  <div className="mt-5 space-y-2 text-sm">
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
                        Reported By:
                      </span>{" "}
                      {complaint.createdBy?.name || "Unknown"}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Email:
                      </span>{" "}
                      {complaint.createdBy?.email || "Not available"}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Priority Votes:
                      </span>{" "}
                      {complaint.votes?.length || 0}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Created:
                      </span>{" "}
                      {new Date(complaint.createdAt).toLocaleString()}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Last Updated:
                      </span>{" "}
                      {new Date(complaint.updatedAt).toLocaleString()}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Status:
                      </span>{" "}
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm font-bold ${
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
                    </p>
                  </div>

                  {complaint.adminRemark && (
                    <div className="mt-5 bg-gray-100 p-4 rounded-lg">
                      <h3 className="font-bold mb-2">
                        Current Admin Remark
                      </h3>

                      <p className="text-gray-700">
                        {complaint.adminRemark}
                      </p>
                    </div>
                  )}
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-5">
                  <h3 className="text-xl font-bold">
                    Admin Actions
                  </h3>

                  <textarea
                    placeholder="Add or update admin remark..."
                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    value={adminRemark[complaint._id] || ""}
                    onChange={(e) =>
                      setAdminRemark({
                        ...adminRemark,
                        [complaint._id]: e.target.value,
                      })
                    }
                  />

                  <div>
                    <label className="font-semibold block mb-2">
                      Upload Resolution Image
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setResolutionImage({
                          ...resolutionImage,
                          [complaint._id]: e.target.files[0],
                        })
                      }
                      className="block w-full text-sm border rounded-lg p-2 bg-white"
                    />

                    <p className="text-xs text-gray-500 mt-2">
                      Upload proof image when marking a complaint as resolved.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        updateStatus(complaint._id, "In Progress")
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
                    >
                      Mark In Progress
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(complaint._id, "Resolved")
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
                    >
                      Resolve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(complaint._id, "Rejected")
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold"
                    >
                      Reject
                    </button>
                  </div>

                  {complaint.resolutionImage ? (
                    <div className="mt-6">
                      <h3 className="font-bold mb-2">
                        Resolution Proof
                      </h3>

                      <div className="w-full h-60 bg-gray-200 overflow-hidden rounded-lg">
                        <img
                          src={complaint.resolutionImage}
                          alt="Resolution Proof"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 bg-gray-100 p-5 rounded-lg text-gray-600">
                      No resolution image uploaded yet.
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

export default ManageComplaints;