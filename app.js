/**
 * Setup and initialization.
 */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/**
 * MongoDB and mongoose setup, including schema and model
 */
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

/**
 *  Add default items to the
 */
const addDefaultItems = () => {
  const item1 = new Item({
    name: "Welcome to your todolist!",
  });

  const item2 = new Item({
    name: "Hit the + button to add a new item.",
  });

  const item3 = new Item({
    name: "<-- Hit this to delete an item.",
  });

  const defaultItems = [item1, item2, item3];
  Item.insertMany(defaultItems, (err) => {
    if (err) console.log(err);
    else console.log("successfully saved default items to db");
  });
};

/**
 * GET Method for main route.
 *
 * Sends back the list.ejs with context to render the main todo list.
 * Items of todo list are retrieved from MongoDB, and of type Item.
 * If there are no items in the DB, inserts the default items.
 */
app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      addDefaultItems();
      res.redirect("/");
    }

    res.render("list", {
      listTitle: date.getCurrentDate(),
      listItems: foundItems,
    });
  });
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
