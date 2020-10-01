const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let items = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  const currentDateString = today.toLocaleDateString("en-US", options);
  res.render("list", { currentDay: currentDateString, listItems: items });
});

app.post("/", (req, res) => {
  items.push(req.body.newItem);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
