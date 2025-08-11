# Digital Ganesha - Spiritual Community Platform

A modern web application built with React and Vite that serves as a spiritual community platform dedicated to Lord Ganesha devotees. The platform provides a beautiful and interactive space for users to connect, participate in spiritual activities, and access resources related to Ganesha worship.

## ✨ Features

- **Beautiful UI/UX**: Modern design with spiritual Ganesha-themed aesthetics
- **User Authentication**: Secure signup/login with email and Google OAuth integration
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Community Features**: Connect with fellow devotees and spiritual seekers
- **Database Integration**: MongoDB backend for user management and data persistence
- **Real-time Features**: Socket.IO integration for live interactions

## 🛠️ Tech Stack

**Frontend:**
- React 19.1.1
- Vite 7.1.0
- Tailwind CSS 4.1.11
- React Router DOM

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Socket.IO for real-time features

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ULTRAPAIN/Digital-Ganesha.git
cd Digital-Ganesha
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Set up environment variables:
```bash
# Copy .env.example to .env and update with your values
cp .env.example .env
```

5. Start the development servers:
```bash
# Frontend (from root directory)
npm run dev

# Backend (from backend directory)
npm start
```

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:5173`
6. Update `VITE_GOOGLE_CLIENT_ID` in your `.env` file

### Environment Variables
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Digital Ganesha
```

## 📱 Pages & Features

- **Landing Page**: Beautiful hero section with spiritual design elements
- **Authentication**: Modern signup/login pages with Google OAuth
- **User Dashboard**: Personalized experience for devotees
- **Community Features**: Connect with other users
- **Responsive Design**: Works seamlessly on all devices

## 🙏 Spiritual Elements

The application incorporates authentic Hindu spiritual elements:
- Sanskrit mantras and blessings
- Traditional Ganesha iconography
- Sacred geometry patterns
- Devotional color schemes (orange, red, amber)
- Cultural authenticity in design and content

## 🤝 Contributing

We welcome contributions from the community! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🕉️ Dedication

*गणपति बप्पा मोरया* - This project is dedicated to Lord Ganesha, the remover of obstacles and patron of arts and sciences.

---

**May Lord Ganesha bless this digital platform and all who use it in their spiritual journey.**
