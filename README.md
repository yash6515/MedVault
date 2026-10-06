# 🏥 MedVault

**MedVault** is a full-stack medical history management web application designed to help users securely manage, organize, and access their medical information in one place.

The platform provides a centralized system for storing medical records and makes it easier for users to keep track of their healthcare history.

---

## 🚀 Features

- 👤 **User Authentication**
  - User registration and login
  - Secure authentication
  - Protected user routes

- 📋 **Medical History Management**
  - Add medical records
  - View medical history
  - Update existing records
  - Delete records

- 🏥 **Patient Information**
  - Store important personal and medical information
  - Maintain organized healthcare records

- 🔐 **Secure Data Management**
  - User-specific medical information
  - Protected API endpoints
  - Environment variables for sensitive configuration

- 📱 **Responsive Design**
  - Mobile-friendly interface
  - Responsive layouts for desktop, tablet, and mobile devices

- ⚡ **REST API**
  - Backend REST APIs built with Node.js and Express
  - MongoDB database integration

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Context API
- Axios

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- MongoDB Atlas

### Development Tools
- Git & GitHub
- VS Code
- Postman

---

## 📂 Project Structure

```text
MedVault/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/medvault.git
cd medvault
```

---

### 2. Setup Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

### 3. Setup Frontend

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will typically run on:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

The backend requires environment variables for database and authentication configuration.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

> ⚠️ **Important:** Never commit your `.env` file or API keys to GitHub.

Add this to `.gitignore`:

```gitignore
.env
node_modules/
```

---

## 🔄 Application Flow

```text
User
  │
  ▼
React Frontend
  │
  │ Axios / HTTP Requests
  ▼
Express REST API
  │
  ▼
Authentication Middleware
  │
  ▼
Controllers
  │
  ▼
MongoDB Atlas
```

---

## 📡 API Structure

The application follows a RESTful API architecture.

Example endpoints:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/medical-records` | Get medical records |
| POST | `/api/medical-records` | Add medical record |
| PUT | `/api/medical-records/:id` | Update medical record |
| DELETE | `/api/medical-records/:id` | Delete medical record |

*The exact endpoints may vary depending on the current implementation.*

---

## 🗄️ Database

MedVault uses **MongoDB Atlas** for storing application data.

Typical data entities include:

```text
Users
  │
  ├── Personal Information
  ├── Authentication Information
  └── Medical Records
          │
          ├── Diagnosis
          ├── Doctor Information
          ├── Medical History
          ├── Prescription
          └── Date
```

---

## 🔐 Security

MedVault is designed with security in mind.

- Authentication for protected resources
- User-specific medical records
- Protected backend routes
- Environment variables for secrets
- MongoDB Atlas for database management
- `.env` excluded from version control

> **Note:** MedVault is an academic/software project and should not be considered a replacement for professional medical record systems or healthcare providers.

---

## 🎯 Project Objectives

The main objectives of MedVault are to:

1. Create a centralized platform for managing medical history.
2. Provide users with easy access to their medical information.
3. Implement secure authentication and authorization.
4. Build a RESTful backend using Node.js and Express.
5. Store and manage data using MongoDB.
6. Create a responsive and user-friendly React interface.
7. Demonstrate full-stack web development concepts.

---

## 📸 Screenshots

Add screenshots of your application here:

```text
screenshots/
├── login.png
├── dashboard.png
├── medical-history.png
├── add-record.png
└── profile.png
```

Example:

```markdown
![Login Page](./screenshots/login.png)
```

---

## 🌐 Deployment

The project can be deployed using:

**Frontend**
- Vercel

**Backend**
- Render / Railway

**Database**
- MongoDB Atlas

---

## 🔮 Future Improvements

- 📄 Upload and store medical documents
- 📊 Medical history analytics
- 💊 Prescription management
- 🔔 Medication reminders
- 🩺 Doctor/Healthcare provider accounts
- 📱 Dedicated mobile application
- 🔐 Two-factor authentication
- 📑 Generate downloadable medical reports
- 🤖 AI-assisted medical record summarization

---

## 👨‍💻 Author

**Yash Agarwal**

B.Tech – Full Stack Development  
Bennett University

---

## ⭐ Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add new feature"
```

5. Push the branch

```bash
git push origin feature/your-feature
```

6. Open a Pull Request

---

## 📄 License

This project is developed for educational and portfolio purposes.
