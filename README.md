# 🎨 Colab-Draw

A high-performance, real-time collaborative drawing application built for the modern web. 

Colab-Draw allows multiple users to simultaneously join "Rooms" and draw together on an infinite digital canvas. The project solves complex concurrency and state-synchronization problems using a custom Event-Sourcing WebSocket architecture, ensuring that every user sees identical shapes and updates instantly at 60 FPS.

## 📖 About This Project

Colab-Draw was conceptualized to bridge the gap between simple HTML5 canvas plugins and enterprise-grade whiteboard solutions like Miro or Excalidraw. 

Building a truly real-time canvas introduces incredibly difficult computer science challenges, primarily **State Synchronization** and **Rendering Bottlenecks**. 

Instead of traditional rendering methods where the entire canvas redrawing drops frames on every mouse move, Colab-Draw utilizes a React-Konva reconciliation layer fueled by a normalized O(1) Hash Map. Because of this, it can gracefully render thousands of vector shapes simultaneously without lagging. Furthermore, instead of simply saving the "final image", this application inherently respects the journey: utilizing an Event-Sourced append-only logging system over permanent WebSockets allows new users to elegantly "replay" the history of a room drawing stroke-by-stroke the exact moment they join.

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

## 🤝 Contributing

This project is fully open source and actively welcomes contributions from the community! Whether it's adding new vector tools, improving the WebSocket latency, or refining the UI, your PRs are highly appreciated.

### How to Contribute:
1. **Fork the repository** to your own GitHub account.
2. **Create a new branch** for your feature or bug fix (`git checkout -b feature/amazing-new-tool`).
3. **Commit your changes** with highly descriptive messages (`git commit -m 'Added complex bezier curve tool'`).
4. **Push the branch** back to your fork (`git push origin feature/amazing-new-tool`).
5. **Open a Pull Request** against the `main` branch of this repository.

Please ensure that you run `pnpm run lint` and `pnpm run check-types` across the Turborepo before submitting a PR to keep the codebase universally type-safe!

---
*If you are a recruiter looking at this repository, feel free to inspect `docs/ARCHITECTURE_GUIDE.md` for a master-class deep dive into the specific mathematical algorithms and architectural decisions used to power the real-time drawing engine.*
