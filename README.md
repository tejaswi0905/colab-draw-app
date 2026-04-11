# 🎨 Colab-Draw

A high-performance, real-time collaborative drawing application built for the modern web. 

Colab-Draw allows multiple users to simultaneously join "Rooms" and draw together on an infinite digital canvas. The project solves complex concurrency and state-synchronization problems using a custom Event-Sourcing WebSocket architecture, ensuring that every user sees identical shapes and updates instantly at 60 FPS.

## ✨ Features
- **Real-Time Collaboration:** Powered by native WebSockets, broadcasting granular add/delete events to all clients instantly.
- **Infinite Canvas Workspace:** Engineered using `react-konva` for a camera-based coordinate system allowing endless panning, zooming, and drawing.
- **Event-Sourced Syncing:** Uses an append-only event log architecture meaning no data is lost and state interpolation is flawless.
- **O(1) State Lookups:** Managed via Zustand using normalized Hash Maps, stripping away the performance bottlenecks of traditional array looping during massive multi-user drawing sessions.
- **Premium Aesthetics:** Features a sleek dark-mode, glassmorphic UI built natively in Next.js.
- **Google OAuth:** Secure cryptographic token authentication natively bridging cross-domain backend services.

## 🏗️ Architecture Stack
This application is architected as a highly scalable **Turborepo Monorepo**, segmenting the infrastructure into distinctly containerizable services:

- **Frontend:** Next.js, React-Konva, Zustand, TailwindCSS
- **HTTP Backend:** Node.js, Express, Google OAuth, JWT Authentication
- **WebSocket Backend:** Node.js, `ws` library for persistent bi-directional data flow
- **Database:** PostgreSQL (hosted on Neon), Prisma ORM

---

## 🚀 Running Locally

Want to test the app on your own machine? Follow these exact steps to spin up the entire distributed system.

### Prerequisites
- [Node.js](https://nodejs.org/) (v22 or higher)
- [pnpm](https://pnpm.io/) (v9+)
- A [PostgreSQL](https://neon.tech) Database
- A [Google Cloud Console](https://console.cloud.google.com/) Project (for OAuth)

### 1. Clone the Repository
```bash
git clone https://github.com/tejaswi0905/colab-draw-app.git
cd colab-draw-app
```

### 2. Install Dependencies
Because this is a Turborepo, running `pnpm install` in the root directory will elegantly install the dependencies for all apps and packages simultaneously.
```bash
pnpm install
```

### 3. Environment Variables
You need to create three `.env` files across the monorepo to tell the backends how to securely communicate. 

Create a `.env` file inside `packages/db/`:
```env
DATABASE_URL="postgresql://your-postgres-string"
```

Create a `.env` file inside `apps/http-backend/`:
```env
DATABASE_URL="postgresql://your-postgres-string"
JWT_SECRET="your-super-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"
FRONTEND_URL="http://localhost:4000"
```

Create a `.env` file inside `apps/ws-backend/`:
```env
DATABASE_URL="postgresql://your-postgres-string"
JWT_SECRET="your-super-secret-key" # MUST match the http-backend secret!
```

### 4. Database Initialization
Push the Prisma Schema to your database to generate the exact tabular structures required:
```bash
cd packages/db
npx prisma generate
npx prisma db push
cd ../../
```

### 5. Start the Engines!
With a single Turbo command, you can ignite the frontend, the HTTP server, and the Websocket server concurrently:
```bash
pnpm run dev
```

The application will successfully boot, and your frontend will be beautifully listening at: **`http://localhost:4000`**

---
*If you are a recruiter looking at this repository, feel free to inspect `docs/ARCHITECTURE_GUIDE.md` for a master-class deep dive into the specific mathematical algorithms and architectural decisions used to power the real-time drawing engine.*
