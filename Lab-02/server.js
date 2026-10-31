const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "database", "books.db");

let db;

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });

        await db.run(`
            CREATE TABLE IF NOT EXISTS book (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                price INTEGER NOT NULL,
                pages INTEGER NOT NULL
            )
        `);

        const result = await db.get(
            `SELECT COUNT(*) AS count FROM book`
        );

        if (result.count === 0) {
            const books = [
                ["The Alchemist", "Paulo Coelho", 350, 208],
                ["Atomic Habits", "James Clear", 550, 320],
                ["Wings of Fire", "A.P.J. Abdul Kalam", 300, 180],
                ["Ikigai", "Hector Garcia", 400, 208],
                ["Rich Dad Poor Dad", "Robert Kiyosaki", 450, 336],
                ["The Power of Now", "Eckhart Tolle", 500, 236],
                ["Think and Grow Rich", "Napoleon Hill", 350, 238],
                ["Deep Work", "Cal Newport", 600, 304],
                ["The Monk Who Sold His Ferrari", "Robin Sharma", 300, 224],
                ["Do Epic Shit", "Ankur Warikoo", 299, 192]
            ];

            for (const book of books) {
                await db.run(
                    `INSERT INTO book (title, author, price, pages)
                     VALUES (?, ?, ?, ?)`,
                    book
                );
            }
        }

        app.listen(3000, () => {
            console.log("Server running at http://localhost:3000");
        });
    } catch (error) {
        console.log(`Database Error: ${error.message}`);
        process.exit(1);
    }
};

/* GET all books */
app.get("/books/", async (request, response) => {
    const books = await db.all(`SELECT * FROM book`);
    response.status(200).send(books);
});

/* GET one book */
app.get("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;

    const book = await db.get(
        `SELECT * FROM book WHERE id = ?`,
        [bookId]
    );

    if (book) {
        response.status(200).send(book);
    } else {
        response.status(404).send("Book not found");
    }
});

/* POST a new book */
app.post("/books/", async (request, response) => {
    const { title, author, price, pages } = request.body;

    const result = await db.run(
        `INSERT INTO book (title, author, price, pages)
         VALUES (?, ?, ?, ?)`,
        [title, author, price, pages]
    );

    response.status(201).send({
        message: "Book added successfully",
        bookId: result.lastID
    });
});

/* PUT/update a book */
app.put("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;
    const { title, author, price, pages } = request.body;

    const result = await db.run(
        `UPDATE book
         SET title = ?, author = ?, price = ?, pages = ?
         WHERE id = ?`,
        [title, author, price, pages, bookId]
    );

    if (result.changes === 0) {
        response.status(404).send("Book not found");
    } else {
        response.status(200).send("Book updated successfully");
    }
});

/* DELETE a book */
app.delete("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;

    const result = await db.run(
        `DELETE FROM book WHERE id = ?`,
        [bookId]
    );

    if (result.changes === 0) {
        response.status(404).send("Book not found");
    } else {
        response.status(200).send("Book deleted successfully");
    }
});

/* Start database and server */
initializeDBAndServer();