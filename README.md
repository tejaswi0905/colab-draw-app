# 🎨 Colab-Draw | Real-time Collaborative Whiteboard

A high-performance, real-time collaborative drawing application that allows multiple users to draw together on an infinite canvas with sub-second synchronization.

**Live Demo:** [colab-draw-app-colab-draw-frontend.vercel.app](https://colab-draw-app-colab-draw-frontend.vercel.app/)

## Why This Project?

This project showcases my ability to solve complex real-time systems problems. It goes far beyond a simple canvas app — handling concurrency, state synchronization, performance optimization, and production-ready architecture.

## ✨ Key Features
- Real-time multi-user drawing with custom WebSocket architecture
- Event-sourced synchronization (new users can replay full drawing history)
- High-performance rendering supporting thousands of vector shapes
- Infinite zoomable canvas with smooth camera controls
- Secure authentication with Google OAuth + JWT
- Turborepo monorepo architecture (separate frontend, HTTP, and WebSocket services)

## 🏗️ Tech Stack & Architecture
- **Frontend**: Next.js, React, React-Konva, Zustand, TailwindCSS
- **Backend**: Node.js, Express
- **Real-time**: Custom WebSocket server (`ws` library)
- **Database**: PostgreSQL + Prisma ORM
- **Monorepo**: Turborepo
- **Auth**: Google OAuth + JWT

**Core Technical Achievements:**
- Event-sourced append-only log system for reliable state synchronization
- Normalized O(1) hash maps + React-Konva optimizations for smooth rendering of thousands of shapes
- Scalable architecture with separate services for HTTP and WebSocket layers

## 🚀 Running Locally

### Prerequisites
- Node.js (v20+)
- pnpm
- PostgreSQL database

### Setup
```bash
git clone https://github.com/tejaswi0905/colab-draw-app.git
cd colab-draw-app
pnpm install
Create .env files in the respective packages (see .env.example files).
pnpm run dev
The app will be available at http://localhost:4000
