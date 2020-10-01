/**
 * Setup and initialization.
 */
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/**
 * GET Method for main route.
 *
 * Sends back the list.ejs with context to render the main todo list.
 */
app.get("/", (req, res) => {
  res.render("list", { listTitle: date.getCurrentDate(), listItems: items });
});

/**
 * POST method for main route.
 *
 * Called when user submits a new todo list item, either on the main list or
 * on the work list. Adds the item to the correct list, and then redirects
 * to the correct list.
 */
app.post("/", (req, res) => {
  if (req.body.list === "Work List") {
    workItems.push(req.body.newItem);
    res.redirect("/work");
  } else {
    items.push(req.body.newItem);
    res.redirect("/");
  }
});

/**
 * GET Method for /work route.
 *
 * Sends back the list.ejs with context to render the work todo list.
 */
app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", listItems: workItems });
});

/**
 * Start up server to listen on port 3000.
 */
app.listen(process.env.PORT || 3000, () => {
  console.log("server is running on port 3000");
});
