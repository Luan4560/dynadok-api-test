# 📦 CRUD Dynadok API — SOLID & Clean Architecture

This is a simple REST API built with Node.js that demonstrates the application of **SOLID principles** and **Clean Architecture**.

---

## ✅ Requirements

Before you begin, make sure you have the following installed:

- **Node.js** v20 or higher
- **Docker** and **Docker Compose**

---

## 🚀 Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/Luan4560/dynadok-api-test.git
cd dynadok-api-test
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

```sh
cp .env.example .env
# Then edit the .env file with the appropriate values
```

### 4. Setup the database

```sh
npx prisma generate
npx prisma migrate dev
```

### 5. Start Docker containers

```sh
docker-compose up -d
```

> Verify the containers are running:

```sh
docker ps
```

### 6. Start the application

```sh
npm run dev
```

> You should now see the available routes listed in your terminal.  
> You can test the API using Postman, Insomnia, or any other REST client.

---

## 📚 API Endpoints

### Base URL

```
http://localhost:4000/clients
```

### Example request body

```json
{
  "name": "Luan",
  "email": "luan1@test.com",
  "phone": "6299992932"
}
```

### Available routes

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| POST   | `/clients`     | Create a client       |
| GET    | `/clients`     | List all clients      |
| GET    | `/clients/:id` | Get a specific client |
| PUT    | `/clients/:id` | Update a client       |
| DELETE | `/clients/:id` | Delete a client       |

---

## 🧪 Running Tests

```sh
npm run test
```

---

## 🛠️ Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **Prisma ORM**
- **SQLite**
- **Docker**
- **SOLID Principles**
- **Clean Architecture**

---

## 📝 Notes

- This project was created for a technical interview challenge.
- The architecture is designed to be scalable and testable.
