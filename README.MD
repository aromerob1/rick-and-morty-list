# Rick and Morty Character App

A full-stack web application to browse, filter, and star Rick and Morty characters, consuming a custom GraphQL API with Redis caching built with Node.js, Express, and Apollo Server, connected to a React frontend.

## Repository Structure

* `/back`: Contains the backend server code (Node.js, Express, Apollo Server, GraphQL, Sequelize, MySQL, Redis). See `./back/README.md` for specific backend setup and usage details.
* `/front`: Contains the frontend application code (React, TypeScript, Vite/CRA, Apollo Client, Tailwind CSS). See `./front/README.md` for specific frontend setup and usage details.

## Getting Started

To run the complete application locally:

1.  **Setup and Run the Backend:** Follow the instructions in `./back/README.md`. (Ensure you have Node.js, npm/yarn, MySQL, and Redis installed and running).
2.  **Setup and Run the Frontend:** Follow the instructions in `./front/README.md`. (Ensure you have Node.js and npm/yarn, and that the backend server is already running).

## Core Technologies

* **Backend:** Node.js, Express, GraphQL (Apollo Server), Sequelize, MySQL, Redis, TypeScript, tsx
* **Frontend:** React, TypeScript, Vite _(or Create React App - specify)_, Apollo Client, React Router DOM, Tailwind CSS
* **Database/Cache:** MySQL, Redis
* **Tooling:** Docker (Optional for DB/Cache), Prettier, Sequelize-CLI, npm/yarn/pnpm