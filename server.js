const express = require("express");
const app = express();
const { query } = require("./database");
const port = 4000;

app.use(express.json());

// row is refer to all rows in our table, while as row[0] refers to first raw in our tabel (array of objects)

app.post("/books", async (req, res) => {
  //   console.log(req);
  const { title, author, genre, quantity } = req.body;

  try {
    const newBook = await query(
      "INSERT INTO books (title, author, genre, quantity) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, author, genre, quantity]
    );

    res.status(201).json(newBook.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

// Get all the books
app.get("/books", async (req, res) => {
  try {
    const allBooks = await query("SELECT * FROM books");
    // rows
    res.status(200).json(allBooks.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/books/:id", async (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  try {
    const book = await query("SELECT * FROM books WHERE id = $1", [bookId]);

    if (book.rows.length > 0) {
      res.status(200).json(book.rows[0]);
    } else {
      res.status(404).send({ message: "Book not found" });
    }
  } catch (err) {
    console.error(err);
  }
});

// update the book
app.patch("/books/:id", async (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  const { title, author, genre, quantity } = req.body;

  try {
    const updatedBook = await query(
      "UPDATE books SET title = $1, author = $2, genre = $3, quantity = $4 WHERE id = $5 RETURNING *",
      [title, author, genre, quantity, bookId]
    );

    if (updatedBook.rows.length > 0) {
      res.status(200).json(updatedBook.rows[0]);
    } else {
      res.status(404).send({ message: "Book not found" });
    }
  } catch (err) {
    console.error(err);
  }
});

app.delete("/books/:id", async (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  try {
    const deleteBook = await query("DELETE FROM books WHERE id = $1", [bookId]);

    if (deleteBook.rowCount > 0) {
      res.status(200).send({ message: "Book deleted successfully" });
    } else {
      res.status(404).send({ message: "Book not found" });
    }
  } catch (err) {
    console.error(err);
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Book Inventory!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
