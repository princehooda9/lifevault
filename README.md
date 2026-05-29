# LifeVault

> Cloud-based intelligent personal workspace for secure file and notes management.

**Live App:** https://lifevault-alpha.vercel.app

## Features
- 🔐 Authentication via Firebase (Google + Email)
- 📁 Drag-and-drop upload, nested folders, smart file categorization
- ⭐ Priority Vault for pinned files
- 📝 Rich-text notes with Tiptap editor
- ⏰ Auto deadline/reminder extraction from notes (Chrono.js)
- 📊 Storage analytics & activity tracking
- ☁️ Cloudinary storage + Firestore real-time DB

## Tech Stack
React · Vite · Tailwind CSS · Firebase · Cloudinary · Firestore · Vercel

## Run Locally
```bash
git clone https://github.com/princehooda9/lifevault
cd lifevault
npm install
cp .env.example .env  # Add your API keys
npm run dev
```

## Environment
Create a `.env` file based on `.env.example` before running locally.
## Variables in .env file
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
