# 💰 Bucks & Balance

**Your Personal Finance Companion**

A modern, full-stack personal finance application built with React Native and Node.js, featuring beautiful glassmorphism design and smooth animations.

## 🚀 Features

### 📱 Frontend (React Native + Expo)
- **Beautiful Login Screen** with glassmorphism design effects
- **Smooth Animations** using React Native Reanimated
- **Dark Forest Green Theme** (#013220 background, #00A86B primary)
- **Login/Register Toggle** with form validation
- **Responsive Design** that works on all device sizes
- **Real-time Backend Integration** with secure API calls

### 🔧 Backend (Node.js + Express)
- **RESTful API** with JWT authentication
- **PostgreSQL Database** for secure data storage
- **User Management** (registration, login, profile)
- **Expense Tracking** with categories
- **CORS Enabled** for frontend integration
- **Secure Password Hashing** with bcrypt

## 🛠️ Tech Stack

### Frontend
- **React Native** with Expo Router (~5.1.4)
- **React Native Reanimated** (~3.17.4) for animations
- **TypeScript** for type safety
- **Expo Vector Icons** for beautiful icons
- **Custom Glassmorphism Components**

### Backend
- **Node.js** with Express framework
- **PostgreSQL** database
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

## 📁 Project Structure

```
Bucks-And-Balance/
├── backend/                    # Node.js API Server
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Authentication middleware
│   │   ├── routes/            # API routes
│   │   ├── db.js              # Database connection
│   │   └── index.js           # Server entry point
│   └── package.json
├── frontend/                   # React Native App
│   ├── app/
│   │   ├── welcome.tsx        # Login/Register screen
│   │   ├── home.tsx           # Main dashboard
│   │   ├── _layout.tsx        # Navigation layout
│   │   └── index.tsx          # App entry point
│   ├── constants/
│   │   ├── Colors.ts          # Theme colors
│   │   └── api.ts             # API endpoints
│   └── package.json
└── README.md
```

## 🎯 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- Expo CLI
- iOS Simulator/Android Emulator or physical device with Expo Go

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sahiljoharle/Bucks-And-Balance.git
   cd Bucks-And-Balance/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create database and tables (refer to db.js for schema)
   ```

4. **Start the server**
   ```bash
   npm start
   # Server runs on http://localhost:5001
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API configuration**
   ```typescript
   // In constants/api.ts
   export const API_BASE_URL = "http://YOUR_IP_ADDRESS:5001/api";
   ```

4. **Start Expo development server**
   ```bash
   npx expo start
   ```

5. **Test on device**
   - Scan QR code with Expo Go app (iOS/Android)
   - Or use simulator: Press `i` for iOS, `a` for Android

## 🎨 Design Features

### 🌟 Glassmorphism Effects
- Semi-transparent backgrounds with backdrop blur
- Layered depth with multiple gradient overlays
- Subtle border highlights and shadow effects

### 🎭 Smooth Animations
- **Logo Rotation**: Continuous Y-axis rotation with perspective
- **Form Transitions**: Slide-in animations with spring physics
- **Success Animation**: Logo scaling and X-axis rotation on login
- **Keyboard Handling**: Smooth content adjustment for better UX

### 🎨 Color Palette
```css
Background: #013220 (Dark Forest Green)
Primary: #00A86B (Bright Green)
Text: #FFFFFF (White)
Secondary: rgba(255, 255, 255, 0.6) (Semi-transparent)
Glass: rgba(255, 255, 255, 0.15) (Glassmorphism)
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login

### Expenses (Coming Soon)
- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## 📱 Screenshots

*Add screenshots of your app here*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sahil Joharle**
- GitHub: [@sahiljoharle](https://github.com/sahiljoharle)

## 🙏 Acknowledgments

- React Native team for the amazing framework
- Expo team for simplifying React Native development
- PostgreSQL community for the robust database system

---

⭐ **Star this repository if you found it helpful!**