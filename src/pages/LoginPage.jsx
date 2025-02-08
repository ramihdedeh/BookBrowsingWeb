import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import "../styles/Login.css"; // Import CSS
import bookImage from "../assets/books.jpeg"; // Import image

const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    } else {
      // Clear search data on login screen load
      localStorage.removeItem("bookSearchQuery");
      localStorage.removeItem("bookSearchResults");
      localStorage.removeItem("bookSortOption");
      localStorage.removeItem("authorSearchQuery");
      localStorage.removeItem("authorSearchResults");
      localStorage.removeItem("authorName");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-container">
      {/* Left Side (Login Text & Button) */}
      <div className="left-section">
        <Typography className="login-title">
          {isAuthenticated ? `Welcome, ${user?.name}` : "Login to Access"}
        </Typography>

        {!isAuthenticated ? (
          <Button className="login-button" onClick={() => loginWithRedirect()}>
            Login
          </Button>
        ) : (
          <Button className="login-button" onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
          </Button>
        )}
      </div>

      {/* Right Side (Book Image) */}
      <div className="right-section">
        <img src={bookImage} alt="Books" className="book-image" />
      </div>
    </div>
  );
};

export default LoginPage;
