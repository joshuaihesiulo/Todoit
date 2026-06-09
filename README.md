# Daily Do's — Todo App

A full-featured to-do list application with Firebase Authentication, real-time Firestore sync, and a playful Daily Do's design language. Built with **React 19**, **Vite 6**, **Tailwind CSS v4**, and **Firebase**.

## Features

- **Email/Password Authentication** — Register and sign in with email + password
- **Google Sign-In** — One-click login with Google popup
- **Forced Sign-Out on Registration** — New accounts are signed out immediately; users must explicitly sign in (prevents accidental auto-login)
- **Guest Mode** — Use the app without an account; data persists in `localStorage`
- **Real-Time Sync** — Authenticated users' tasks are synced across devices via Firestore `onSnapshot`
- **Per-User Isolation** — Each user sees only their own tasks, scoped by Firestore `where("userId", "==", user.uid)` queries
- **CRUD Operations** — Add, toggle complete, delete, and clear completed tasks
- **Filter by Tag** — Filter tasks by Urgent / Planning / Personal tags
- **Responsive Design** — Mobile-first layout with playful Daily Do's styling (cream backgrounds, thick borders, coral buttons)
- **AI-Ready** — `@google/genai` dependency included for future AI features

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) |
| Build Tool | [Vite 6](https://vitejs.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| State Management | [Zustand](https://github.com/pmndrs/zustand) |
| Auth & Database | [Firebase](https://firebase.google.com/) (Auth + Firestore) |
| Icons | [Lucide React](https://lucide.dev/) |
| Backend | [Express](http://expressjs.com/) (optional, for server-side features) |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A [Firebase](https://firebase.google.com/) project with **Authentication** (Email/Password + Google) and **Firestore Database** enabled

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/joshuaihesiulo/Todoit.git
cd Todoit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase project values:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

These values can be found in your Firebase Console → Project Settings → General → Your apps → Web app.

### 4. Enable Firebase services

In the [Firebase Console](https://console.firebase.google.com/):

1. **Authentication** → Sign-in method → Enable **Email/Password** and **Google**
2. **Firestore Database** → Create database (start in test mode for development)

#### Firestore security rules (recommended)

For production, use these rules to enforce per-user data isolation:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{document} {
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### 5. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run TypeScript type checking |
| `npm run clean` | Remove `dist/` and build artifacts |

## Project Structure

```
src/
├── AuthContext.jsx           # Firebase auth provider & hooks
├── firebase.js               # Firebase config & exports
├── App.jsx                   # Root component with Firestore listener
├── main.jsx                  # Entry point
├── index.css                 # Global styles & Tailwind imports
├── components/
│   ├── AuthModal.jsx         # Sign-in / Register / Google / Guest modal
│   ├── Header.jsx            # Title, task counter, sign-out button
│   ├── TodoForm.jsx          # Add task form with tag selector
│   ├── TodoItem.jsx          # Individual task row (toggle, delete, tag)
│   ├── FilterBar.jsx         # Filter by tag (All / Urgent / Planning / Personal)
│   └── TodoLegend.jsx        # Tag color legend
└── store/
    ├── todoStore.js          # Zustand store: Firestore CRUD + guest fallback
    ├── formStore.js          # Zustand store: form input state
    └── filterStore.js        # Zustand store: active filter
```

## Data Flow

### Authenticated users

1. User signs in → `AuthContext` sets the Firebase `user` object
2. `App.jsx` `useEffect` detects the user and sets up an `onSnapshot` listener:
   ```
   query(collection(db, "todos"), where("userId", "==", user.uid))
   ```
3. All CRUD actions (`addTodo`, `toggleTodo`, `deleteTodo`, `clearCompleted`) call Firestore directly (`addDoc`, `updateDoc`, `deleteDoc`)
4. The snapshot listener automatically re-renders the UI on any change

### Guest users

1. User clicks "Continue as Guest" → `guest` flag set in `AuthContext` and `localStorage`
2. `App.jsx` falls back to `loadGuestTodos()` which reads from `localStorage` (key: `guest_todos`)
3. All CRUD actions mutate the local Zustand state and persist to `localStorage`

## Authentication Flow

| Action | Behavior |
|---|---|
| Register with email | Account created → immediately signed out → tab switches to Sign In → green success message |
| Sign in with email | Normal sign-in → dashboard |
| Sign in with Google | If **new user**: signed out → prompted to sign in again via the Sign In tab |
| Sign in with Google | If **returning user**: normal sign-in → dashboard |
| Continue as Guest | No account required → data stored in `localStorage` |

## Deployment

Build the project and deploy the `dist/` folder to any static host:

```bash
npm run build
```

Supported hosts: Firebase Hosting, Vercel, Netlify, Cloudflare Pages, or any static file server.

## License

This project is provided for educational purposes as part of the TechXBootcamp curriculum.
