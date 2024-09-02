import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3003;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todolist-2",
  password: "raysanaa",
  port: 5434,
});
db.connect();

let items = [];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "ToDo",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    if (item === "") throw err;
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.render("index.ejs", {
      listTitle: "ToDo",
      listItems: items,
      error: "Item cannot be empty",
    });
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    if (item === "") throw "item cannot be null";
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    setTimeout(() => {
      res.redirect("/");
    }, 200);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
