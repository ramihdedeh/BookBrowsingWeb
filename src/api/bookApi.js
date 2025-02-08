import axios from "axios";

const API_URL = "https://openlibrary.org/search.json";

export const fetchBooks = async (query = "harry potter", page = 1) => {
  try {
    const response = await axios.get(API_URL, {
      params: { q: query, page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    return { docs: [] };
  }
};
