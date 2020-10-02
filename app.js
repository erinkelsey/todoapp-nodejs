/**
 * Setup and initialization.
 */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/**
 * MongoDB and mongoose setup, including schema and models
 * for Item and List
 */
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model(
  "List",
  new mongoose.Schema({
    name: String,
    items: [itemsSchema],
  })
);

/**
 * Default Items for any list
 */
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

/**
 *  Add default items to the todo database
 */
const addDefaultItems = () => {
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
    } else {
      res.render("list", {
        listTitle: date.getCurrentDate(),
        listItems: foundItems,
      });
    }
  });
});

/**
 * GET method for a custom list
 *
 * Finds the list, and returns the items and the list title
 * to be rendered in list.ejs
 */
app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: customListName,
          listItems: foundList.items,
        });
      }
    }
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
  const item = new Item({ name: req.body.newItem });
  const listName = _.capitalize(req.body.list);

  List.findOne({ name: listName }, (err, foundList) => {
    if (!foundList) {
      item.save();
      res.redirect("/");
    } else {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    }
  });
});

/**
 * POST method to delete an item.
 *
 * Called when user checks the checkbox beside the item.
 * Item ID is used to find and remove item, either from main
 * list or custom list. Redirected back to correct list.
 */
app.post("/delete", (req, res) => {
  const listName = req.body.listName;
  const checkedItemId = req.body.checkbox;
  List.findOneAndUpdate(
    { name: listName },
    { $pull: { items: { _id: checkedItemId } } },
    (err, foundList) => {
      if (err) {
        console.log(err);
      } else if (!foundList) {
        Item.findByIdAndRemove(checkedItemId, (err) => {
          if (!err) console.log("successfully deleted checked item");
          else console.log(err);
          res.redirect("/");
        });
      } else {
        console.log("successfully deleted item from custom list");
        res.redirect("/" + listName);
      }
    }
  );
});

/**
 * Start up server to listen on port 3000.
 */
app.listen(process.env.PORT || 3000, () => {
  console.log("server is running on port 3000");
});
