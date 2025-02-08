import React, { useState, useEffect } from "react";
import { fetchBooks } from "../api/bookApi";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Card, CardMedia, CardContent, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, CircularProgress, Box, Avatar } from "@mui/material";
import { Search, MenuBook } from "@mui/icons-material"; // Import icons
import "../styles/BookList.css"; // Import CSS for background

const BookList = () => {
  const navigate = useNavigate();

  // Load search state and pagination from localStorage
  const initialSearch = localStorage.getItem("bookSearchQuery") || "";
  const initialResults = JSON.parse(localStorage.getItem("bookSearchResults")) || [];
  const initialPage = parseInt(localStorage.getItem("bookSearchPage"), 10) || 1;

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [query, setQuery] = useState(initialSearch);
  const [books, setBooks] = useState(initialResults);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    if (query.length >= 3) {
      loadBooks(page);
    }
  }, [query, page]);

  const loadBooks = async (pageNumber) => {
    setLoading(true);
    const data = await fetchBooks(query, pageNumber);
    let sortedBooks = data.docs;

    if (sortOption === "title") {
      sortedBooks.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortOption === "publish_year") {
      sortedBooks.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
    }

    // Store search results and pagination in localStorage
    localStorage.setItem("bookSearchQuery", query);
    localStorage.setItem("bookSearchResults", JSON.stringify([...books, ...sortedBooks]));
    localStorage.setItem("bookSearchPage", pageNumber);

    setBooks(pageNumber === 1 ? sortedBooks : [...books, ...sortedBooks]);
    setLoading(false);
  };

  return (
    <Container className="book-list-container">
      {/* Header with Logo */}
      <Box className="book-header">
        <Avatar sx={{ bgcolor: "#007bff", width: 50, height: 50 }}>
          <MenuBook sx={{ color: "white" }} />
        </Avatar>
        <Typography variant="h4" className="book-list-title">
          Explore Books
        </Typography>
      </Box>

      {/* Search and Sort Fields */}
      <Box className="search-sort-container">
        {/* Search Field with Icon */}
        <Box className="search-box">
          <Search className="search-icon" />
          <TextField
            fullWidth
            label="Search for Books..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 1, height: "56px" }}
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
        </Box>

        {/* Sorting Dropdown */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          >
            <MenuItem value="title">Title (A-Z)</MenuItem>
            <MenuItem value="publish_year">Publish Year (Newest First)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Book List */}
      <Box className="book-grid">
  {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
  {books.map((book, index) => (
    <Card 
      key={index} 
      onClick={() => navigate(`/books/${book.key.split('/').pop()}`)} 
      className="book-card"
    >
      <CardMedia
        component="img"
        className="book-cover"
        image={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "https://via.placeholder.com/150"}
        alt={book.title}
      />
      <CardContent className="book-info">
        <Typography variant="h6" className="book-title">{book.title || "Unknown Title"}</Typography>
        <Typography variant="body2" className="book-author">
          {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
        </Typography>
      </CardContent>
    </Card>
  ))}
</Box>



      {/* Load More Button */}
      {books.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: "20px" }}
          onClick={() => setPage((prevPage) => prevPage + 1)}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </Button>
      )}
    </Container>
  );
};

export default BookList;
