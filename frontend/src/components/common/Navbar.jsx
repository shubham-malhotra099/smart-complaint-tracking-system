import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useContext,
} from "react";

import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useContext(AuthContext);

  const logoutHandler = () => {
    logout();

    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white px-8 py-4 flex justify-between items-center shadow-md">
      <Link
        to="/"
        className="font-bold text-2xl"
      >
        Smart Complaint & Issue Tracking System
      </Link>

      <div className="flex gap-5 items-center">
        {user && (
          <span className="font-semibold text-lg">
            Welcome, {user.user.name}
          </span>
        )}

        {user?.user?.role === "user" && (
          <>
            <Link
              to="/user/dashboard"
              className="hover:text-gray-200"
            >
              Dashboard
            </Link>

            <Link
              to="/user/create"
              className="hover:text-gray-200"
            >
              Create Complaint
            </Link>

            <Link
              to="/user/complaints"
              className="hover:text-gray-200"
            >
              My Complaints
            </Link>
          </>
        )}

        {user?.user?.role === "admin" && (
          <>
            <Link
              to="/admin/dashboard"
              className="hover:text-gray-200"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/complaints"
              className="hover:text-gray-200"
            >
              Manage Complaints
            </Link>
          </>
        )}

        {!user ? (
          <>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-black text-white px-4 py-2 rounded-lg font-semibold"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={logoutHandler}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;