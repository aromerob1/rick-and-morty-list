# Rick and Morty GraphQL API (Backend)

This project is a Node.js backend application built with Express and Apollo Server, providing a GraphQL API to query Rick and Morty character data. It uses Sequelize with MySQL for data persistence (storing characters and their starred status), Redis for caching API results, and fetches initial data from the public Rick and Morty REST API.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or later recommended)
- npm (v8+), yarn, or pnpm
- Git
- A running MySQL server instance
- A running Redis server instance
- \[Optional] Docker Desktop (if running MySQL/Redis via Docker)

## Setup and Installation

1.  **Clone the Repository:**

    ```bash
    # If you haven't already
    git clone <repository-url>
    cd <repository-folder>/back
    ```

2.  **Install Dependencies:**
    Navigate to the \`back\` directory (this project's root) and run:

    ```bash
    npm install
    # OR yarn install
    # OR pnpm install
    ```

3.  **Environment Variables:**

    - Create a `.env` file in the `back` directory root by copying the `.env.example` file:
      ```bash
      cp .env.example .env
      ```
    - Edit the `.env` file and provide your actual database credentials, Redis URL, and desired port:
      - `DB_HOST`: MySQL host (e.g., `localhost`)
      - `DB_PORT`: MySQL port (e.g., `3306`)
      - `DB_USER`: MySQL username
      - `DB_PASSWORD`: MySQL password
      - `DB_NAME`: The name for your MySQL database (e.g., `rick_morty_db`)
      - `REDIS_URL`: Connection URL for Redis (e.g., `redis://localhost:6379`)
      - `PORT`: Port for the Express server (e.g., `3000`)
      - `NODE_ENV`: Set to `development`
      - _(Other variables like `RICKMORTY_API_BASE_URL`, `GRAPHQL_PATH` usually have defaults set in config)_

4.  **Database Setup:**
    - **Create Database:** Manually create the database specified in your \`.env\` file using a MySQL client:
      ```sql
      CREATE DATABASE IF NOT EXISTS your_db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      ```
      (Replace `your_db_name` with the value of `DB_NAME` from your `.env`)
    - **Run Migrations:** Apply the database schema (create tables like `Characters`). Make sure you have edited the migration file (`db/migrations/...-create-characters-table.js`) correctly.
      ```bash
      npx sequelize-cli db:migrate
      ```
    - **Seed Initial Data:** Populate the database with the first 15 characters from the Rick and Morty API using the script created earlier.
      ```bash
      npm run seed
      # OR yarn seed / pnpm seed
      ```

## Running the Application (Development)

To start the server in development mode (using `tsx` for live reloading):

```bash
npm run dev
```

The server will start, connect to the database and Redis, and listen on the port specified in your `.env` file (defaulting to 3000). You should see log messages indicating successful connections.

The GraphQL endpoint will be available at: `http://localhost:[PORT]/graphql` (e.g., `http://localhost:3000/graphql`)

## Using the GraphQL API

It's recommended to use a GraphQL client like **Apollo Sandbox** (available by navigating to `/graphql` in your browser when the server is running), Postman, or Insomnia to interact with the API.

**Endpoint:** `POST http://localhost:[PORT]/graphql`

### Example Queries & Mutations

**Important:** Use the "Variables" panel in your GraphQL client to provide values for variables like `$id`, `$filter`, `$characterId`, `$newState`.

**1. Get a Single Character by ID:**

- **Query:**
  ```graphql
  query GetCharacterById($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      image
      starred
      originName
      locationName
      createdAt
      updatedAt
    }
  }
  ```
- **Variables:**
  ```json
  {
    "id": "1"
  }
  ```

**2. Get Characters with Filters:**

- **Query:**
  ```graphql
  query GetFilteredCharacters($filter: FilterCharacterInput) {
    characters(filter: $filter) {
      id
      name
      status
      species
      starred
      image
    }
  }
  ```
- **Variables (Example: Alive Humans - Non-Starred List):**
  _(Remember your frontend fetches starred/non-starred separately)_
  ```json
  {
    "filter": {
      "starred": false,
      "status": "Alive",
      "species": "Human"
    }
  }
  \`\`\`
  ```
- **Variables (Example: Starred Characters named "Morty"):**
  ```json
  {
    "filter": {
      "starred": true,
      "name": "Morty"
    }
  }
  ```
- **Variables (Example: Get all Non-Starred):**
  ```json
  {
    "filter": {
      "starred": false
    }
  }
  ```

**3. Update Starred Status (Mutation):**

- **Mutation:**
  ```graphql
  mutation SetStarredStatus($characterId: ID!, $newState: Boolean!) {
    updateCharacterStarred(id: $characterId, starred: $newState) {
      id
      name
      starred
    }
  }
  ```
- **Variables (Example: Star character 5):**
  ```json
  {
    "characterId": "5",
    "newState": true
  }
  ```
- **Variables (Example: Unstar character 1):**
  ```json
  {
    "characterId": "1",
    "newState": false
  }
  ```

## Technology Stack

- Node.js
- TypeScript
- tsx (TypeScript execution)
- Express.js
- Apollo Server (GraphQL)
- Sequelize (ORM)
- mysql2 (MySQL Driver)
- MySQL (Database)
- redis (Client library for caching)
- Redis Server (Cache store)
- dotenv (Environment variables)
- sequelize-cli (Migrations & Seeding)
- prettier (Code formatting)
- cors (Cross-Origin Resource Sharing)

## Project Structure (Simplified)

The project follows a classic layered approach:

```
src/
├── config/          # Environment variables, DB connection details
├── db/              # Sequelize connection, migrations, seeders, CLI config
├── graphql/         # GraphQL Schema (typeDefs), Resolvers, Context
├── lib/             # Shared utilities (Redis client, Logger)
├── middleware/      # Custom Express middleware (e.g., requestLogger)
├── models/          # Sequelize model definitions
├── services/        # Business logic, interacts with models/clients/cache
├── clients/         # Clients for external APIs (e.g., Rick & Morty API)
├── index.ts         # Application entry point (DB/Redis connect, server start)
└── server.ts        # Express app configuration, Apollo Server setup
scripts/             # Standalone scripts (e.g., seeding)
tests/               # Tests (if any)
.env                 # Local environment variables (gitignored)
.env.example         # Example environment variables
.prettierrc.json     # Prettier configuration
.prettierignore      # Prettier ignore file
.sequelizerc         # Sequelize-CLI configuration (optional)
package.json
tsconfig.json
```
