# Express Book Reviews

A RESTful API for an online book review application built with Node.js and Express. Supports public and authenticated routes with JWT session-based authentication.

## Project Structure

```
expressBookReviews/
├── index.js              # Entry point, middleware setup
├── router/
│   ├── general.js        # Public routes (no auth required)
│   ├── auth_users.js     # Authenticated customer routes
│   └── booksdb.js        # Book data
├── submissions/          # cURL output files for assessment
├── package.json
└── README.md
```

## Getting Started

```bash
npm install
node index.js
```

Server runs on `http://localhost:5000`

## API Endpoints

### Public Routes (no login required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all books |
| GET | `/isbn/:isbn` | Get book by ISBN |
| GET | `/author/:author` | Get books by author |
| GET | `/title/:title` | Get books by title |
| GET | `/review/:isbn` | Get reviews for a book |
| POST | `/register` | Register a new user |

### Authenticated Routes (login required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/customer/login` | Login as a registered user |
| PUT | `/customer/auth/review/:isbn` | Add or modify a book review |
| DELETE | `/customer/auth/review/:isbn` | Delete your book review |

## Authentication

Login returns a JWT stored in the session. Protected routes require an active session cookie.

```bash
# Login and save session
curl -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}' \
  -c cookie.txt

# Use session for protected routes
curl -X PUT "http://localhost:5000/customer/auth/review/1?review=Great!" \
  -b cookie.txt
```

## Async Implementations

Routes use modern async patterns:
- `GET /` — Promise
- `GET /isbn/:isbn` — Async/Await + Axios
- `GET /author/:author` — Async/Await + Axios
- `GET /title/:title` — Async/Await + Axios
