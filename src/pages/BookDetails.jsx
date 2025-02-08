import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Card, CardMedia, CardContent, CircularProgress, Grid, Box } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const userPermissions = {
  "grappasystems3@gmail.com": ["books", "authors"],
  "grappasystems4@gmail.com": ["authors"],
  "grappasystems5@gmail.com": ["books"],
};

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth0();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookDetails();
  }, []);

  const fetchBookDetails = async () => {
    try {
      const response = await axios.get(`https://openlibrary.org/works/${id}.json`);
      setBook(response.data);

      if (response.data.authors && response.data.authors.length > 0) {
        fetchAuthors(response.data.authors);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching book details:", error);
      setLoading(false);
    }
  };

  const fetchAuthors = async (authorsArray) => {
    try {
      const authorRequests = authorsArray.map(async (author) => {
        const authorId = author.author?.key.split("/").pop();
        if (!authorId) return null;
        const authorResponse = await axios.get(`https://openlibrary.org/authors/${authorId}.json`);
        return { id: authorId, name: authorResponse.data.name };
      });

      const authorResults = await Promise.all(authorRequests);
      setAuthors(authorResults.filter(Boolean));
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Card sx={{ padding: 3, borderRadius: 3, boxShadow: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Left Side - Book Cover */}
          <Grid item xs={12} md={4}>
            {book.covers ? (
              <CardMedia
                component="img"
                sx={{ width: "100%", height: "auto", borderRadius: 2 }}
                image={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`}
                alt={book.title}
              />
            ) : (
              <Typography variant="h6" sx={{ textAlign: "center", padding: "20px" }}>
                No Cover Available
              </Typography>
            )}
          </Grid>

          {/* Right Side - Book Details */}
          <Grid item xs={12} md={8}>
            <Box>
              {/* Book Title */}
              <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 2 }}>
                {book.title || "Unknown Title"}
              </Typography>

              {/* Book Description */}
              <Typography variant="body1" sx={{ marginBottom: 2, color: "gray" }}>
                {book.description
                  ? typeof book.description === "string"
                    ? book.description
                    : book.description.value
                  : "No description available"}
              </Typography>

              {/* Book Subjects (Genres) */}
              <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: "medium" }}>
                📖 Genres: {book.subjects ? book.subjects.join(", ") : "N/A"}
              </Typography>

              {/* Publish Date */}
              <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: "medium" }}>
                🗓 Published: {book.first_publish_date || book.created?.value?.split("T")[0] || "Unknown"}
              </Typography>

              {/* Authors Section (Disabled for Unauthorized Users) */}
              {authors.length > 0 ? (
                <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: "medium" }}>
                  ✍️ Author(s):{" "}
                  {authors.map((author) => {
                    const canAccessAuthors = userPermissions[user.email]?.includes("authors");

                    return (
                      <span
                        key={author.id}
                        style={{
                          cursor: canAccessAuthors ? "pointer" : "not-allowed",
                          textDecoration: canAccessAuthors ? "underline" : "none",
                          color: canAccessAuthors ? "#007bff" : "gray",
                          marginRight: "10px",
                          pointerEvents: canAccessAuthors ? "auto" : "none",
                        }}
                        onClick={() => canAccessAuthors && navigate(`/authors/${author.id}`)}
                      >
                        {author.name}
                      </span>
                    );
                  })}
                </Typography>
              ) : (
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  ✍️ Author: Unknown
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default BookDetails;
