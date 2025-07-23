# ChatApp 💬

A modern full-stack chat application with JWT authentication and real-time features.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC)

## ✨ Features

- 🔐 **JWT Authentication** - Secure login/register system
- 🛡️ **Password Strength Checker** - Real-time validation with visual feedback
- 🚪 **Protected Routes** - Session persistence across page refreshes
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔄 **Auto-refresh tokens** - Seamless user experience

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation  
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js & Express.js**
- **Prisma ORM** with PostgreSQL
- **JWT** authentication
- **bcrypt** for password hashing
- **CORS** enabled

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Nileshkr19/ChatApp.git
cd ChatApp
```

2. **Backend Setup**
```bash
cd server
npm install
cp .env.example .env
# Configure your DATABASE_URL and JWT secrets
npx prisma migrate dev
npm run dev
```

3. **Frontend Setup**
```bash
cd ../client
npm install
npm run dev
```

4. **Open your browser**
```
Frontend: http://localhost:5173
Backend: http://localhost:8000
```

## 📂 Project Structure

```
ChatApp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context
│   │   ├── routes/         # Route configuration
│   │   └── services/       # API services
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Custom middleware
│   │   ├── routes/         # API routes
│   │   └── config/         # Configuration
│   ├── prisma/             # Database schema
│   └── package.json
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/chatapp"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=8000
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nilesh Kumar**
- GitHub: [@Nileshkr19](https://github.com/Nileshkr19)

---

⭐ Star this repository if you found it helpful!
