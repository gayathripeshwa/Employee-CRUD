# Employee CRUD

A full-stack employee management app for adding, searching, updating and deleting employee records.

**Stack:** React 19 · React Router · React Hook Form · Axios | Node.js · Express 5 · MongoDB · Mongoose

## Project structure

```
backend/          Express REST API (server.js)
frontend/app3/    React app (Create React App)
```

## Getting started

### Prerequisites
- Node.js 18+
- MongoDB running locally on `mongodb://localhost:27017` (or a MongoDB Atlas URI)

### Backend
```bash
cd backend
cp .env.example .env      # set JWT_SECRET; edit MONGO_URI / PORT if needed
npm install
npm run dev               # or: npm start
```
The API runs on `http://localhost:5000`.

### Frontend
```bash
cd frontend/app3
cp .env.example .env      # REACT_APP_API_URL=http://localhost:5000
npm install
npm start
```
The app opens on `http://localhost:3000`.

## Authentication

Login uses **JWT** (JSON Web Tokens) and passwords are hashed with **bcrypt**.

- The **first account you register becomes admin**. Every account after that is a normal user.
- **Admin:** add, search, update and delete employees.
- **User:** search only.
- Set `JWT_SECRET` in `backend/.env`. The server won't start without it.

## API

| Method | Endpoint         | Access     | Body                                  | Description                 |
|--------|------------------|------------|---------------------------------------|-----------------------------|
| POST   | `/auth/register` | Public     | `{ name, email, password }`           | Create account, returns token |
| POST   | `/auth/login`    | Public     | `{ email, password }`                 | Log in, returns token       |
| POST   | `/emp`           | Admin      | `{ empId, empName, des, dept, join }` | Create an employee          |
| GET    | `/emp/:id`       | Logged in  | –                                     | Get an employee by `empId`  |
| PUT    | `/emp/:id`       | Admin      | `{ des }`                             | Update designation          |
| DELETE | `/emp/:id`       | Admin      | –                                     | Delete and return employee  |

Protected routes need the header `Authorization: Bearer <token>`.

Error responses use the shape `{ "error": "message" }`:
`400` invalid input · `401` not logged in / bad token · `403` not an admin · `404` not found · `409` duplicate · `500` server error.

## Tests
```bash
cd frontend/app3
npm test
```
