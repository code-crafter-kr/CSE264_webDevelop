// Put your name and ID here
// Sehyoun Jang
// sej324@lehigh.edu

const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.resolve(__dirname, "public")));

// Insert code here
app.use(express.json());

let books = [];
let authors = [];
let publishers = [];

app.post('/books', (req, res) => {
  const book = req.body;
  books.push(book);

  if (!authors.includes(book.author)) {
    authors.push(book.author);
  }

  if (!publishers.includes(book.publisher)) {
    publishers.push(book.publisher);
  }

  res.json({
    authors: ["", ...authors],
    publishers: ["", ...publishers]
  });});

app.get('/books', (req, res) => {
  res.json(books);
});

app.listen(3000);