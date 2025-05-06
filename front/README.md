# Rick and Morty Character Browser (Frontend)

This project is a React frontend application built with TypeScript (and likely Vite or Create React App) that consumes the accompanying [Rick and Morty GraphQL API backend](#link-to-your-backend-repo-or-readme). It allows users to browse, filter, star, and view details of characters fetched from the API.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or later recommended)
- npm (v8+), yarn, or pnpm
- Git
- The **Backend API** must be running, as this frontend consumes its data. By default, the backend is expected at `http://localhost:3000/graphql`.

## Setup and Installation

1.  **Navigate to Frontend Directory:**
    Assuming your project has separate `front` and `back` directories, navigate to the frontend directory from your main project root:

    ```bash
    cd front
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    # OR yarn install
    # OR pnpm install
    ```

3.  **Environment Variables:**
    - Create a `.env` file in the `front` directory root by copying the example:
      ```bash
      cp .env.example .env
      ```
    - Edit the `.env` file and set the URL for your running GraphQL backend API. The variable name depends on your build tool:
      - **If using Vite:**
        ```dotenv
        # .env for Vite
        VITE_GRAPHQL_ENDPOINT=http://localhost:3000/graphql
        ```
      - **If using Create React App:**
        `dotenv
    # .env for Create React App
    REACT*APP_GRAPHQL_ENDPOINT=http://localhost:3000/graphql
    `
    *(Adjust the URL if your backend runs on a different port).\_

## Running the Application (Development)

To start the frontend development server:

- **If using Vite:**

  ```bash
  npm run dev
  ```

  The application will typically be available at `http://localhost:5173`.

- **If using Create React App:**
  ```bash
  npm start
  ```
  The application will typically be available at `http://localhost:3001`.

Open the provided URL in your browser. Ensure the backend server is running simultaneously for the frontend to fetch data.

## Features

- Displays separate lists for "Starred" and "Other" Rick and Morty characters.
- Real-time search/filter characters by name via the search bar (debounced).
- Filter characters by Status and Species using a filter panel accessible from the search bar.
- Mark/unmark characters as "Starred" using the heart icon on each character item. Changes persist in the backend database and update the UI lists via GraphQL mutations and query refetching.
- Responsive Master-Detail view:
  - On desktop (large screens), selecting a character from the list displays its details in a dedicated panel on the right side of the screen without navigating away.
  - On mobile (small screens), selecting a character navigates the user to a separate detail page (`/character/:id`).
- Utilizes Apollo Client for GraphQL communication, including client-side caching.
- Uses Redis caching on the backend (via the GraphQL API) to optimize fetching from the database.

## Technology Stack

- React
- TypeScript
- Vite / Create React App _(Specify which one you used)_
- Apollo Client (GraphQL Client)
- React Router DOM (Routing)
- Tailwind CSS (Styling)
- Prettier (Code formatting)

## Project Structure (Simplified)

The project follows a standard React project structure:

```
src/
├── assets/          # Static assets (icons, images)
├── components/      # Reusable UI components (SearchBar, CharacterItem, LikeHeart, FilterPanel, CharacterDetailView etc.)
├── hooks/           # Custom React hooks (e.g., useDebounce, useMediaQuery)
├── lib/             # Library configurations (e.g., apolloClient.ts)
├── pages/           # Page-level components (CharacterPage, CharacterDetailPage)
├── types/           # Shared TypeScript types/interfaces (e.g., ActiveFilters)
├── App.tsx          # Main application component with routing setup
└── main.tsx         # Application entry point (renders App, sets up ApolloProvider, Router)
.env                 # Local environment variables (gitignored)
.env.example         # Example environment variables
.gitignore
.prettierrc.json     # Prettier configuration
.prettierignore
package.json
tsconfig.json
vite.config.ts       # (If using Vite)
tailwind.config.js   # Tailwind configuration
postcss.config.js    # PostCSS configuration (for Tailwind)
```
