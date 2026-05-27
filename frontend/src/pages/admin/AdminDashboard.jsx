import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../../services/api";

const AdminDashboard = () => {

  const [complaints, setComplaints] =
    useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {

      const res = await API.get(
        "/complaints"
      );

      setComplaints(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const countByStatus = (status) =>
    complaints.filter(
      (c) => c.status === status
    ).length;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>


      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white shadow-lg rounded-xl p-6">

          <h2 className="text-gray-500 text-lg">
            Total Complaints
          </h2>

          <p className="text-3xl font-bold mt-2">
            {complaints.length}
          </p>

        </div>


        <div className="bg-yellow-100 shadow-lg rounded-xl p-6">

          <h2 className="text-yellow-700 text-lg">
            Pending
          </h2>

          <p className="text-3xl font-bold mt-2">
            {countByStatus("Pending")}
          </p>

        </div>


        <div className="bg-blue-100 shadow-lg rounded-xl p-6">

          <h2 className="text-blue-700 text-lg">
            In Progress
          </h2>

          <p className="text-3xl font-bold mt-2">
            {countByStatus("In Progress")}
          </p>

        </div>


        <div className="bg-green-100 shadow-lg rounded-xl p-6">

          <h2 className="text-green-700 text-lg">
            Resolved
          </h2>

          <p className="text-3xl font-bold mt-2">
            {countByStatus("Resolved")}
          </p>

        </div>

      </div>



      {/* QUICK ACTIONS */}
      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-4">
          Quick Actions
        </h2>

        <div className="flex gap-4">

          <button
            onClick={() =>
              navigate("/admin/complaints")
            }
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow"
          >
            Manage Complaints
          </button>

        </div>

      </div>



      {/* RECENT COMPLAINTS */}
      <div className="mt-12">

        <h2 className="text-2xl font-bold mb-6">
          Recent Complaints
        </h2>

        <div className="space-y-4">

          {complaints
            .slice(0, 5)
            .map((complaint) => (

              <div
                key={complaint._id}
                className="bg-white p-5 rounded-lg shadow flex justify-between items-center"
              >

                <div>

                  <h3 className="text-xl font-bold">
                    {complaint.title}
                  </h3>

                  <p className="text-gray-600">
                    {complaint.description}
                  </p>

                  <p className="text-sm mt-1">
                    User:
                    {" "}
                    {complaint.createdBy?.name}
                  </p>

                </div>


                <div>

                  <span
                    className={`px-4 py-2 rounded text-white font-semibold ${
                      complaint.status ===
                      "Pending"
                        ? "bg-yellow-500"
                        : complaint.status ===
                          "Resolved"
                        ? "bg-green-600"
                        : complaint.status ===
                          "Rejected"
                        ? "bg-red-500"
                        : "bg-blue-600"
                    }`}
                  >
                    {complaint.status}
                  </span>

                </div>

              </div>
            ))}

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;