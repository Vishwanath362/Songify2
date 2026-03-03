
# Songify

> A full-stack music streaming and sharing platform built with React, Vite, Node.js, and MongoDB.

## Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## About

**Songify** is a modern web application that allows users to upload, stream, and manage their favorite songs. It features authentication, song uploads, a personal library, and a beautiful, responsive UI.

## Features
- User authentication (signup, login, JWT-based)
- Upload and stream audio files
- Song library and search
- Like and manage your favorite songs
- View your uploads
- Responsive design
- Cloudinary integration for media storage
- MongoDB for persistent data

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Cloudinary
- **Other:** Multer (file uploads), ESLint, Netlify/Vercel deployment

## Project Structure

```
songify/
├── backend/           # Express backend (API, DB, Auth, Controllers)
│   ├── config/        # DB and Cloudinary config
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Auth, Multer, etc.
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── app.js         # Express app setup
│   └── index.js       # Server entry point
├── public/            # Static files and deployment configs
├── src/               # React frontend
│   ├── assets/        # Images, icons, etc.
│   ├── authentication/# Auth pages (Login, Signup, Auth)
│   ├── components/    # UI components (Navbar, Dashboard, etc.)
│   ├── config/        # API config
│   ├── App.jsx        # Main app
│   └── ...
├── package.json       # Project metadata and scripts
└── README.md          # Project documentation
```

## Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas or local MongoDB
- Cloudinary account (for media uploads)

### 1. Clone the repository
```sh
git clone https://github.com/Vishwanath362/Songify2.git
cd Songify2/songify
```

### 2. Install dependencies
#### Frontend
```sh
npm install
```
#### Backend
```sh
cd backend
npm install
```

### 3. Configure environment variables
- Create a `.env` file in `backend/` with the following:
	```env
	MONGODB_URI=your_mongodb_connection_string
	CLOUDINARY_CLOUD_NAME=your_cloud_name
	CLOUDINARY_API_KEY=your_api_key
	CLOUDINARY_API_SECRET=your_api_secret
	JWT_SECRET=your_jwt_secret
	```

### 4. Run the application
#### Start Backend
```sh
cd backend
npm run dev
```
#### Start Frontend
```sh
cd ..
npm run dev
```

## Usage
- Visit `http://localhost:5173` for the frontend.
- Backend runs on `http://localhost:3000` (default).
- Sign up, log in, upload songs, and enjoy streaming!

## API Endpoints (Backend)
- `POST /api/users/signup` — Register a new user
- `POST /api/users/login` — User login
- `GET /api/songs` — List all songs
- `POST /api/songs/upload` — Upload a new song (auth required)
- `GET /api/songs/:id` — Get song by ID
- `GET /api/users/me` — Get current user profile (auth required)

## License

MIT
