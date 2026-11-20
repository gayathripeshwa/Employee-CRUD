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
cp .env.example .env      # edit MONGO_URI / PORT if needed
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

## API

| Method | Endpoint    | Body                                      | Description                 |
|--------|-------------|-------------------------------------------|-----------------------------|
| POST   | `/emp`      | `{ empId, empName, des, dept, join }`     | Create an employee          |
| GET    | `/emp/:id`  | –                                         | Get an employee by `empId`  |
| PUT    | `/emp/:id`  | `{ des }`                                 | Update designation          |
| DELETE | `/emp/:id`  | –                                         | Delete and return employee  |

Error responses use the shape `{ "error": "message" }`:
`400` invalid input · `404` not found · `409` duplicate `empId` · `500` server error.

## Tests
```bash
cd frontend/app3
npm test
```
