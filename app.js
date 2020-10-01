const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  // res.send("hello!");
  const today = new Date();
  const currentDay = today.getDay();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  res.render("list", { kindOfDay: daysOfWeek[currentDay] });
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
