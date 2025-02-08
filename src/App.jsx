import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import BookList from "./pages/BookList";
import BookDetails from "./pages/BookDetails";
import AuthorList from "./pages/AuthorList";
import AuthorDetails from "./pages/AuthorDetails";
import PrivateRoute from "./routes/PrivateRoute";
import { Snackbar, Alert } from "@mui/material";
import "./App.css";

function App() {
  const { isAuthenticated } = useAuth0();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const handleUnauthorizedAccess = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <LoginPage />} />
        <Route path="/books" element={<PrivateRoute component={BookList} permission="books" onUnauthorized={handleUnauthorizedAccess} />} />
        <Route path="/books/:id" element={<PrivateRoute component={BookDetails} permission="books" onUnauthorized={handleUnauthorizedAccess} />} />
        <Route path="/authors" element={<PrivateRoute component={AuthorList} permission="authors" onUnauthorized={handleUnauthorizedAccess} />} />
        <Route path="/authors/:id" element={<PrivateRoute component={AuthorDetails} permission="authors" onUnauthorized={handleUnauthorizedAccess} />} />
      </Routes>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Router>
  );
}

export default App;
