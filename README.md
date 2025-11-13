# InnovateHer - Hackathon Dashboard

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing hackathon projects and assigning judges to them. Features a modern drag-and-drop interface for intuitive judge assignment.

## 🚀 Features

- 📋 View and manage projects with details (name, category, description)
- 👥 Manage judges with specialties
- 🎯 Drag and drop judges to assign them to projects
- 👤 Click on judges to view their profiles
- 📊 Real-time judge count updates
- 🎨 Modern, responsive UI with Tailwind CSS
- 💾 MongoDB database for persistent data storage
- 🔄 RESTful API with Express.js

## 📁 Project Structure

```
InnovateHer/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
├── server/                # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── scripts/          # Seed script
│   ├── server.js         # Server entry point
│   └── package.json
└── package.json          # Root package.json
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **@dnd-kit** - Drag and drop functionality
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <https://github.com/lalitboyapati/innovateher>
   cd InnovateHer
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install server and client dependencies
   npm run install-all
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/innovateher
   ```

   For MongoDB Atlas, use:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/innovateher
   ```

4. **Start MongoDB**

   If using local MongoDB:
   ```bash
   # macOS (using Homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod

   # Windows
   net start MongoDB
   ```

5. **Seed the database (optional)**
   ```bash
   cd server
   npm run seed
   ```

6. **Run the application**

   Start both server and client concurrently:
   ```bash
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run client
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🗄️ Database Schema

### Project Model
```javascript
{
  name: String,
  category: String,
  description: String,
  assignedJudges: [ObjectId], // References to Judge documents
  createdAt: Date,
  updatedAt: Date
}
```

### Judge Model
```javascript
{
  name: String,
  initials: String,
  specialty: String,
  assignedToProjectId: ObjectId, // Reference to Project document
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a single project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `POST /api/projects/:id/judges/:judgeId` - Assign judge to project
- `DELETE /api/projects/:id/judges/:judgeId` - Remove judge from project

### Judges
- `GET /api/judges` - Get all judges
- `GET /api/judges/unassigned` - Get unassigned judges
- `GET /api/judges/:id` - Get a single judge
- `POST /api/judges` - Create a new judge
- `PUT /api/judges/:id` - Update a judge
- `DELETE /api/judges/:id` - Delete a judge

### Health Check
- `GET /api/health` - Server health check

## 🎯 Usage

### Assigning Judges

1. Drag a judge from the "Unassigned Judges" panel
2. Drop it onto a project card
3. The judge will be automatically assigned to that project
4. The UI will update in real-time

### Viewing Judge Profiles

- Click on any judge card to view their profile information

## 🚀 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible (MongoDB Atlas recommended)
3. Deploy to platforms like Heroku, Railway, or Render

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Deploy the `dist` folder to platforms like:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront

3. Update the API URL in production environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
## 📞 Support

For issues and questions, please open an issue on the repository.
