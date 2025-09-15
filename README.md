# Fracttal Task Management Application

This repository contains a full-stack task management application built with React, Node.js (Express), and PostgreSQL.

## Backend Setup

### Prerequisites

Before you begin, ensure you have the following installed:

*   Node.js (v18 or higher)
*   npm (comes with Node.js)
*   Docker & Docker Compose (for running PostgreSQL)

### 1. Navigate to the Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the `backend/` directory based on `.env.example`.

```
# .env example
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tasklist_db?schema=public"
JWT_SECRET="your_jwt_secret_key"
PORT=3001
```

**Note:**
*   `DATABASE_URL`: Configure this to point to your PostgreSQL instance. If using Docker Compose, the host will be `db` (e.g., `postgresql://postgres:postgres@db:5432/tasklist_db?schema=public`).
*   `JWT_SECRET`: Generate a strong, random string for JWT token signing.
*   `PORT`: The port on which the backend server will run. (Default: 3001)

### 4. Database Setup (PostgreSQL with Docker Compose)

We'll use Docker Compose to easily set up a PostgreSQL database.

First, ensure you are in the project root directory (where `docker-compose.yml` is located).

```bash
cd .. # If you are in the backend directory
```

Then, start the PostgreSQL container:

```bash
docker-compose up -d db
```

This will start a PostgreSQL container named `db`. You can verify it's running with `docker-compose ps`.

### 5. Run Prisma Migrations

Once the PostgreSQL container is running, navigate back to the `backend/` directory and apply the database migrations:

```bash
cd backend
npx prisma migrate dev --name initial_setup
```

This command will create the necessary tables in your PostgreSQL database.

### 6. Start the Backend Server

```bash
npm run dev
```

The backend server should now be running on `http://localhost:3001` (or the port specified in your `.env` file).

---