import { Navigate } from "react-router-dom";

import {
  useContext,
} from "react";

import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {
  const {
    user,
    loading,
  } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.user.role)
  ) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;