# 📍 Location Tracker Application

A modern web application for tracking IP addresses and their geographical locations. Built with **Laravel** backend and **React** frontend.

## ✨ Features

- 🔍 IP Location Tracking - Search any IP for geographical data
- 📍 Current Location - Auto-detect your location
- 📚 Search History - Track previous searches with timestamps
- 👁️ IP Privacy - Hide/show IP addresses
- 🎨 Modern UI - Beautiful glassmorphism design
- 🔐 Secure Auth - Laravel Sanctum authentication
- 📱 Responsive - Works on all devices

## 🛠️ Tech Stack

### Backend
- Laravel 10 - PHP framework
- Laravel Sanctum - API authentication
- MySQL - Database
- CORS - Cross-origin resource sharing

### Frontend
- React 18 - JavaScript library
- React Router - Client-side routing
- Context API - State management
- CSS3 - Styling with modern features

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- PHP 8.1+
- Composer
- Node.js 16+
- npm 
- MySQL 
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd userCred
```

### 2. Backend Setup (Laravel)

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
# Update these values in your .env file:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=your_database_name
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run database migrations
php artisan migrate

# Start Laravel development server
php artisan serve
```

The Laravel backend will be running at `http://localhost:8000`

### 3. Frontend Setup (React)

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start React development server
npm start
```

The React frontend will be running at `http://localhost:3000`



Username: test@example.com   Password: password123

### Contact Information

For account access, users can contact the admin through:
- Phone: 09949279910
- Email: dcamorganda@gmail.com

## 🌐 API Endpoints

### Authentication
- `POST /api/login` - User login
- `GET /api/user` - Get authenticated user info (protected)

### Response Format
```json
{
    "success": true,
    "token": "your_auth_token",
    "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com"
    }
}
```




 By : Donyl C. Amorganda 