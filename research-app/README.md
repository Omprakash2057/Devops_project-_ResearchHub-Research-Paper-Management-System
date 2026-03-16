# ResearchHub — Research Paper Management App

A full-stack Express.js + MongoDB web application for managing research papers with authentication, CRUD, user management, and charts.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Auth**: express-session + connect-mongo + bcryptjs
- **Views**: EJS templating
- **File Upload**: Multer (PDF + profile images)
- **Charts**: Chart.js (CDN)
- **Other**: method-override, express-flash, dotenv

---

## Project Structure

```
research-app/
├── config/
│   ├── db.js              # MongoDB connection
│   └── session.js         # Session config
├── controllers/
│   ├── authController.js
│   ├── dashboardController.js
│   ├── paperController.js
│   ├── userController.js
│   └── profileController.js
├── middleware/
│   ├── auth.js            # isAuthenticated, isAdmin, isGuest
│   └── multer.js          # PDF + image upload config
├── models/
│   ├── User.js
│   └── Paper.js
├── routes/
│   ├── auth.js
│   ├── dashboard.js
│   ├── papers.js
│   ├── users.js
│   └── profile.js
├── views/
│   ├── auth/              # login.ejs, register.ejs
│   ├── dashboard/         # index.ejs
│   ├── papers/            # index, create, edit, show
│   ├── users/             # index, edit
│   ├── profile/           # index.ejs
│   ├── layout-top.ejs
│   ├── layout-bottom.ejs
│   ├── 404.ejs
│   └── 500.ejs
├── public/
│   ├── css/style.css
│   └── uploads/           # PDF files + profile images
├── .env.example
├── .gitignore
├── app.js
└── package.json
```

---

## Local Setup

### 1. Clone / Download the project

```bash
git clone https://github.com/yourusername/research-app.git
cd research-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/research_db?retryWrites=true&w=majority
SESSION_SECRET=your_super_secret_key_here
NODE_ENV=development
```

### 4. Set up MongoDB Atlas

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster (M0 Sandbox)
3. Create a database user under **Security > Database Access**
4. Whitelist your IP under **Security > Network Access** (or allow all: `0.0.0.0/0`)
5. Click **Connect > Connect your application** and copy the connection string
6. Replace `<username>`, `<password>`, and cluster URL in your `.env`

### 5. Run the app

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## Features

| Feature | Description |
|---|---|
| 🔐 Auth | Register, login, logout with session management |
| 🏠 Dashboard | Stats cards + Bar chart (monthly) + Pie chart (categories) |
| 📄 Papers | Upload PDF, view, edit metadata, delete, search & filter |
| 👥 Users | Admin-only: view all users, change roles, delete accounts |
| 👤 Profile | Edit name/email/avatar, change password, account stats |

---

## GitHub Upload Instructions

```bash
# 1. Initialize repo
git init
git add .
git commit -m "Initial commit — ResearchHub app"

# 2. Create repo on GitHub, then add remote
git remote add origin https://github.com/yourusername/research-app.git

# 3. Push
git branch -M main
git push -u origin main
```

---

## Sample .gitignore

```
node_modules/
.env
public/uploads/
*.log
.DS_Store
```

---

## Default Routes

| Route | Method | Access | Description |
|---|---|---|---|
| `/auth/login` | GET/POST | Guest | Login page |
| `/auth/register` | GET/POST | Guest | Register page |
| `/auth/logout` | GET | Auth | Logout |
| `/dashboard` | GET | Auth | Dashboard |
| `/papers` | GET | Auth | List papers |
| `/papers/create` | GET/POST | Auth | Upload paper |
| `/papers/:id` | GET | Auth | View paper |
| `/papers/:id/edit` | GET/PUT | Auth | Edit paper |
| `/papers/:id` | DELETE | Auth | Delete paper |
| `/users` | GET | Admin | User list |
| `/users/:id/edit` | GET/PUT | Admin | Edit role |
| `/users/:id` | DELETE | Admin | Delete user |
| `/profile` | GET | Auth | View profile |
| `/profile/update` | POST | Auth | Update profile |
| `/profile/change-password` | POST | Auth | Change password |
