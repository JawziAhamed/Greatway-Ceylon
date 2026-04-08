# Greatway Import and Exports — MERN Stack Website

A professional, full-stack business website for Greatway Import and Exports, a Sri Lankan premium produce exporter to the UAE.

## 🏗️ Project Structure

```
greatway-export/
├── frontend/          # React + Vite + Tailwind v4
└── backend/           # Node.js + Express + MongoDB
```

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/greatway-exports
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

## 🛠️ Tech Stack

| Layer        | Technology            |
|--------------|-----------------------|
| Frontend     | React 19, Vite 7      |
| Styling      | Tailwind CSS v4       |
| Icons        | Lucide React          |
| Backend      | Node.js, Express 5    |
| Database     | MongoDB + Mongoose    |
| Auth         | JWT + bcryptjs        |

## 📄 Pages

| Route                | Page             |
|----------------------|------------------|
| `/`                  | Home             |
| `/about`             | About Us         |
| `/products`          | Product Catalog  |
| `/contact`           | Contact & Inquiry|
| `/admin/login`       | Admin Login      |
| `/admin/dashboard`   | Admin Dashboard  |

## 🔑 Admin Access

Default credentials: `admin / admin123`
> Change after first login for security.

## 🌐 Deployment

- **Frontend**: Deploy `/frontend` to Vercel or Netlify
- **Backend**: Deploy `/backend` to Render or Railway
- **Database**: Use MongoDB Atlas (update `MONGO_URI` in backend `.env`)
