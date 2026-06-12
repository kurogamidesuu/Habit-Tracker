# Kintsugi

> A minimal, robust full-stack habit tracker designed to help you build consistency, track streaks, and stay on top of your daily routines with customizable push notifications.

![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)
![Backend](https://img.shields.io/badge/API-Render-black?style=for-the-badge&logo=render)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## Features

- **Comprehensive Habit Tracking:** Create, edit, and track daily habits. Monitor your current streaks, lifetime statistics, and best maximum streaks.
- **Authentication Options:** Secure local email/password login or seamless Google OAuth 2.0 integration.
- **Smart Notifications:** Browser-native push notifications for daily reminders and streak warnings, fully customizable to your preferred local time.
- **PWA Ready:** Installable on desktop and mobile devices for a native app-like experience.
- **Account Management:** Full control over your profile—update username, change password, tweak advanced settings, or safely delete your account.
- **Beautiful UI:** A dark-themed, responsive user interface built with Tailwind CSS, featuring smooth transitions and helpful toast notifications.

---

## Tech Stack

### Frontend

- **Framework:** React.js (via Vite)
- **Routing:** React Router v6
- **State Management:** TanStack Query (React Query)
- **Styling:** Tailwind CSS
- **Icons & Feedback:** React Icons, React Toastify

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database & ORM:** PostgreSQL (hosted on Supabase) & Prisma ORM
- **Authentication:** Passport.js (Google OAuth2), JWT (JSON Web Tokens), bcryptjs
- **Background Jobs:** `node-cron` for scheduling streak calculations and reminders
- **Notifications:** Firebase Admin SDK for Web Push
- **Security:** Helmet, Express Rate Limit, CORS

---

## Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A PostgreSQL database (e.g., local Postgres or a free cloud instance from [Supabase](https://supabase.com/))

### 1. Clone the repository

```bash
  git clone [https://github.com/yourusername/habitime.git}(https://github.com/yourusername/habitime.git)
  cd habitime
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
  cd backend
  npm install
```

Create a .env file in the backend directory and configure the following variables:

```
  # Server
  PORT=5000
  NODE_ENV=development
  VITE_FRONTEND_BASE_URL=http://localhost:5173

  # Database (Prisma / PostgreSQL)
  DATABASE_URL="postgresql://user:password@localhost:5432/habitime?schema=public"

  # Authentication & Security
  JWT_SECRET="your_super_secret_jwt_key"
  GOOGLE_CLIENT_ID="your_google_oauth_client_id"
  GOOGLE_CLIENT_SECRET="your_google_oauth_client_secret"

  # Firebase (For Push Notifications)
  FIREBASE_PROJECT_ID="your_firebase_project_id"
  FIREBASE_CLIENT_EMAIL="your_firebase_client_email"
  FIREBASE_PRIVATE_KEY="your_firebase_private_key"
```

Initialize the database using Prisma:

```bash
  npm run build   # Generates Prisma client and compiles TS
  npm run start   # Or use your dev script: npm run dev
```

### 3. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and install dependencies:

```bash
  cd frontend
  npm install
```

Create a .env file in the frontend directory:

```
  VITE_BACKEND_BASE_URL=http://localhost:5000/api
```

Start the Vite development server:

```bash
  npm run dev
```

The app should now be running locally at http://localhost:5173.

---

## Project Structure (Overview)

```text
Habit-Tracker/
├── backend/
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── __tests__/      # Vitest and Supertest files
│   │   ├── controllers/    # API Controllers
│   │   ├── lib/            # Passport configs, Firebase setup, Cron jobs
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # Express routing
│   │   ├── types/          # Defined types
│   │   └── server.ts       # Express entry point
│   └── package.json
│   └── vitest.config.ts
│
├── frontend/
│   ├── public/             # Static assets (PWA icons, etc.)
│   ├── src/
│   │   ├── api/            # Fetch API wrappers
│   │   ├── components/     # Reusable UI components (Modals, Tabs)
│   │   ├── context/        # React Context for shared states
│   │   ├── hooks/          # Custom TanStack query hooks (useUser, useHabits)
│   │   ├── lib/            # Helper functions
│   │   ├── App.tsx         # Root component & routing setup
│   │   ├── index.css       # Main stylesheet
│   │   └── main.tsx        # React DOM render entry
│   │   └── setupTests.ts   # Setup file for frotend tests
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Available Scripts

### Backend

- `npm run dev` - Starts the server in development mode using tsx and nodemon.

- `npm run build` - Generates the Prisma client and compiles TypeScript to JavaScript.

- `npm run start` - Runs Prisma migrations and starts the production server.

- `npm run test` - Runs the Vitest test suite.

### Frontend

- `npm run dev` - Starts the Vite development server.

- `npm run build` - Builds the frontend for production.

- `npm run preview` - Locally previews the production build.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/kurogamidesuu/Habit-Tracker/issues) if you want to contribute.

## License

This project is licensed under the ISC License.

<i>Built by [Hempushp Chauhan](https://github.com/kurogamidesuu) - Feel free to reach out!</i>
