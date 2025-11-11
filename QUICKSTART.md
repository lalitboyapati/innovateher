# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account

## Setup (5 minutes)

1. **Install dependencies:**
   ```bash
   npm install
   npm run install-all
   ```

2. **Configure MongoDB:**
   - Create `server/.env` file:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/innovateher
     ```

3. **Seed database (optional):**
   ```bash
   cd server
   npm run seed
   cd ..
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/health

## What You'll See

- **Left Side:** Project cards with assigned judges
- **Right Side:** Unassigned judges panel and quick actions

## Try It Out

1. Drag a judge from "Unassigned Judges" to a project card
2. Click on any judge to see their profile
3. Watch the judge count update in real-time

## Troubleshooting

**MongoDB connection error?**
- Make sure MongoDB is running: `mongod` or check MongoDB service
- Verify your connection string in `server/.env`

**Port already in use?**
- Change `PORT` in `server/.env` for backend
- Change port in `client/vite.config.ts` for frontend

**Can't see data?**
- Run the seed script: `cd server && npm run seed`
- Check browser console for errors
- Verify backend is running on port 5000

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check [SETUP.md](./SETUP.md) for advanced setup options
- Explore the API endpoints in the server routes

