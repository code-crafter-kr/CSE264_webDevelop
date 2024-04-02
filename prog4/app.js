// Put your name and ID here
// Sehyoun Jang
// sej324@lehigh.edu

const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.resolve(__dirname, "public")));

// Middleware to parse JSON request bodies
app.use(express.json());

// Arrays to store books, authors, and publishers
let books = [];
let authors = [];
let publishers = [];

// Route to handle adding a new book
app.post('/books', (req, res) => {
  const book = req.body;
  books.push(book);

  // Add author to the authors array if not already present
  if (!authors.includes(book.author)) {
    authors.push(book.author);
  }

  // Add publisher to the publishers array if not already present
  if (!publishers.includes(book.publisher)) {
    publishers.push(book.publisher);
  }

  // Send the updated lists of authors and publishers as response
  res.json({
    authors: ["", ...authors],
    publishers: ["", ...publishers]
  });
});

// Route to retrieve all books
app.get('/books', (req, res) => {
  res.json(books);
});

// Start the server and listen on port 3000
app.listen(3000);