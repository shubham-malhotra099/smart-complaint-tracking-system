import { useEffect, useState } from "react";

import API from "../../services/api";

const DEFAULT_IMAGE = "/default-complaint.svg";

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);

  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/public");

      setComplaints(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVote = async (id) => {
    try {
      await API.put(`/complaints/vote/${id}`);

      fetchComplaints();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Voting failed"
      );
    }
  };

  const countByStatus = (status) =>
    complaints.filter(
      (complaint) => complaint.status === status
    ).length;

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter(
          (complaint) => complaint.status === filter
        );

  const sortedComplaints = [...filteredComplaints].sort(
    (a, b) =>
      (b.voteCount || 0) - (a.voteCount || 0)
  );

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-3">
        Public Complaint Dashboard
      </h1>

      <p className="text-gray-600 mb-8">
        View complaints reported by citizens and vote to prioritize important issues.
      </p>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-gray-500">
            Total Complaints
          </h2>

          <p className="text-3xl font-bold mt-2">
            {complaints.length}
          </p>
        </div>

        <div className="bg-yellow-100 shadow-lg rounded-xl p-6">
          <h2 className="text-yellow-700">
            Pending
          </h2>

          <p className="text-3xl font-bold mt-2">
            {countByStatus("Pending")}
          </p>
        </div>

        <div className="bg-blue-100 shadow-lg rounded-xl p-6">
          <h2 className="text-blue-700">
            In Progress
          </h2>

          <p className="text-3xl font-bold mt-2">
            {countByStatus("In Progress")}
          </p>
        </div>

        <div className="bg-green-100 shadow-lg rounded-xl p-6">
          <h2 className="text-green-700">
            Resolved
          </h2>

          <p className="text-3xl font-bold mt-2">
            {countByStatus("Resolved")}
          </p>
        </div>
      </div>

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
                : "bg-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* COMPLAINT LIST */}
      {sortedComplaints.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold">
            No complaints found
          </h2>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {sortedComplaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="w-full h-64 bg-gray-200 overflow-hidden">
                <img
                  src={complaint.image || DEFAULT_IMAGE}
                  alt="Complaint"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_IMAGE;
                  }}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {complaint.title}
                    </h2>

                    <p className="text-gray-600 mt-2">
                      {complaint.description}
                    </p>
                  </div>

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
                </div>

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
                      Created:
                    </span>{" "}
                    {new Date(
                      complaint.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="font-bold text-lg">
                      Priority Votes:{" "}
                      {complaint.voteCount || 0}
                    </p>

                    <p className="text-gray-500 text-sm">
                      More votes means higher priority.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      handleVote(complaint._id)
                    }
                    className={`px-5 py-2 rounded-lg font-semibold ${
                      complaint.hasVoted
                        ? "bg-red-500 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {complaint.hasVoted
                      ? "Remove Vote"
                      : "Vote"}
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  You can only vote here. You can edit/delete only your own pending complaints from My Complaints.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;