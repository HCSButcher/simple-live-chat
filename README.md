# Simple Live Chat

live url =

Simple Live Chat is a full‑stack, role‑aware messaging app built with React, Vite, Socket.IO, and a MongoDB/Express backend. It supports real‑time group messages, private messages, typing indicators, presence tracking, and persistent history via MongoDB.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repository Layout](#repository-layout)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Surface](#api-surface)
- [Development Notes](#development-notes)

## Features

- Real-time messaging powered by Socket.IO with optimistic UI updates.
- Role-aware login flow (admin, farmer, foodbank) with presence list that highlights “You”.
- Typing indicator and online user roster that stays in sync across clients.
- Private messaging support, read receipts, and server-side message persistence.
- REST endpoints to fetch historical messages and registered users.
- Vite-powered React client with Tailwind styling and reusable socket hook.

## Architecture

- **Client (`client/`)**: React/Vite SPA that connects to the Socket.IO server via `useSocket()`. Users log in with a username + role, view live user lists, send messages, and see typing states.
- **Server (`server/`)**: Express app that hosts Socket.IO, connects to MongoDB with Mongoose models (`User`, `Message`), and exposes REST routes for messages/users. Handles presence, typing, private messaging, and read receipts.
- **Transport**: Socket.IO events (`user_join`, `send_message`, `typing`, `message_read`, etc.) plus REST for fetching history.
- **Persistence**: MongoDB stores users and chat history, enabling replay when clients reconnect.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Socket.IO Client.
- **Backend**: Node.js, Express 4, Socket.IO 4, Mongoose 7.
- **Tooling**: ESLint 9, Vite dev server, Nodemon for server hot reloading.

## Repository Layout

```
Simple-live-chat/
├─ README.md               # You are here
├─ client/                 # React + Vite frontend
│  ├─ src/                 # App, components, socket hook, styles
│  ├─ package.json         # Frontend scripts/deps
│  └─ vite.config.js
└─ server/                 # Express/Socket.IO backend
   ├─ server.js            # Main server entry
   ├─ models/              # Mongoose schemas
   └─ package.json         # Backend scripts/deps
```

## Environment Variables

### Client (`client/.env`)

```
VITE_SOCKET_URL=http://localhost:5000   # Socket.IO server URL
```

### Server (`server/.env`)

```
PORT=5000                               # Optional override
MONGO_URI=mongodb://localhost:27017/chat
CLIENT_URL=http://localhost:5173        # Allowed origin for CORS/Socket.IO
```

## Getting Started

1. **Install prerequisites**

   - Node.js 18+ and npm
   - MongoDB instance (local or hosted)

2. **Clone & install**

   ```bash
   git clone <repo-url>
   cd Simple-live-chat
   cd server && npm install
   cd ../client && npm install
   ```

3. **Configure environment**

   - Create `.env` files as shown above inside `server/` and `client/`.

4. **Run the backend**

   ```bash
   cd server
   npm run dev    # or npm start for production mode
   ```

5. **Run the frontend**

   ```bash
   cd client
   npm run dev
   ```

   Vite defaults to `http://localhost:5173`. Log in with a username/role to join the chat room.

6. **Build for production (client)**
   ```bash
   cd client
   npm run build
   npm run preview   # Optional local preview of the build
   ```

## Available Scripts

| Location | Script            | Description                         |
| -------- | ----------------- | ----------------------------------- |
| client   | `npm run dev`     | Start Vite dev server with HMR      |
| client   | `npm run build`   | Build optimized static assets       |
| client   | `npm run lint`    | Run ESLint across the app           |
| client   | `npm run preview` | Preview the production build        |
| server   | `npm run dev`     | Start Express/Socket.IO via nodemon |
| server   | `npm start`       | Start Express/Socket.IO with Node   |

## API Surface

- **Socket events**

  - `user_join { username, role }`: register/login a user.
  - `send_message { message, to?, isPrivate? }`: send public or private messages.
  - `typing boolean`: broadcast typing state; server aggregates and emits `typing_users`.
  - `message_read { messageId }`: update read receipts on the server.
  - Server emits `receive_message`, `private_message`, `user_list`, `user_joined`, `user_left`, `typing_users`, `message_read`.

- **REST endpoints**
  - `GET /api/messages`: chronological list of stored messages.
  - `GET /api/users`: list of registered users.
  - `GET /`: simple health check string.

## Development Notes

- The frontend socket hook (`client/src/socket/socket.js`) centralizes all Socket.IO listeners; extend it when adding new events.
- Tailwind 4 uses the `@tailwindcss/vite` plugin; configure global styles in `src/index.css` and component styles via utility classes.
- Server-side read receipts currently store Socket.IO IDs; adjust to user IDs if persistent identity is required beyond a session.
- For deployment, serve the built client from a static host (or Express) and point `VITE_SOCKET_URL` to the deployed backend with TLS.

Happy chatting!
