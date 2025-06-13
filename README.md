# 🎵 Spotify Microservice Project

A microservices-based clone of Spotify built to understand production-level architecture, service separation, and cloud deployment. This project includes user authentication, song/album management, and song playback, all managed via independent services and deployed on AWS EC2.

---

## 📁 Folder Structure
├── admin service # Admin functionalities: add/delete albums & songs

├── user service # User registration, login, playlist management

├── song service # Song/album fetch & playback operations

├── frontend # React + Vite + TypeScript frontend


---

## ⚙️ Tech Stack

### 🖥️ Frontend:
- React
- Vite
- TypeScript
- Axios

### 🧠 Backend (for each service):
- Node.js
- Express.js
- MongoDB (for user service)
- PostgreSQL (for admin & song services)
- Multer + Cloudinary (for image/audio storage)
- Redis (for caching and performance optimization)
- JWT (for secure authentication)

### ☁️ Deployment:
- **AWS EC2** (All services hosted on a single instance due to free-tier limits)

---

## 🧩 Microservices Overview

### 1. **User Service** (`PORT: 5000`)
- Handles user registration, login, authentication
- Stores user data in **MongoDB**
- Generates JWT tokens for secure sessions

### 2. **Admin Service** (`PORT: 7000`)
- Allows creation/deletion of songs and albums
- Uses **PostgreSQL** for structured data storage
- Uses **Cloudinary** for media uploads

### 3. **Song Service** (`PORT: 8000`)
- Fetches all songs and albums
- Handles song playback APIs
- Uses **PostgreSQL** and integrates with Redis for caching

---

## 🛡️ Environment Variables

Each service contains a `.env` file with variables like:

### 🌐 Common Keys

```env
PORT=
DB_URL=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD= 

```

🚀 How to Run Locally
1. Clone the Repository
```
git clone https://github.com/pavan77749/Spotify-Microservice-Project.git
cd Spotify-Microservice-Project

```
3. Install Dependencies
Go into each folder (user service, admin service, song service, frontend) and run:

Setup .env files

4. Run Services
Create .env files inside each service folder and add respective variables as shown above.
# In each folder (user/admin/song)
```
npm run dev
```

5. Run Frontend
```
cd frontend
npm run dev
```

🎯 Motivation Behind the Project
The main goal behind building this Spotify clone was to:

Understand microservices architecture

Learn how different services communicate and stay decoupled

Gain hands-on experience with deployment on AWS EC2

Explore caching with Redis, JWT authentication, and media storage with Cloudinary

📬 Feedback
I'd love to hear your thoughts and suggestions! If you have ideas to improve this project, feel free to raise an issue or open a PR.
