import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Card, CardMedia, CardContent, CircularProgress, Grid, Box, Snackbar, Alert } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const userPermissions = {
  "grappasystems3@gmail.com": ["books", "authors"],
  "grappasystems4@gmail.com": ["authors"],
  "grappasystems5@gmail.com": ["books"],
};

const AuthorDetails = () => {
  const { id } = useParams();
  const { user } = useAuth0();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]); // Store books written by the author
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuthorDetails();
  }, []);

  const fetchAuthorDetails = async () => {
    try {
      const response = await axios.get(`https://openlibrary.org/authors/${id}.json`);
      setAuthor(response.data);
      fetchAuthorBooks(response.data.name); // Fetch books by the author
      setLoading(false);
    } catch (error) {
      console.error("Error fetching author details:", error);
      setLoading(false);
    }
  };

  const fetchAuthorBooks = async (authorName) => {
    try {
      const response = await axios.get(`https://openlibrary.org/search.json?author=${authorName}`);
      setBooks(response.data.docs);
    } catch (error) {
      console.error("Error fetching books by author:", error);
    }
  };

  const handleBookClick = (bookId) => {
    const allowedPermissions = userPermissions[user.email] || [];
    if (allowedPermissions.includes("books")) {
      navigate(`/books/${bookId}`);
    } else {
      setSnackbarMessage("You do not have permission to view books.");
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Card sx={{ padding: 3, borderRadius: 3, boxShadow: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Left Side - Author Image */}
          <Grid item xs={12} md={4}>
            {author.photos ? (
              <CardMedia
                component="img"
                sx={{ width: "100%", height: "auto", borderRadius: 2 }}
                image={`https://covers.openlibrary.org/b/id/${author.photos[0]}-L.jpg`}
                alt={author.name}
              />
            ) : (
              <Typography variant="h6" sx={{ textAlign: "center", padding: "20px" }}>
                No Image Available
              </Typography>
            )}
          </Grid>

          {/* Right Side - Author Details */}
          <Grid item xs={12} md={8}>
            <Box>
              {/* Author Name */}
              <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 2 }}>
                {author.name || "Unknown Author"}
              </Typography>

              {/* Author Biography */}
              <Typography variant="body1" sx={{ marginBottom: 2, color: "gray" }}>
                {author.bio
                  ? typeof author.bio === "string"
                    ? author.bio
                    : author.bio.value
                  : "No biography available"}
              </Typography>

              {/* Birth Date */}
              <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: "medium" }}>
                🎂 Birth Date: {author.birth_date || "Unknown"}
              </Typography>

              {/* Death Date */}
              <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: "medium" }}>
                🕊 Death Date: {author.death_date || "N/A"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Books by the Author */}
      <Typography variant="h5" sx={{ marginTop: 4, fontWeight: "bold", textAlign: "center" }}>
        📚 Books by {author.name}
      </Typography>

      <Grid container spacing={3} sx={{ marginTop: 2 }}>
        {books.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: "center", width: "100%" }}>
            No books found for this author.
          </Typography>
        ) : (
          books.map((book, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                onClick={() => handleBookClick(book.key.split("/").pop())}
                sx={{
                  cursor: userPermissions[user.email]?.includes("books") ? "pointer" : "not-allowed",
                  opacity: userPermissions[user.email]?.includes("books") ? 1 : 0.5,
                  transition: "0.3s",
                  "&:hover": {
                    transform: userPermissions[user.email]?.includes("books") ? "scale(1.05)" : "none",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "https://via.placeholder.com/150"}
                  alt={book.title}
                />
                <CardContent>
                  <Typography variant="h6">{book.title || "Unknown Title"}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Snackbar Message */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AuthorDetails;
