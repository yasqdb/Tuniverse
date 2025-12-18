

import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  console.log("PrivateRoute checking token:", token);
  console.log("Current path:", window.location.pathname);
  
  if (!token || token === "undefined" || token === "null") {
      console.log("No token, redirecting to login");
      return <Navigate to="/login" replace />;
    }
  
  console.log("Token exists, rendering children");
  return children;
};

export default PrivateRoute;
