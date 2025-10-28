# 🎬 Favorite Movies & TV Shows Web Application
A full-stack web application that allows users to manage their favorite movies and TV shows with infinite scrolling, CRUD operations, and a modern responsive UI.

## Live Demo
```
Frontend: http://localhost:5173

Backend: http://localhost:5000
```

Features
Core Features
✅ Add new movie/TV show entries

✅ View all entries in an infinite scrolling table

✅ Edit existing entries

✅ Delete entries with confirmation

✅ Responsive design with TailwindCSS

Technical Features

✅ React + TypeScript + Vite frontend

✅ Node.js + Express backend

✅ MySQL database with Prisma ORM

✅ Infinite scroll pagination

✅ RESTful API architecture

✅ Type-safe development

 ## Technology Stack
Frontend
React 18 with TypeScript

Vite for build tooling

TailwindCSS for styling

Functional components with React Hooks

## Backend
Node.js with Express

MySQL database

Prisma ORM for database operations

CORS enabled for frontend communication
```
 Project Structure
text
favorite-movies-app/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API service layer
│   │   └── App.tsx          # Main application component
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Node.js + Express backend
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env                 # Environment variables
└── README.md
```
## Database Schema
```
prisma
model Entry {
  id        Int      @id @default(autoincrement())
  title     String
  type      String
  director  String
  budget    String
  location  String
  duration  String
  yearTime  String
  createdAt DateTime @default(now())
}
```
 Quick Start
Prerequisites
Node.js (v16 or higher)

MySQL Server

Git

1. Clone and Setup
bash
### Clone the repository
git clone <your-repo-url>
cd favorite-movies-app
2. Backend Setup
bash
cd backend

### Install dependencies
npm install

### Set up environment variables
### Create .env file with:
DATABASE_URL="mysql://root:yourpassword@localhost:3306/favorite_movies"

### Generate Prisma client
npx prisma generate

### Push schema to database
npx prisma db push

### Start the backend server
npm run dev
Backend will run on http://localhost:5000

## 3. Frontend Setup
bash
cd frontend

### Install dependencies
npm install

### Start the development server
npm run dev
Frontend will run on http://localhost:5173

## 4. Verify Setup
Test the backend API:


## Test health endpoint
```
curl http://localhost:5000/api/health
```

## Test entries endpoint
```
curl http://localhost:5000/api/entries
🎯 API Endpoints
Method	Endpoint	Description
GET	/api/health	#Health check
GET	/api/entries	#Get entries with pagination
POST	/api/entries	#Create new entry
PUT	/api/entries/:id	#Update entry
DELETE	/api/entries/:id	#Delete entry
```
Example API Usage
Create a new entry:
```
curl -X POST http://localhost:5000/api/entries \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "type": "Movie",
    "director": "Christopher Nolan",
    "budget": "$160M",
    "location": "LA, Paris",
    "duration": "148 min",
    "yearTime": "2010"
  }'
```
Get entries with pagination:

```
curl "http://localhost:5000/api/entries?page=1&limit=10"
```
📊 Sample Data
Here are some sample entries you can add:

Movies
```
json
{
  "title": "Inception",
  "type": "Movie", 
  "director": "Christopher Nolan",
  "budget": "$160M",
  "location": "LA, Paris",
  "duration": "148 min",
  "yearTime": "2010"
}
```
```
json
{
  "title": "The Dark Knight",
  "type": "Movie",
  "director": "Christopher Nolan", 
  "budget": "$185M",
  "location": "Chicago, Hong Kong",
  "duration": "152 min",
  "yearTime": "2008"
}
```
TV Shows
```
json
{
  "title": "Breaking Bad",
  "type": "TV Show",
  "director": "Vince Gilligan",
  "budget": "$3M/episode",
  "location": "Albuquerque", 
  "duration": "49 min/episode",
  "yearTime": "2008-2013"
}
```
```
json
{
  "title": "K.G.F: Chapter 1",
  "type": "Movie",
  "director": "Prashanth Neel",
  "budget": "₹80 crore",
  "location": "India",
  "duration": "2h 36m", 
  "yearTime": "2018",
  "posterUrl": "https://m.media-amazon.com/images/M/MV5BZDNlNzBjMGUtYTA0Yy00OTI2LWJmZjMtM2M1M2ZmY2U4NjlmXkEyXkFqcGdeQXVyMTI1NDEyNTM5._V1_.jpg"
}
```
 UI Components
Main Features
Entries Table: Displays all movies/TV shows with infinite scroll

Add/Edit Form: Modal form for creating and updating entries

Responsive Design: Works on desktop and mobile devices

Loading States: Smooth loading indicators for better UX

Table Layout
Title	Type	Director	Budget	Location	Duration	Year/Time	Actions
Inception	Movie	Nolan	$160M	LA, Paris	148 min	2010	Edit/Delete
🔧 Development Scripts
Backend
```
npm start          # Start production server
npm run dev        # Start development server with watch mode
npx prisma generate # Generate Prisma client
npx prisma db push # Push schema to database
Frontend
bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```
 Troubleshooting
Common Issues
Database Connection Error

Verify MySQL is running

Check DATABASE_URL in .env file

Ensure database favorite_movies exists

CORS Errors

Backend has CORS enabled for all origins

Verify frontend is running on port 5173

TypeScript Import Errors

Use import type for types/interfaces

Regular import for values/functions

Port Already in Use

Backend: Change PORT in .env or use different port

Frontend: Vite will prompt to use different port

Verification Steps
Backend Health Check
```
curl http://localhost:5000/api/health
# Should return: {"message":"Backend is running!","timestamp":"..."}
```
Database Test
```
cd backend
node test-db.js
```
### Should show: ✅ Database connected successfully!
## Frontend Build
```
cd frontend  
npm run build
```
 Should complete without errors
 Deployment
Frontend (Vercel)
Build command: npm run build

Output directory: dist

Backend (Railway/Render)
Set environment variables

Run database migrations: npx prisma db push

Start command: npm start
