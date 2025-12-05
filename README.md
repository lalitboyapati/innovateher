# InnovateHer - Hackathon Management Platform

A comprehensive full-stack MERN (MongoDB, Express, React, Node.js) application for managing hackathons, projects, judges, and scoring. Features role-based access control with dedicated portals for participants, judges, and administrators.

## 🚀 Features

### 🎯 Core Functionality
- **Multi-Role System**: Separate portals for Participants, Judges, and Admins
- **Project Submission**: Participants can submit projects with GitHub links and descriptions
- **Judge Scoring**: Rubric-based scoring system with comments and feedback
- **Auto-Assignment**: Intelligent automatic assignment of judges to projects based on specialty matching
- **Admin Dashboard**: Comprehensive management interface for projects, users, and assignments
- **User Management**: Create and manage users (admins, judges, participants) with role-based permissions
- **Hackathon Management**: Support for multiple hackathons with default "InnovateHer" hackathon
- **Real-time Updates**: Live updates across all dashboards

### 👥 Role-Based Features

#### Participant Portal
- Submit projects with name, category, description, and GitHub URL
- View submission confirmation
- Access to participant dashboard

#### Judge Portal
- View assigned projects automatically
- Score projects using dynamic rubric criteria
- Submit scores and feedback comments
- Auto-assignment of projects on login
- View scoring history

#### Admin Portal
- **Projects Tab**: View all projects, manage judge assignments, auto-assign judges
- **Judges Tab**: View all judges with specialties and initials
- **Scores Tab**: View all project scores with judge details and averages
- **Comments Tab**: View all judge feedback and comments per project
- **Rubric Tab**: Configure and manage global scoring rubric
- **User Management**: Create, edit, and delete users (admins, judges, participants)
- Manual judge assignment override
- Bulk auto-assignment for unassigned projects

### 🎨 User Interface
- Modern, responsive design with Tailwind CSS
- Beautiful landing page with role selection cards
- Intuitive navigation and role-based routing
- Real-time feedback and loading states
- Confetti celebrations on project submission

## 📁 Project Structure

```
InnovateHer/
├── client/                      # React frontend (Vite)
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── JudgeDashboard.tsx
│   │   │   ├── ParticipantDashboard.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── ...
│   │   ├── contexts/            # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── services/           # API service layer
│   │   │   └── api.ts
│   │   ├── types/              # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx             # Main app component with routing
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Express backend
│   ├── models/                 # MongoDB models
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Hackathon.js
│   │   ├── Score.js
│   │   ├── RubricConfig.js
│   │   └── ...
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── judges.js
│   │   ├── scores.js
│   │   ├── rubric.js
│   │   ├── assignments.js
│   │   ├── admin.js
│   │   └── ...
│   ├── middleware/             # Express middleware
│   │   └── auth.js
│   ├── utils/                  # Utility functions
│   │   ├── autoAssign.js
│   │   ├── autoAssignJudges.js
│   │   └── ...
│   ├── scripts/                # Utility scripts
│   │   ├── create-admin.js
│   │   ├── clear-data.js
│   │   ├── seed.js
│   │   └── ...
│   ├── server.js               # Server entry point
│   └── package.json
├── ADMIN_SETUP.md              # Admin setup guide
├── SETUP.md                    # Detailed setup instructions
└── README.md                   # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Canvas Confetti** - Celebration animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
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
   git clone https://github.com/lalitboyapati/innovateher.git
   cd InnovateHer
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/innovateher
   JWT_SECRET=your-secret-key-here
   ```

   For MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/innovateher
   JWT_SECRET=your-secret-key-here
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

5. **Create the master admin account**
   ```bash
   cd server
   npm run create-admin
   ```
   
   This creates an admin with:
   - Email: `admin@innovateher.com`
   - Password: `admin123`
   
   See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for more details.

6. **Run the application**

   Start both server and client:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173 (Vite default port)
   - Backend API: http://localhost:5000

