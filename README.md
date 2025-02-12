A todolist to manage... todos

## Features

- User account (registration disabled) with a demo acount open to the public (credentials displayed on the login page)
- Basic CRUD operations on todos
- Installable as a PWA

I went with Vite and @tanstack/react-router instead of Next because I feel like Next was definitely overkill for a simple todolist app. I prefer using Vitest for testing so Vite made a lot of sense.

I used shadcn/ui for the components because I wanted to focus on fonctionality and not design.

I used Zod for validation because the random users api is not type safe.

I went with server-side storage, well a SQLite database to be precise because it made sense if I wanted to implement auth. I chose Pocketbase because it is a single binary that is very cost effective. Another choice would have been to use serverless/edge (like Vercel) with a serverless database (Vercel postgres or Turso), but that seemed like overkill as well. Finally, I like "owning" my auth (and I like open source as well) so that I have control over it, so solutions like Clerk or Auth0 were a no go.

## Stack

### Frontend

- React with the React compiler (because it's basically free performance)
- @tanstack/react-query and @tanstack/react-router
- TypeScript
- Tailwind CSS
- Vite & Vitest for testing [tests located here](./packages/app/tests/app.test.tsx)
- Zod
- shadcn/ui for the amazing components
- Vite PWA

### Backend

- Pocketbase for auth

### Hosting

- The demo auth server is hosted on my home server but it can run wherever with Docker. The frontend is hosted on Vercel.
