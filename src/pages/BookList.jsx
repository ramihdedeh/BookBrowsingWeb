import React, { useState, useEffect } from "react";
import { fetchBooks } from "../api/bookApi";
import { Container, Grid, Card, CardMedia, CardContent, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Text input value
  const [query, setQuery] = useState(""); // Actual search term
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState(""); // Sorting state

  useEffect(() => {
    if (query.length >= 3) {
      loadBooks();
    }
  }, [query, page]); // Fetch books only if query is at least 3 characters

  const loadBooks = async () => {
    setLoading(true);
    const data = await fetchBooks(query, page);
    let sortedBooks = data.docs;

    // Apply sorting
    if (sortOption === "title") {
      sortedBooks.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortOption === "publish_year") {
      sortedBooks.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0)); // Sort by latest year first
    }

    setBooks(page === 1 ? sortedBooks : [...books, ...sortedBooks]);
    setLoading(false);
  };

  return (
    <Container>
      {/* Search Field */}
      <TextField
        fullWidth
        label="Search for Books"
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
            setQuery(searchQuery); // Update query only if 3+ characters
            setPage(1); // Reset pagination
          } else {
            alert("Please enter at least 3 characters.");
          }
        }}
      >
        Search
      </Button>

      {/* Sorting Dropdown */}
      <FormControl style={{ minWidth: 200, marginLeft: "20px" }}>
        <InputLabel>Sort by</InputLabel>
        <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <MenuItem value="title">Title (A-Z)</MenuItem>
          <MenuItem value="publish_year">Publish Year (Newest First)</MenuItem>
        </Select>
      </FormControl>

      {/* Book List */}
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        {books.map((book, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              {/* Book Cover (Placeholder if missing) */}
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
                <Typography variant="body2" color="textSecondary">
                  {book.first_publish_year ? `Published: ${book.first_publish_year}` : "Unknown Year"}
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
          onClick={() => setPage(page + 1)}
          style={{ marginTop: "20px" }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </Button>
      )}
    </Container>
  );
};

export default BookList;
