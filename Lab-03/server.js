const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Lab-03 API is running successfully!");
});

const PORT = process.env.PORT || 3000;

let db;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: path.join(__dirname, "database", "books.db"),
      driver: sqlite3.Database,
    });

    await db.run(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER NOT NULL
      )
    `);

    const bookCount = await db.get(
      `SELECT COUNT(*) AS count FROM books`
    );

    if (bookCount.count === 0) {
      await db.run(`
        INSERT INTO books (title, author, price, pages)
        VALUES
        ('Atomic Habits', 'James Clear', 500, 320),
        ('The Alchemist', 'Paulo Coelho', 350, 208),
        ('Wings of Fire', 'A.P.J. Abdul Kalam', 450, 180),
        ('Ikigai', 'Hector Garcia', 400, 208),
        ('Rich Dad Poor Dad', 'Robert Kiyosaki', 550, 336),
        ('The Power of Now', 'Eckhart Tolle', 600, 236),
        ('Harry Potter', 'J.K. Rowling', 700, 352),
        ('Think and Grow Rich', 'Napoleon Hill', 450, 238)
      `);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/books", async (request, response) => {
  const {
  search_q,
  order_by,
  order,
  limit,
  offset,
  min_price,
  max_price,
} = request.query; 

  let query = `SELECT * FROM books`;
  let params = [];
  let conditions = [];

  if (search_q) {
  conditions.push(`title LIKE ?`);
  params.push(`%${search_q}%`);
}

if (min_price) {
  const minPriceValue = Number(min_price);

  if (Number.isNaN(minPriceValue)) {
    return response.status(400).send({
      error: "min_price must be a number",
    });
  }

  conditions.push(`price >= ?`);
  params.push(minPriceValue);
}

if (max_price) {
  const maxPriceValue = Number(max_price);

  if (Number.isNaN(maxPriceValue)) {
    return response.status(400).send({
      error: "max_price must be a number",
    });
  }

  conditions.push(`price <= ?`);
  params.push(maxPriceValue);
}

if (conditions.length > 0) {
  query += ` WHERE ${conditions.join(" AND ")}`;
}

  if (order_by) {
    const allowedColumns = ["id", "title", "author", "price", "pages"];

    if (!allowedColumns.includes(order_by)) {
      return response.status(400).send({
        error: "Invalid order_by value",
      });
    }

    const sortOrder = order === "DESC" ? "DESC" : "ASC";

    query += ` ORDER BY ${order_by} ${sortOrder}`;
  }

  if (limit) {
  const limitValue = Number(limit);

  if (!Number.isInteger(limitValue) || limitValue <= 0) {
    return response.status(400).send({
      error: "limit must be a positive number",
    });
  }

  query += ` LIMIT ?`;
  params.push(limitValue);
}

if (offset) {
  const offsetValue = Number(offset);

  if (!Number.isInteger(offsetValue) || offsetValue < 0) {
    return response.status(400).send({
      error: "offset must be a non-negative number",
    });
  }

  query += ` OFFSET ?`;
  params.push(offsetValue);
}

  const books = await db.all(query, params);

  response.status(200).send(books);
});

app.post("/books", async (request, response) => {
  const { title, author, price, pages } = request.body;

  if (!title || !author || price === undefined || pages === undefined) {
    return response.status(400).send({
      error: "title, author, price and pages are required",
    });
  }

  if (Number.isNaN(Number(price))) {
    return response.status(400).send({
      error: "price must be a number",
    });
  }

  if (Number.isNaN(Number(pages))) {
    return response.status(400).send({
      error: "pages must be a number",
    });
  }

  const result = await db.run(
    `INSERT INTO books (title, author, price, pages)
     VALUES (?, ?, ?, ?)`,
    [title, author, Number(price), Number(pages)]
  );

  response.status(201).send({
    message: "Book added successfully",
    bookId: result.lastID,
  });
});

app.put("/books/:bookId", async (request, response) => {
  const { bookId } = request.params;
  const { title, author, price, pages } = request.body;

  const existingBook = await db.get(
    `SELECT * FROM books WHERE id = ?`,
    [bookId]
  );

  if (!existingBook) {
    return response.status(404).send({
      error: "Book not found",
    });
  }

  await db.run(
    `UPDATE books
     SET title = ?, author = ?, price = ?, pages = ?
     WHERE id = ?`,
    [title, author, Number(price), Number(pages), bookId]
  );

  response.status(200).send({
    message: "Book updated successfully",
  });
});

app.get("/books/:bookId", async (request, response) => {
  const { bookId } = request.params;

  const book = await db.get(
    `SELECT * FROM books WHERE id = ?`,
    [bookId]
  );

  if (!book) {
    return response.status(404).send({
      error: "Book not found",
    });
  }

  response.status(200).send(book);
});

app.delete("/books/:bookId", async (request, response) => {
  const { bookId } = request.params;

  const existingBook = await db.get(
    `SELECT * FROM books WHERE id = ?`,
    [bookId]
  );

  if (!existingBook) {
    return response.status(404).send({
      error: "Book not found",
    });
  }

  await db.run(
    `DELETE FROM books WHERE id = ?`,
    [bookId]
  );

  response.status(200).send({
    message: "Book deleted successfully",
  });
});