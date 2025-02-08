import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const userPermissions = {
  "grappasystems3@gmail.com": ["books", "authors"], // Can access books & authors
  "grappasystems4@gmail.com": ["authors"], // Can access authors only
  "grappasystems5@gmail.com": ["books"], // Can access books only
};

const PrivateRoute = ({ component: Component, permission, onUnauthorized }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) return <p>Loading...</p>;

  console.log("User Data:", user);
  console.log("Is Authenticated:", isAuthenticated);

  if (!isAuthenticated) {
    console.log("User is not authenticated, redirecting...");
    return <Navigate to="/" replace />;
  }

  if (!user) {
    console.log("No user found, redirecting...");
    return <Navigate to="/" replace />;
  }

  const allowedPermissions = userPermissions[user.email] || [];
  console.log(`Allowed Permissions for ${user.email}:`, allowedPermissions);
  const hasPermission = allowedPermissions.includes(permission);
  console.log(`Required Permission: ${permission}, User Has Permission: ${hasPermission}`);

  if (!hasPermission) {
    console.log("User does not have permission, showing notification...");
    if (onUnauthorized) onUnauthorized("You do not have permission to access this page.");
    return <Navigate to="/" replace />;
  }

  console.log("User has access! Rendering the page...");
  return <Component />;
};

export default PrivateRoute;
