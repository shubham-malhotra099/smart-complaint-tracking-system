import { Link } from "react-router-dom";

const Home = () => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div className="min-h-screen bg-gray-100">


      {/* HERO */}
      <section className="bg-blue-600 text-white py-24 px-10 text-center">

        <h1 className="text-5xl font-bold mb-6">
          Smart Complaint & Issue Tracking System
        </h1>

        <p className="text-xl max-w-3xl mx-auto mb-8">
          A modern platform for citizens to register local complaints,
          track issue resolution, and improve communication with authorities.
        </p>


        {!user ? (

          <div className="flex justify-center gap-5">

            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-black text-white px-8 py-3 rounded-lg font-bold"
            >
              Register
            </Link>

          </div>

        ) : (

          <div>

            {user.user.role === "admin" ? (

              <Link
                to="/admin/dashboard"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold"
              >
                Go to Dashboard
              </Link>

            ) : (

              <Link
                to="/user/dashboard"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold"
              >
                Go to Dashboard
              </Link>

            )}

          </div>
        )}

      </section>



      {/* FEATURES */}
      <section className="py-20 px-10">

        <h2 className="text-4xl font-bold text-center mb-14">
          Key Features
        </h2>


        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">

          <div className="bg-white p-8 rounded-xl shadow-lg">

            <h3 className="text-2xl font-bold mb-4">
              Complaint Registration
            </h3>

            <p className="text-gray-600">
              Users can register local complaints with images,
              categories, and location details.
            </p>

          </div>



          <div className="bg-white p-8 rounded-xl shadow-lg">

            <h3 className="text-2xl font-bold mb-4">
              Real-Time Tracking
            </h3>

            <p className="text-gray-600">
              Track complaint progress from Pending
              to Resolved with complete transparency.
            </p>

          </div>



          <div className="bg-white p-8 rounded-xl shadow-lg">

            <h3 className="text-2xl font-bold mb-4">
              Admin Management
            </h3>

            <p className="text-gray-600">
              Authorities can review complaints,
              update statuses, upload proof images,
              and manage issues efficiently.
            </p>

          </div>

        </div>

      </section>



      {/* HOW IT WORKS */}
      <section className="bg-white py-20 px-10">

        <h2 className="text-4xl font-bold text-center mb-14">
          How It Works
        </h2>


        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto text-center">

          <div>

            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>

            <h3 className="font-bold text-xl mb-2">
              Register
            </h3>

            <p className="text-gray-600">
              Create account and login securely.
            </p>

          </div>



          <div>

            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>

            <h3 className="font-bold text-xl mb-2">
              Submit Complaint
            </h3>

            <p className="text-gray-600">
              Upload complaint details and images.
            </p>

          </div>



          <div>

            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>

            <h3 className="font-bold text-xl mb-2">
              Admin Review
            </h3>

            <p className="text-gray-600">
              Authorities review and process complaints.
            </p>

          </div>



          <div>

            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>

            <h3 className="font-bold text-xl mb-2">
              Resolution
            </h3>

            <p className="text-gray-600">
              Users receive updates and resolution proof.
            </p>

          </div>

        </div>

      </section>



      {/* FOOTER */}
      <footer className="bg-black text-white py-6 text-center">

        <p>
          Smart Complaint & Issue Tracking System © 2026
        </p>

      </footer>

    </div>
  );
};

export default Home;