import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Typography, Snackbar, Alert, Container, Avatar } from "@mui/material";
import { MenuBook, Person } from "@mui/icons-material"; // Import icons

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
    <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          borderRadius: 2,
          boxShadow: 3,
          padding: 4,
          backgroundColor: "transparent" // Remove background from container
        }}
      >
      {/* Logout Button in Top-Right Corner */}
      <Button 
        variant="contained" 
        color="error" 
        sx={{ 
          position: "absolute",
          top: 20,
          right: 20,
          fontSize: 14, 
          padding: "8px 20px", 
          borderRadius: "8px", 
          "&:hover": { backgroundColor: "darkred", transform: "scale(1.05)" } 
        }}
        onClick={handleLogout}
      >
        Logout
      </Button>

      <Typography 
        variant="h3" 
        sx={{ fontWeight: "bold", fontStyle: "italic", fontFamily: "Poppins, sans-serif", color: "#333", mb: 2 }}
      >
        Welcome, {user?.name?.split("@")[0] || "User"}!
      </Typography>
      <Typography 
        variant="h6" 
        sx={{ fontFamily: "Poppins, sans-serif", color: "#555", mb: 4 }}
      >
        Select a section to explore:
      </Typography>

      <Box sx={{ display: "flex", gap: 3, mb: 4, flexDirection: { xs: "column", md: "row" } }}>
        {/* Books Button with Icon */}
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ 
            fontSize: 18, 
            padding: "12px 28px", 
            borderRadius: "10px", 
            fontWeight: "600", 
            transition: "transform 0.3s", 
            "&:hover": { transform: "scale(1.1)" },
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
          onClick={() => handleNavigation("/books", "books")}
        >
          <Avatar sx={{ bgcolor: "white", width: 30, height: 30 }}>
            <MenuBook sx={{ color: "#007bff" }} />
          </Avatar>
          Browse Books
        </Button>

        {/* Authors Button with Icon */}
        <Button 
          variant="contained" 
          color="secondary" 
          sx={{ 
            fontSize: 18, 
            padding: "12px 28px", 
            borderRadius: "10px", 
            fontWeight: "600", 
            transition: "transform 0.3s", 
            "&:hover": { transform: "scale(1.1)" },
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
          onClick={() => handleNavigation("/authors", "authors")}
        >
          <Avatar sx={{ bgcolor: "white", width: 30, height: 30 }}>
            <Person sx={{ color: "#d32f2f" }} />
          </Avatar>
          Browse Authors
        </Button>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Home;