## 🗄️ Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String,
  lastName: String,
  role: 'admin' | 'judge' | 'participant',
  specialty: String (for judges),
  initials: String (auto-generated for judges),
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  name: String (required),
  category: String (required),
  description: String (required),
  githubUrl: String,
  hackathonId: ObjectId (ref: Hackathon),
  createdBy: ObjectId (ref: User),
  assignedJudges: [ObjectId] (ref: User),
  status: 'draft' | 'submitted' | 'under_review' | 'judged',
  createdAt: Date,
  updatedAt: Date
}
```

### Score Model
```javascript
{
  projectId: ObjectId (ref: Project),
  judgeId: ObjectId (ref: User),
  rubricScores: Object (dynamic based on rubric),
  totalScore: Number,
  feedback: String,
  sentimentScore: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### RubricConfig Model
```javascript
{
  criteria: Object (key-value pairs of criteria and weights),
  maxJudgesPerProject: Number,
  minJudgesPerProject: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects (supports `judgeId` query param)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Judges
- `GET /api/judges` - Get all judges
- `GET /api/judges/unassigned` - Get unassigned judges
- `GET /api/judges/:id` - Get single judge

### Scores
- `POST /api/scores` - Submit score for project
- `GET /api/scores/project/:projectId` - Get all scores for a project
- `GET /api/scores/my-scores` - Get logged-in judge's scores
- `GET /api/scores/judge/:judgeId` - Get scores by judge
- `GET /api/scores/leaderboard` - Get leaderboard

### Rubric
- `GET /api/rubric` - Get global rubric
- `PUT /api/rubric/global` - Update global rubric (admin only)
- `GET /api/rubric/track/:trackId` - Get track-specific rubric

### Assignments
- `POST /api/assignments/auto-assign` - Auto-assign judges to unassigned projects
- `GET /api/assignments/stats` - Get assignment statistics

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/admins` - Create admin (admin only)
- `PUT /api/admin/users/:id` - Update user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

### Hackathons
- `GET /api/hackathons` - Get all hackathons
- `GET /api/hackathons/:id` - Get single hackathon
- `POST /api/hackathons` - Create hackathon
- `PUT /api/hackathons/:id` - Update hackathon

## 🎯 Usage Guide

### For Participants
1. Navigate to the landing page
2. Click on "Participant" card
3. Register or login
4. Submit your project with details and GitHub URL
5. View confirmation screen

### For Judges
1. Navigate to the landing page
2. Click on "Judge" card
3. Register or login (judges can create their own accounts)
4. View automatically assigned projects
5. Score projects using the rubric
6. Submit scores and feedback comments

### For Admins
1. Navigate to the landing page
2. Click on "Admin" card
3. Login with admin credentials
4. Access admin dashboard with multiple tabs:
   - **Projects**: View/manage projects and judge assignments
   - **Judges**: View all judges
   - **Scores**: View all project scores
   - **Comments**: View all judge feedback
   - **Rubric**: Configure scoring rubric
   - **User Management**: Create/manage users

## 🛠️ Utility Scripts

### Create Admin Account
```bash
cd server
npm run create-admin
# Or with custom credentials:
npm run create-admin <email> <password> <firstName> <lastName>
```

### Clear All Data (Preserves Admins)
```bash
cd server
npm run clear-data
```
This removes all judges, participants, projects, and scores while keeping admin accounts.

### Seed Database (Optional)
```bash
cd server
npm run seed
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible (MongoDB Atlas recommended)
3. Deploy to platforms like Heroku, Railway, or Render
4. Update CORS settings to allow your frontend domain

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

3. Update the API URL in production:
   - Set `VITE_API_URL` environment variable to your backend URL
   - Or update `api.ts` to use the production API URL

## 🔒 Security Features
- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Protected API routes with middleware
- Secure token storage in localStorage
- CORS configuration

## 📚 Additional Documentation
- [ADMIN_SETUP.md](./ADMIN_SETUP.md) - Detailed admin setup guide
- [SETUP.md](./SETUP.md) - Comprehensive setup instructions

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support
For issues and questions, please open an issue on the [GitHub repository](https://github.com/lalitboyapati/innovateher).

## 📝 License
This project is open source and available under the MIT License.
