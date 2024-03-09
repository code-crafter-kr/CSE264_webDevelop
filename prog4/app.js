// Put your name and ID here 

const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(
  path.resolve(__dirname, "public")
));

// Insert code here

app.listen(3000);

