const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({ message: "Book not found" });
});
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  const result = Object.fromEntries(
    Object.entries(books).filter(([isbn, book]) =>
      book.author.toLowerCase() === author
    )
  );

  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  const result = Object.fromEntries(
    Object.entries(books).filter(([isbn, book]) =>
      book.title.toLowerCase() === title
    )
  );

  return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});
// Asynchronous book lookup using Axios and async/await

const BASE_URL = "http://localhost:5000";

// Get all books asynchronously
public_users.get('/asyncbooks', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book by ISBN asynchronously
public_users.get('/asyncisbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${req.params.isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Error fetching book"
    });
  }
});

// Get books by author asynchronously
public_users.get('/asyncauthor/:author', async (req, res) => {
  try {
    const author = encodeURIComponent(req.params.author);
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get books by title asynchronously
public_users.get('/asynctitle/:title', async (req, res) => {
  try {
    const title = encodeURIComponent(req.params.title);
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Get book reviews asynchronously
public_users.get('/asyncreview/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/review/${req.params.isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Error fetching reviews"
    });
  }
});
module.exports.general = public_users;
