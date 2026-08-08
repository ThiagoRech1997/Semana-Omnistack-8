# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TinDev** - A Tinder-like matching app for developers, built during Semana OmniStack 8 (Rocketseat). Devs log in with their GitHub username, browse other devs, like/dislike them, and get real-time match notifications when two devs mutually like each other.

Three applications: Express API backend, React web frontend, and React Native mobile app.

## Architecture

### Backend (Express + MongoDB + Socket.io)

- **Single model**: `Dev` — stores name, GitHub user, avatar, bio, likes[], dislikes[]
- **Auth**: Header-based (`user` header with MongoDB `_id`), no JWT/sessions
- **Endpoints**: `POST /devs` (create via GitHub API), `GET /devs` (list unswept devs), `POST /devs/:devId/likes`, `POST /devs/:devId/dislikes`
- **Real-time**: Socket.io tracks connected users; emits `match` event on mutual likes
- **Security middleware**: Helmet, rate limiting, CORS, Joi validation

### Frontend (React 16 + React Router 5)

- Two pages: **Login** (GitHub username) and **Main** (card swiping + match modal)
- API base URL from `REACT_APP_API_URL` env var (fallback `http://localhost:3050`)
- Socket.io-client for real-time match notifications
- User ID stored in `localStorage`

### Mobile (React Native 0.60 + React Navigation 3)

- Same two screens as web (Login + Main) with card-based swipe UI
- API base URL hardcoded to `http://localhost:3333` in `tindev/src/services/api.js`
- User ID stored in `AsyncStorage`

## Development Commands

### Docker (recommended)

```bash
# Start all services (MongoDB + backend + frontend)
docker-compose -f docker-compose.dev.yml up

# Rebuild after dependency changes
docker-compose -f docker-compose.dev.yml up --build
```

Ports: MongoDB 27017, Backend 3050, Frontend 3000.

### Local Development

```bash
# Backend (requires MongoDB running)
cd backend
cp env.example .env  # configure MONGODB_URI
npm install
npm run dev          # nodemon on port 3050

# Frontend
cd frontend
npm install
npm start            # CRA dev server on port 3000

# Mobile
cd tindev
npm install
npx react-native run-android  # or run-ios
```

### Frontend Tests

```bash
cd frontend
npm test             # react-scripts test (Jest)
```

## Environment Variables

Backend (`backend/.env`): `MONGODB_URI`, `PORT` (3050), `JWT_SECRET`, `CORS_ORIGIN`, `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`. See `backend/env.example`.

Frontend: `REACT_APP_API_URL` (default `http://localhost:3050`).

## Key Files

- `backend/src/server.js` — Express app setup, Socket.io initialization, middleware chain
- `backend/src/routes.js` — API route definitions
- `backend/src/controllers/` — DevController (CRUD), LikeController, DislikeController
- `backend/src/models/Dev.js` — Mongoose schema
- `frontend/src/pages/Main.js` — Main swiping page with Socket.io match listener
- `mongo-init.js` — MongoDB initialization script for Docker
