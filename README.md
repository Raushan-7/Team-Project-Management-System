# Team Project Management System

A full-stack web application for managing projects and tasks collaboratively. Built with React, Express.js, and MongoDB. Includes Docker, Kubernetes, and deployment-ready configurations.

## 📋 Features

- **User Authentication**: Register, login with JWT tokens
- **Project Management**: Create, read, update, delete projects
- **Task Management**: Create tasks within projects and track progress
- **Role-Based Access**: Manager and Member roles
- **Responsive UI**: Built with React and Tailwind CSS
- **Dark Mode Support**: Toggle between light and dark themes
- **Real-time Updates**: Instant project and task list updates

## 🛠️ Tech Stack

### Frontend

- React 18.2.0
- React Router DOM 6.16.0
- Tailwind CSS 3.3.3
- Vite 4.4.5
- Axios 1.5.0

### Backend

- Node.js 18
- Express.js 4.18.2
- MongoDB with Mongoose 7.5.0
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

### Database

- MongoDB Atlas (Cloud Database)

### DevOps

- Docker & Docker Compose
- Kubernetes manifests

## 📁 Project Structure

```
Project to do app/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Authentication & authorization
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── server.js        # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main app component
│   │   └── index.css    # Styles
│   ├── vite.config.js
│   └── package.json
├── k8s/                 # Kubernetes configurations
├── docker-compose.yml   # Docker Compose setup
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Local Development (NPM)

1. **Backend Setup**:

   ```bash
   cd backend
   npm install
   ```

2. **Frontend Setup**:

   ```bash
   cd frontend
   npm install
   ```

3. **Environment Variables**:
   Create `.env` file in `backend` folder:

   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project_management
   JWT_SECRET=your-secret-key-here
   ```

4. **Run Backend** (Terminal 1):

   ```bash
   cd backend
   npm run dev
   ```

   Backend runs on: `http://localhost:5000`

5. **Run Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

## 🐳 Docker Compose (Containerized Local Dev)

Run the entire application with Docker:

```bash
docker-compose up --build
```

Services:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **MongoDB**: localhost:27017
- **MongoDB Data**: Persisted in `mongodb_data` volume

Stop services:

```bash
docker-compose down
```

## ☸️ Kubernetes (Minikube)

Deploy locally using Kubernetes:

1. **Start Minikube**:

   ```bash
   minikube start
   ```

2. **Apply Manifests**:

   ```bash
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/backend-service.yaml
   kubectl apply -f k8s/frontend-deployment.yaml
   kubectl apply -f k8s/frontend-service.yaml
   ```

3. **Access Services**:
   ```bash
   minikube service frontend-service
   minikube service backend-service
   ```

_(Note: Update image names in manifests to match your Docker registry)_

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/users` - Get all users (protected)

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks

- `GET /api/projects/:projectId/tasks` - Get tasks for project
- `POST /api/projects/:projectId/tasks` - Create new task
- `PUT /api/projects/:projectId/tasks/:taskId` - Update task
- `DELETE /api/projects/:projectId/tasks/:taskId` - Delete task

## 🔐 Authentication Flow

1. User registers or logs in
2. Server returns JWT token
3. Token stored in browser localStorage
4. Token sent in API requests: `Authorization: Bearer <token>`
5. Server validates token for protected routes

## 👥 User Roles

- **Manager**: Can create and manage projects
- **Member**: Can view projects and work on tasks

## 🚀 Deployment on Render

### Prerequisites

- GitHub account with repository
- Render account
- MongoDB Atlas account

### Deployment Steps

1. **Push to GitHub**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy Backend on Render**:
   - Create new Web Service
   - Connect GitHub repository
   - Set environment variables:
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Your secret key
     - `PORT`: 5000
   - Build command: `npm install`
   - Start command: `npm run dev`

3. **Deploy Frontend on Render**:
   - Create new Static Site
   - Connect GitHub repository
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Update frontend API URL to Render backend URL

## 📝 Environment Variables

Create `.env` file in `backend` folder:

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project_management
JWT_SECRET=your-secret-key-here
```

## 🔄 Build & Production

### Frontend Build

```bash
cd frontend
npm run build
```

Output: `frontend/dist/`

### Docker Production Build

```bash
docker-compose -f docker-compose.yml up -d
```

## 🐛 Troubleshooting

### MongoDB Connection Error

- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas dashboard
- Ensure `.env` has correct `MONGO_URI`

### Frontend Can't Connect to Backend

- Verify backend is running on port 5000
- Check CORS in `backend/server.js`
- Update API URL for production

### CORS Issues

- Backend has CORS middleware enabled
- Ensure frontend origin is allowed

## 📚 Learning Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [JWT Introduction](https://jwt.io/)
- [Render Deployment Guide](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com/)

## 📄 License

College project for learning full-stack web development.

## 👨‍💼 Author

Created as a college project.

---

**Status**: Development/Ready for Deployment ✅

For questions or issues, please create an issue in the repository or refer to the documentation.

3. Access Frontend:
   ```bash
   minikube service frontend-service
   ```
