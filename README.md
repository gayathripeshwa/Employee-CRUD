# Employee CRUD

A full-stack employee management app for adding, searching, updating and deleting employee records.

**Stack:** React 19 · React Router · React Hook Form · Axios | Node.js · Express 5 · MongoDB · Mongoose

## Features

- **Employee directory:** search by name, filter by department and status, sort any column, 10 per page
- **Employee profile:** job and contact details, status badge, last-updated date
- **Add / Edit form:** one shared form with field-by-field validation; every field can be edited
- **Login with roles:** admins can add, edit and delete and see salaries; users can browse only

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
| GET    | `/emp`           | Logged in  | –                                     | List employees (see query options below) |
| GET    | `/emp/departments` | Logged in | –                                    | Departments in use          |
| GET    | `/emp/:id`       | Logged in  | –                                     | Get one employee by `empId` |
| POST   | `/emp`           | Admin      | employee fields (below)               | Create an employee          |
| PUT    | `/emp/:id`       | Admin      | any employee fields except `empId`    | Update; send `""` to clear an optional field |
| DELETE | `/emp/:id`       | Admin      | –                                     | Delete and return employee  |

**Employee fields:** `empId`, `empName`, `des`, `dept`, `join` (required) · `email`, `phone`, `salary`, `status` (`Active`, `On leave`, `Exited`) (optional).
Salary is left out of responses for normal users.

**`GET /emp` query options:** `search` (name contains, case-insensitive), `dept`, `status`, `sort` (`empId`, `empName`, `dept`, `join`, `status`, `salary`), `order` (`asc` / `desc`), `page`, `limit` (max 50).
Returns `{ employees, total, page, pages }`.

Protected routes need the header `Authorization: Bearer <token>`.

Error responses use the shape `{ "error": "message" }`:
`400` invalid input · `401` not logged in / bad token · `403` not an admin · `404` not found · `409` duplicate · `500` server error.

## Tests
```bash
cd frontend/app3
npm test
```
