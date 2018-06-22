require("dotenv").config();
const express = require("express"),
  cors = require("cors"),
  { json } = require("body-parser"),
  port = 3001,
  app = express(),
  massive = require("massive");

massive(process.env.CONNECTION_STRING)
  .then(db => {
    app.set("db", db);
  })
  .catch(console.log);

app.use(cors());
app.use(json());

app.get("/api/todos", (req, res) => {
  const db = req.app.get("db");
  db.query("select * from todos").then(todos => {
    res.status(200).json(
      todos.map(c => ({
        id: c.id,
        isComplete: c.is_complete,
        title: c.title
      }))
    );
  });
});
app.post("/api/todos", (req, res) => {
  const db = req.app.get("db");
  db.query(
    "insert into todos (is_complete, title) values (${isComplete}, ${title}); select * from todos;",
    req.body
  ).then(todos => {
    return res.status(200).json(
      todos.map(c => ({
        id: c.id,
        isComplete: c.is_complete,
        title: c.title
      }))
    );
  });
});
app.put("/api/todos/:id", (req, res) => {
  const db = req.app.get("db");
  const { isComplete, title } = req.body;
  if (isComplete) {
    db.query(
      "update todos set is_complete = $1 where id = $2;select * from todos;",
      [req.body.isComplete, req.params.id]
    ).then(todos => {
      return res.status(200).json(
        todos.map(c => ({
          id: c.id,
          isComplete: c.is_complete,
          title: c.title
        }))
      );
    });
  } else {
    db.query("update todos set title = $1 where id = $2;select * from todos;", [
      req.body.title,
      req.params.id
    ]).then(todos => {
      return res.status(200).json(
        todos.map(c => ({
          id: c.id,
          isComplete: c.is_complete,
          title: c.title
        }))
      );
    });
  }
});
app.delete("/api/todos/:id", (req, res) => {
  const db = req.app.get("db");
  db.query(
    "delete from todos where id = $1; select * from todos;",
    req.params.id
  ).then(todos => {
    return res.status(200).json(
      todos.map(c => ({
        id: c.id,
        isComplete: c.is_complete,
        title: c.title
      }))
    );
  });
});
app.listen(port, () => {
  console.log("Server listening on port", port);
});
