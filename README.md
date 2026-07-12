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

### Seed Catalog Products Into MongoDB
```bash
cd backend
npm run seed:products
# Creates missing built-in catalog products without overwriting admin edits
```

To refresh built-in catalog product data and overwrite matching slugs:
```bash
npm run seed:products:force
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

# WhatsApp Business Cloud API notifications
WHATSAPP_ACCESS_TOKEN=your_meta_cloud_api_access_token
WHATSAPP_PHONE_NUMBER_ID=your_meta_phone_number_id
WHATSAPP_GRAPH_VERSION=v23.0
WHATSAPP_ADMIN_NUMBER=94725737391

# Optional local switch
BYPASS_WHATSAPP_NOTIFICATION=false

# Optional, recommended for production business-initiated notifications.
# Template body variables:
# {{1}} customer name, {{2}} email, {{3}} phone, {{4}} product,
# {{5}} message, {{6}} submitted time.
WHATSAPP_TEMPLATE_NAME=new_inquiry_notification
WHATSAPP_TEMPLATE_LANGUAGE=en_US
```

WhatsApp credentials must be configured only in the backend environment, such as
`backend/.env` locally or Render/Vercel backend environment variables in
production. Do not add `WHATSAPP_ACCESS_TOKEN` or `WHATSAPP_PHONE_NUMBER_ID` to
`frontend/.env`.

For development, use the temporary access token and test phone number ID from the
Meta developer dashboard. For production, create a permanent system-user token,
connect the live WhatsApp phone number, and use an approved WhatsApp message
template by setting `WHATSAPP_TEMPLATE_NAME`.

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
