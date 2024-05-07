const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(express.static(path.resolve(__dirname, "public")));

app.use('/api', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));

app.listen(3000, () => console.log("Starting up sudoku game"));