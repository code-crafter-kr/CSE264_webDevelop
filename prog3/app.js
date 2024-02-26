// Name: sehyoun jang
// Email:sej324@lehigh.edu

const express = require("express");
const path = require("path");
const sprintf = require("sprintf-js").sprintf;

const app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(
  path.resolve(__dirname, "public")
));

// Global variables to keep track of the month and year
let globalMonth = 0;
let globalYear = 0;


function genCalendar(month, year, req, res) {
  // Update global variables with the current month and year
  globalMonth = month;
  globalYear = year;

  function calcLastDayOfMonth(month, year) {
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
  // Get today's date
  let today = new Date();
  let currentDay = today.getDate();
  let currentMonth = today.getMonth() + 1;
  let currentYear = today.getFullYear();

  // Determine the first day of the month
  let firstDay = new Date(year, month - 1, 1).getDay();
  let lastDayOfMonth = calcLastDayOfMonth(month, year);

  // Generate HTML for the calendar
  let calendarHTML = "<tr>";
  for (let i = 0; i < firstDay; i++) {
    calendarHTML += "<td></td>"; 
  }

  for (let day = 1; day <= lastDayOfMonth; day++) {
    // Highlight today's date
    let isToday = (day === currentDay && month === currentMonth && year === currentYear) ? " class='today'" : "";
    if ((day + firstDay - 1) % 7 === 0) calendarHTML += "</tr><tr>"; 
    calendarHTML += `<td${isToday}>${day}</td>`; // Fill empty cells before the first day
  }

  // Close the last row properly
  if (calendarHTML.endsWith("<tr>")) {
    calendarHTML = calendarHTML.slice(0, -4); 
  } else {
    calendarHTML += "</tr>";
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let headerString = `${monthNames[month - 1]} ${year}`;

  res.render("index", {
    header: headerString,
    calendar: calendarHTML
  });
}
// Route to display the calendar for a specific month and year
app.get('/calendar', function(req, res) {
  let month = parseInt(req.query.month);
  let year = parseInt(req.query.year);
  // Use the current month and year if not specified
  if (!month || !year) {
      const today = new Date();
      month = today.getMonth() + 1;
      year = today.getFullYear();
  }
  genCalendar(month, year, req, res); 
});

// Test, default route
app.get('/', function(req, res) {
  res.send('Welcome to the Calendar App!');
});


app.get("/backmonth", function(req, res) { // Route to go back one month, if month is January, go back to December of the previous year
  let month = globalMonth;
  let year = globalYear;
  month -= 1;
  if (month < 1) {
    month = 12;
    year -= 1;
  }
  genCalendar(month, year, req, res);
});

app.get("/forwardmonth", function(req, res) { // Route to go forward one month, if month is December, go forward to January of the next year
  let month = globalMonth;
  let year = globalYear;
  month += 1;
  if (month > 12) {
    month = 1;
    year += 1;
  }
  genCalendar(month, year, req, res);
});

app.get("/backyear", function(req, res) { // Route to go back one year
  let month = globalMonth;
  let year = globalYear;
  year -= 1;
  genCalendar(month, year, req, res);
});

app.get("/forwardyear", function(req, res) { // Route to go forward one year
  let month = globalMonth;
  let year = globalYear;
  year += 1;
  genCalendar(month, year, req, res);
});

app.listen(3000); // Listen on port 3000

