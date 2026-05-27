import {
  useState,
  useContext,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { AuthContext } from "../../context/AuthContext";

import API from "../../services/api";

const Login = () => {

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [showPassword, setShowPassword] =
    useState(false);

  const { login } =
    useContext(AuthContext);

  const navigate = useNavigate();



  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        formData
      );

      login(res.data);

      navigate("/");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login failed"
      );

    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >

        <h2 className="text-3xl font-bold mb-6 text-center">
          Login
        </h2>



        <input
          type="email"
          name="email"
          placeholder="Enter email"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
        />



        {/* PASSWORD */}
        <div className="relative mb-4">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="password"
            placeholder="Enter password"
            className="w-full p-3 border rounded"
            onChange={handleChange}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="absolute right-4 top-4 text-gray-600"
          >

            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}

          </button>

        </div>



        <button
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
        >
          Login
        </button>



        <p className="mt-5 text-center">

          Don't have an account?

          <Link
            to="/register"
            className="text-blue-600 ml-2 font-semibold"
          >
            Register
          </Link>

        </p>

      </form>

    </div>
  );
};

export default Login;