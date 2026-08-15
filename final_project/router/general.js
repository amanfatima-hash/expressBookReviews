const axios= require("axios");
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }
  
    if (users.find(user => user.username === username)) {
      return res.status(409).json({
        message: "User already exists"
      });
    }
  
    users.push({
      username: username,
      password: password
    });
  
    return res.status(201).json({
      message: "User registered successfully"
    });
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn], null, 4));
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = {};
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author === author) {
        booksByAuthor[isbn] = books[isbn];
      }
    });
  
    res.send(JSON.stringify(booksByAuthor, null, 4));
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = {};
  
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
        booksByTitle[isbn] = books[isbn];
      }
    });
  
    res.send(JSON.stringify(booksByTitle, null, 4));
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });

  // Task 10 - Get all books using Async/Await with Axios
async function getAllBooks() {
    try {
      const response = await axios.get("http://localhost:5000/");
      return response.data;
    } catch (error) {
      return { error: error.message };
    }
  }
  
  // Task 11 - Get book by ISBN using Promise with Axios
  function getBookByISBN(isbn) {
    return axios
      .get(`http://localhost:5000/isbn/${isbn}`)
      .then(response => response.data)
      .catch(error => ({ error: error.message }));
  }
  
  // Task 12 - Get books by Author using Promise with Axios
  function getBooksByAuthor(author) {
    return axios
      .get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
      .then(response => response.data)
      .catch(error => ({ error: error.message }));
  }
  
  // Task 13 - Get books by Title using Async/Await with Axios
  async function getBooksByTitle(title) {
    try {
      const response = await axios.get(
        `http://localhost:5000/title/${encodeURIComponent(title)}`
      );
      return response.data;
    } catch (error) {
      return { error: error.message };
    }
  }

module.exports.general = public_users;
