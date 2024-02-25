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

let month = 0;
let year = 0;

function genCalendar(month, year, req, res) {
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

  let today = new Date();
  let currentDay = today.getDate();
  let currentMonth = today.getMonth() + 1;
  let currentYear = today.getFullYear();

  let firstDay = new Date(year, month - 1, 1).getDay();
  let lastDayOfMonth = calcLastDayOfMonth(month, year);

  let calendarHTML = "<tr>";
  for (let i = 0; i < firstDay; i++) {
    calendarHTML += "<td></td>"; 
  }

  for (let day = 1; day <= lastDayOfMonth; day++) {
    let isToday = (day === currentDay && month === currentMonth && year === currentYear) ? " class='today'" : "";
    if ((day + firstDay - 1) % 7 === 0) calendarHTML += "</tr><tr>"; 
    calendarHTML += `<td${isToday}>${day}</td>`;
  }

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

app.get('/calendar', function(req, res) {
  let month = parseInt(req.query.month);
  let year = parseInt(req.query.year);
  if (!month || !year) {
      const today = new Date();
      month = today.getMonth() + 1;
      year = today.getFullYear();
  }
  genCalendar(month, year, req, res); 
});

app.get('/', function(req, res) {
  res.send('Welcome to the Calendar App!');
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

