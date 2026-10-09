# Workout Budyyy

A responsive workout tracker built with React, Express, and MongoDB/Mongoose. Workout data is stored in MongoDB; the React client uses Context and `useReducer` to keep the list in sync.

## Features

- View, add, edit, and delete workouts.
- Workout fields: title, load in kg, and reps.
- Server-side validation with field-level error responses and inline form errors.
- Responsive workout dashboard and loading/empty/error states.

## Requirements

- Node.js 18 or newer
- A MongoDB Atlas connection string (or another MongoDB URI)

## Setup

1. Install dependencies:

   ```sh
   npm install --prefix backend
   npm install --prefix frontend
   ```

2. Configure the API:

   ```sh
   cp backend/.env.example backend/.env
   ```

   Set `MONGODB_URI` to your MongoDB connection string. `CLIENT_ORIGIN` defaults to `http://localhost:5173`.

3. Configure the client (optional if using the default API URL):

   ```sh
   cp frontend/.env.example frontend/.env
   ```

   Set `VITE_API_URL` if the API is hosted somewhere other than `http://localhost:5000/api`.

4. Start the API and frontend in separate terminals:

   ```sh
   npm run dev --prefix backend
   npm run dev --prefix frontend
   ```

5. Open `http://localhost:5173`.

## Deploy the frontend to GitHub Pages

GitHub Pages hosts the static React frontend only. Deploy the Express API and MongoDB separately, then:

1. Push this project to a GitHub repository on its `main` branch.
2. To enable workout data, add an Actions variable named `VITE_API_URL` under **Settings → Secrets and variables → Actions → Variables**. Set it to the deployed API base URL, such as `https://api.example.com/api` (do not include `/workouts`). The Pages site can deploy before this is set, but workout requests need a deployed API.
3. Under **Settings → Pages**, set the build and deployment source to **GitHub Actions**.
4. Push to `main`, or manually run **Deploy frontend to GitHub Pages** under the repository’s Actions tab.

The workflow builds the frontend with the repository-specific Pages base path and deploys `frontend/dist`. Configure the deployed API to allow requests from the resulting Pages origin through its `CLIENT_ORIGIN` setting.

## API

All workout endpoints are under `/api/workouts`.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/workouts` | List workouts, newest first |
| POST | `/api/workouts` | Create a workout |
| PATCH | `/api/workouts/:id` | Update a workout |
| DELETE | `/api/workouts/:id` | Delete a workout |

Create and update bodies use JSON, for example:

```json
{ "title": "Bench press", "load": 60, "reps": 10 }
```

Invalid request data returns HTTP `400` with a `message` and an `errors` object keyed by field. Unknown workout IDs return `404`.
