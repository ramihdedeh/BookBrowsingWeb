import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Container, Typography } from "@mui/material";

const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();

  useEffect(() => {
    if (user) {
      console.log("User Data:", user);
    }
  }, [user]);

  return (
    <Container style={{ textAlign: "center", marginTop: "100px" }}>
      <Typography variant="h4" gutterBottom>
        {isAuthenticated ? `Welcome, ${user?.name}` : "Login to Access"}
      </Typography>

      {!isAuthenticated ? (
        <Button variant="contained" color="primary" onClick={() => loginWithRedirect()}>
          Login
        </Button>
      ) : (
        <Button variant="outlined" color="secondary" onClick={() => logout({ returnTo: window.location.origin })}>
          Logout
        </Button>
      )}
    </Container>
  );
};

export default LoginPage;
