# Setup Instructions

## Quick Start

1. **Install all dependencies:**
   ```bash
   npm install
   npm run install-all
   ```

2. **Set up MongoDB:**
   - Install MongoDB locally, or
   - Use MongoDB Atlas (cloud)

3. **Configure environment variables:**
   - Create `server/.env` file:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/innovateher
     ```
   - For MongoDB Atlas, use your connection string:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/innovateher
     ```

4. **Seed the database (optional):**
   ```bash
   cd server
   npm run seed
   ```

5. **Run the application:**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend dev server (port 3000).

## MongoDB Setup Options

### Option 1: Local MongoDB

1. Install MongoDB Community Edition:
   - macOS: `brew install mongodb-community`
   - Ubuntu: `sudo apt-get install mongodb`
   - Windows: Download from mongodb.com

2. Start MongoDB:
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
   - Windows: MongoDB starts as a service automatically

3. Use connection string: `mongodb://localhost:27017/innovateher`

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and use it in `.env`

## Troubleshooting

### Port Already in Use
- Backend (5000): Change `PORT` in `server/.env`
- Frontend (3000): Change port in `client/vite.config.ts`

### MongoDB Connection Failed
- Check if MongoDB is running (local)
- Verify connection string in `.env`
- Check firewall settings (MongoDB Atlas)
- Ensure network access is configured (MongoDB Atlas)

### CORS Errors
- Backend CORS is configured to allow all origins in development
- For production, update CORS settings in `server/server.js`

## Project Structure

```
InnovateHer/
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root package.json with scripts
└── README.md        # Main documentation
```

## Scripts

- `npm run dev` - Start both frontend and backend
- `npm run server` - Start only the backend
- `npm run client` - Start only the frontend
- `npm run install-all` - Install dependencies for both frontend and backend
- `npm run build` - Build the frontend for production

