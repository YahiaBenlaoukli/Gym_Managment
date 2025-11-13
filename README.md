# FitnessCity — Project Overview

Minimal documentation for the monorepo (client + server).

## Layout
- [server/server.js](server/server.js) — Express app bootstrap
- [server/routes/auth.js](server/routes/auth.js) — Auth routes
- [server/controllers/authController.js](server/controllers/authController.js) — Controllers: [`authController.newUser`](server/controllers/authController.js), [`authController.login`](server/controllers/authController.js), [`authController.getProfile`](server/controllers/authController.js)
- [server/middleware/AuthenticationToken.js](server/middleware/AuthenticationToken.js) — Middleware: [`authenticateToken`](server/middleware/AuthenticationToken.js)
- [server/db.js](server/db.js) — DB connection helper: [`getConnection`](server/db.js)
- [server/request.rest](server/request.rest) — example REST request
- [server/package.json](server/package.json) — server scripts & deps

- [client/package.json](client/package.json) — client scripts & deps
- [client/src/App.js](client/src/App.js) — Router and app entry
- [client/src/services/api.js](client/src/services/api.js) — axios instance: [`api`](client/src/services/api.js)
- [client/src/components/Authentication/Authentication.jsx](client/src/components/Authentication/Authentication.jsx) — Login / Sign-up UI
- [client/src/components/Navbar/Navbar.jsx](client/src/components/Navbar/Navbar.jsx) — Navbar + profile fetch
- [client/src/components/Dashboard/Dashboard.jsx](client/src/components/Dashboard/Dashboard.jsx) — Dashboard screen
- [client/public/index.html](client/public/index.html) — static HTML

- [.gitignore](.gitignore)

## Quick start

From repository root:

1. Server
   - cd server
   - npm install
   - create a `.env` with:
     ```
     DB_HOST=...
     DB_USER=...
     DB_PASSWORD=...
     DB_NAME=...
     ACCESS_TOKEN_SECRET=your_jwt_secret
     PORT=3000
     ```
   - Run: `npm run dev` (uses nodemon)

2. Client
   - cd client
   - npm install
   - Run: `npm start`

## API (auth)
- POST /api/auth/register → handled by [`authController.newUser`](server/controllers/authController.js)  
  Example: [server/request.rest](server/request.rest)
- POST /api/auth/login → handled by [`authController.login`](server/controllers/authController.js)
- GET /api/auth/profile → protected by [`authenticateToken`](server/middleware/AuthenticationToken.js) and handled by [`authController.getProfile`](server/controllers/authController.js)

Client uses [`api`](client/src/services/api.js) axios instance with `withCredentials: true`.

## Important notes & known issues (action items)

1. Token transport mismatch
   - Server sets cookie: `res.cookie('token', token, {httpOnly: true})` in [`authController.login`](server/controllers/authController.js).
   - Middleware [`authenticateToken`](server/middleware/AuthenticationToken.js) expects a Bearer token in the `Authorization` header.
   - Client (`client/src/services/api.js`) uses cookies (`withCredentials: true`) and does not send an Authorization header.
   - Fix options:
     - Read cookie server-side (install and use `cookie-parser`) and update [`authenticateToken`](server/middleware/AuthenticationToken.js) to check `req.cookies.token`, or
     - Return token to client and have client set `Authorization: Bearer ...` on requests.

2. CORS origin mismatch
   - CORS in [server/server.js](server/server.js) allows origin `http://localhost:3001`, while the React dev server typically runs at `http://localhost:3000`. Update origin as needed.

3. Syntax / runtime issues in server controller
   - [`authController.login`](server/controllers/authController.js) has an incomplete `catch` block and exporting order that will cause syntax/runtime errors. Review and ensure the `try/catch` is closed properly and `exports.login` is correctly defined.

4. Client-side minor bugs
   - In [client/src/App.js](client/src/App.js) the root div uses `classname` instead of `className`.
   - In [client/src/components/Dashboard/Dashboard.jsx](client/src/components/Dashboard/Dashboard.jsx) `import react from "react"` should be `import React from "react"` (or `import React, { useState } from "react";` if hooks used).

5. Database
   - Ensure MySQL has a `users` table matching fields used in [`authController.newUser`](server/controllers/authController.js) (`username`, `email`, `password`).
   - See [server/db.js](server/db.js) for connection helper.

## Suggestions / improvements
- Use `cookie-parser` and secure cookies (set `sameSite`, `secure` when in production).
- Use consistent token transport (prefer HTTP-only cookies for XSRF protection).
- Add input validation and stronger error messages.
- Add migrations or SQL schema file for `users` table.
- Add tests for authentication flows.

## References (open files)
- [server/server.js](server/server.js)  
- [server/routes/auth.js](server/routes/auth.js)  
- [server/controllers/authController.js](server/controllers/authController.js)  
- [server/middleware/AuthenticationToken.js](server/middleware/AuthenticationToken.js)  
- [server/db.js](server/db.js)  
- [server/request.rest](server/request.rest)  
- [server/package.json](server/package.json)  
- [client/package.json](client/package.json)  
- [client/src/services/api.js](client/src/services/api.js)  
- [client/src/components/Authentication/Authentication.jsx](client/src/components/Authentication/Authentication.jsx)  
- [client/src/components/Navbar/Navbar.jsx](client/src/components/Navbar/Navbar.jsx)  
- [client/src/components/Dashboard/Dashboard.jsx](client/src/components/Dashboard/Dashboard.jsx)  
- [client/src/App.js](client/src/App.js)  
- [client/public/index.html](client/public/index.html)  
- [.gitignore](.gitignore)
