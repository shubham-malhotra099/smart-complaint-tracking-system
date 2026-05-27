import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/common/Navbar";

import ProtectedRoute from "./components/common/ProtectedRoute";


// PUBLIC PAGES
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";


// USER PAGES
import UserDashboard from "./pages/user/UserDashboard";
import CreateComplaint from "./pages/user/CreateComplaint";
import MyComplaints from "./pages/user/MyComplaints";


// ADMIN PAGES
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageComplaints from "./pages/admin/ManageComplaints";



function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>


        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />



        {/* USER ROUTES */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["user"]}
            >
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/create"
          element={
            <ProtectedRoute
              allowedRoles={["user"]}
            >
              <CreateComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/complaints"
          element={
            <ProtectedRoute
              allowedRoles={["user"]}
            >
              <MyComplaints />
            </ProtectedRoute>
          }
        />



        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <ManageComplaints />
            </ProtectedRoute>
          }
        />



        {/* 404 PAGE */}
        <Route
          path="*"
          element={
            <div className="h-screen flex items-center justify-center text-4xl font-bold">
              404 Page Not Found
            </div>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;