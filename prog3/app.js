// Name: sehyoun jang
// Email: sej324@lehigh.edu

const express = require("express");
const path = require("path");
const sprintf = require("sprintf-js").sprintf;

const app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(
  path.resolve(__dirname, "public")
));

let month = 0;
let year = 0;

function genCalendar(month, year, req, res) {

  // If your feeling clever, come up with a more streamlined way to write this function
  function calcLastDayOfMonth(month) {
    let lastDay = 0;
    if (month === 4 || month === 6 || month === 9 || month === 11)
      lastDay = 30;
    else if (month !== 2)
      lastDay = 31;
    else if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
      lastDay = 29;
    else
      lastDay = 28;
    return lastDay;
  }

  function isToday(m,d,y) {
    const today = new Date();
    return m == today.getMonth()+1 && y == today.getFullYear() && d == today.getDate();
  }

  const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  /* Code to create calendar rows and cells goes here */

  res.render("index", {
    header: header_string,
    calendar: calendar_string
  });
}

app.get("/calendar", function(req, res) {
  if (req.query.month && req.query.year) {
    month = parseInt(req.query.month);
    year = parseInt(req.query.year);
  } else {
    let today = new Date();
    month = today.getMonth() + 1;
    year = today.getFullYear();
  }
  genCalendar(month, year, req, res);
});

app.get("/backmonth", function(req, res) {
// Assign new month and year and call genCalendar

});

app.get("/forwardmonth", function(req, res) {
// Assign new month and year and call genCalendar
});

app.get("/backyear", function(req, res) {
// Assign new month and year and call genCalendar
});

app.get("/forwardyear", function(req, res) {
// Assign new month and year and call genCalendar
});

app.listen(3000);

