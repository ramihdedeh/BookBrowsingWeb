import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Card, CardMedia, CardContent, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const userPermissions = {
  "grappasystems3@gmail.com": ["books", "authors"],
  "grappasystems4@gmail.com": ["authors"], // Can access authors + book details from authors
  "grappasystems5@gmail.com": ["books"],
};

const AuthorList = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();

  // Load previous search state from localStorage
  const initialSearch = localStorage.getItem("authorSearchQuery") || "";
  const initialResults = JSON.parse(localStorage.getItem("authorSearchResults")) || [];
  const initialAuthorName = localStorage.getItem("authorName") || "";
  const initialPage = parseInt(localStorage.getItem("authorSearchPage"), 10) || 1;

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [query, setQuery] = useState(initialSearch);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState(initialResults);
  const [authorName, setAuthorName] = useState(initialAuthorName);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    if (query.length >= 3) {
      searchAuthor(page);
    }
  }, [query, page]);

  const searchAuthor = async (pageNumber) => {
    setLoading(true);
    try {
      const authorResponse = await axios.get(`https://openlibrary.org/search/authors.json?q=${query}`);
      if (!authorResponse.data.docs.length) {
        setBooks([]);
        setAuthorName("");
        setLoading(false);
        return;
      }

      const author = authorResponse.data.docs[0];
      setAuthorName(author.name);

      const booksResponse = await axios.get(`https://openlibrary.org/search.json?author=${author.name}&page=${pageNumber}`);

      localStorage.setItem("authorSearchQuery", query);
      localStorage.setItem("authorSearchResults", JSON.stringify([...books, ...booksResponse.data.docs]));
      localStorage.setItem("authorSearchPage", pageNumber);
      localStorage.setItem("authorName", author.name);

      setBooks(pageNumber === 1 ? booksResponse.data.docs : [...books, ...booksResponse.data.docs]);
    } catch (error) {
      console.error("Error fetching author or books:", error);
    }
    setLoading(false);
  };

  return (
    <Container>
      {/* Search Field */}
      <TextField
        fullWidth
        label="Search for an Author"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px", marginTop: "20px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (searchQuery.length >= 3) {
            setQuery(searchQuery);
            setPage(1);
          } else {
            alert("Please enter at least 3 characters.");
          }
        }}
      >
        Search
      </Button>

      {/* Loading Spinner */}
      {loading && <CircularProgress style={{ display: "block", margin: "20px auto" }} />}

      {/* Show Author Name */}
      {!loading && authorName && (
        <Typography variant="h5" style={{ marginTop: "20px", textAlign: "center" }}>
          Books by {authorName}
        </Typography>
      )}

      {/* Book List */}
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        {!loading && books.length === 0 && query.length >= 3 && (
          <Typography variant="h6" style={{ textAlign: "center", marginTop: "20px" }}>
            No books found for this author.
          </Typography>
        )}
        {books.map((book, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              onClick={() => navigate(`/books/${book.key.split("/").pop()}`)}
              style={{ cursor: "pointer" }}
            >
              <CardMedia
                component="img"
                height="200"
                image={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "https://via.placeholder.com/150"}
                alt={book.title}
              />
              <CardContent>
                <Typography variant="h6">{book.title || "Unknown Title"}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Load More Button */}
      {books.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setPage((prevPage) => prevPage + 1)}
          style={{ marginTop: "20px" }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </Button>
      )}
    </Container>
  );
};

export default AuthorList;
