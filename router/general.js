const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop (Task 10 - Promise)
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("No books found");
        }
    })
    .then((books) => {
        res.send(JSON.stringify(books, null, 4));
    })
    .catch((err) => {
        res.status(404).json({message: err});
    });
});

// Get book details based on ISBN (Task 11 - Async/Await + Axios)
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:${process.env.PORT || 5000}/`, {
            timeout: 5000
        });
        const allBooks = response.data;
        const book = allBooks[isbn];
        if (book) {
            res.send(book);
        } else {
            res.status(404).json({message: "Book not found"});
        }
    } catch (err) {
        res.status(500).json({message: "Error fetching book", error: err.message});
    }
});

// Get book details based on author (Task 12 - Async/Await + Axios)
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:${process.env.PORT || 5000}/`, {
            timeout: 5000
        });
        const allBooks = response.data;
        let booksByAuthor = [];
        for (let key in allBooks) {
            if (allBooks[key].author === author) {
                booksByAuthor.push(allBooks[key]);
            }
        }
        if (booksByAuthor.length > 0) {
            res.send(booksByAuthor);
        } else {
            res.status(404).json({message: "No books found for this author"});
        }
    } catch (err) {
        res.status(500).json({message: "Error fetching books", error: err.message});
    }
});

// Get all books based on title (Task 13 - Async/Await + Axios)
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:${process.env.PORT || 5000}/`, {
            timeout: 5000
        });
        const allBooks = response.data;
        let booksByTitle = [];
        for (let key in allBooks) {
            if (allBooks[key].title === title) {
                booksByTitle.push(allBooks[key]);
            }
        }
        if (booksByTitle.length > 0) {
            res.send(booksByTitle);
        } else {
            res.status(404).json({message: "No books found with this title"});
        }
    } catch (err) {
        res.status(500).json({message: "Error fetching books", error: err.message});
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn].reviews);
    } else {
        res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;
