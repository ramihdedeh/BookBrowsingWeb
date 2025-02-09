import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Typography, Snackbar, Alert, Container, Avatar } from "@mui/material";
import { MenuBook, Person } from "@mui/icons-material"; // Import icons
import "../styles/Home.css"; // Import new CSS for styling

const userPermissions = {
  "grappasystems3@gmail.com": ["books", "authors"],
  "grappasystems4@gmail.com": ["authors"],
  "grappasystems5@gmail.com": ["books"],
};

const Home = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth0();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const handleNavigation = (path, permission) => {
    const allowedPermissions = userPermissions[user.email] || [];
    if (allowedPermissions.includes(permission)) {
      navigate(path);
    } else {
      setSnackbarMessage("You do not have permission to access this page.");
      setSnackbarOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    logout({ returnTo: window.location.origin });
  };

  return (
    <>
      {/* Logout Button Fixed in the Top-Right Corner */}
      <Button
        variant="contained"
        color="error"
        className="logout-button"
        onClick={handleLogout}
      >
        Logout
      </Button>

      {/* Home Page Container */}
      <Container className="home-container">
        {/* Profile Background Section with Border */}
        <Box className="profile-section">
          <Avatar
            src={user?.picture || ""}
            alt="User Profile"
            className="profile-avatar"
          />
        </Box>

        <Typography variant="h6" className="home-text">
          Select a section to explore:
        </Typography>

        {/* Navigation Buttons */}
        <Box className="button-container">
          <Button
            variant="contained"
            color="primary"
            className="nav-button"
            onClick={() => handleNavigation("/books", "books")}
          >
            <Avatar className="nav-icon">
              <MenuBook sx={{ color: "#007bff" }} />
            </Avatar>
            Browse Books
          </Button>

          <Button
            variant="contained"
            color="secondary"
            className="nav-button"
            onClick={() => handleNavigation("/authors", "authors")}
          >
            <Avatar className="nav-icon">
              <Person sx={{ color: "#d32f2f" }} />
            </Avatar>
            Browse Authors
          </Button>
        </Box>

        {/* Permission Snackbar */}
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
          <Alert onClose={() => setSnackbarOpen(false)} severity="error">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default Home;
