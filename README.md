# LinkedIn MVP Assistant - AI Content Generator 🚀

A full-stack application that integrates with the official LinkedIn API to authenticate users, generate personalized content using AI (Google gemini-2.5-flash), and publish posts directly to LinkedIn.

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Limitations & Notes](#-limitations--notes)
- [Testing the Flow](#-testing-the-flow)
- [Author](#author)

---

## ✨ Features

1.  **LinkedIn OAuth 2.0 Authentication**
    - Secure login flow using **OpenID Connect**.
    - Scopes used: `openid`, `profile`, `email`, `w_member_social`.
    - Auto-fetch and store user profile data (Name, Profile Picture, Email).

2.  **AI Personalization Engine**
    - Captures user context: Role, Career Goals, Challenges, Target Audience, and Tone.
    - Integrated with **Google gemini-2.5-flash** for high-speed, cost-effective content generation.

3.  **Content Generator**
    - Generates professional LinkedIn posts with emojis and hashtags based on user preferences.
    - Supports multiple tones (Professional, Casual, Inspirational, Funny).

4.  **Real-Time Publishing**
    - Publishes generated content directly to the user's LinkedIn feed via the LinkedIn `ugcPosts` API.
    - Handles success/failure states and stores LinkedIn Post IDs.

5.  **Interactive Dashboard**
    - View Profile Summary.
    - Manage AI Preferences.
    - View Post History with status indicators (Published/Failed).

---

## 🛠 Tech Stack

*   **Frontend:** Next.js 16 (App Router), Tailwind CSS, Axios
*   **Backend:** NestJS, TypeORM, Passport.js (OAuth strategy), Express-Session
*   **Database:** MySQL
*   **AI Model:** Google gemini-2.5-flash (@google/generative-ai)

---

## 📂 Project Structure

```bash
LinkedIn-MVP-Assistant/
│
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentication Logic (OAuth, Guards, Strategies)
│   │   ├── entities/          # TypeORM Entities (DB Schema)
│   │   ├── posts/             # Post Generation & Publishing Logic
│   │   ├── users/             # User Management & Preferences
│   │   ├── app.module.ts      # Main Module
│   │   └── main.ts            # Entry Point
│   ├── .env                   # Backend Config
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── dashboard/     # Main Dashboard Page
    │   │   └── layout.js
    │   └── components/        # Reusable UI Components
    ├── public/
    └── package.json
```

---

## 🗄 Database Schema

The application uses MySQL with TypeORM. Key relationships include:
- **User (1:1) LinkedInAccount**
- **LinkedInAccount (1:1) OAuthToken** (Stores Access/Refresh Tokens)
- **User (1:1) UserPreference** (Stores AI Context)
- **LinkedInAccount (1:N) Post** (Stores History & Status)

> **Note:** ON DELETE CASCADE is implemented to ensure data integrity when removing users.

---

## ✅ Prerequisites

1.  Node.js (v18 or higher)
2.  MySQL Server (Running locally or via Docker)
3.  LinkedIn Developer App (With **Sign In with LinkedIn using OpenID Connect** and **Share on LinkedIn** products enabled).
4.  Google AI Studio Key (For Gemini API).

---

## 🚀 Installation & Setup

### 1. Database Setup
Create a MySQL database named `linkedin_mvp_db`:
```sql
CREATE DATABASE linkedin_mvp_db;
```

### 2. Backend Setup
Navigate to the backend folder:
```bash
cd backend
npm install
```
Create a `.env` file (see Environment Variables below) and start the server:
```bash
npm run dev
```
The backend will run on `http://localhost:3000`.

### 3. Frontend Setup
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```
Start the Next.js development server on port 3001:
```bash
npm run dev
```
The frontend will run on `http://localhost:3001`.

---

## 🔑 Environment Variables

### Backend
Create a `.env` file in the `backend` directory with the following keys:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=linkedin_mvp

# Server Configuration
PORT=3000

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:3001

# LinkedIn OAuth Credentials
# Get these from: https://www.linkedin.com/developers/apps
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_CALLBACK_URL=http://localhost:3000/auth/linkedin/callback

# Session Secret (use a strong random string in production)
JWT_SECRET=your_super_secret_key_change_this_in_production

# Gemini AI API Key
# Get this from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend
```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

---

## 📡 API Endpoints

### Authentication
- `GET /auth/linkedin` - Initiates OAuth flow.
- `GET /auth/linkedin/callback` - Handles redirect and token storage.

### Users & Preferences
- `GET /users/:id` - Fetch user profile and preferences.
- `POST /users/:id/preferences` - Save/Update AI generation preferences.
- `DELETE /users/:id` - Delete user and associated data.

### Posts & AI
- `POST /posts/generate/:userId` - Generate a post using gemini-2.5-flash.
- `POST /posts/publish/:userId` - Publish content to LinkedIn (ugcPosts).
- `GET /posts/history/:userId` - Fetch post history.

---

## ⚠️ Limitations & Notes

1.  **Scopes Required:** To publish posts, the LinkedIn App must have the **Share on LinkedIn** product enabled (Scope: `w_member_social`).
2.  **Token Expiry:** LinkedIn access tokens typically last for 60 days. The system stores `expires_in` data to manage this.

---

## 🧪 Testing the Flow

1.  Go to `http://localhost:3000/auth/linkedin`.
2.  Login with your LinkedIn credentials.
3.  You will be redirected to the Dashboard (`http://localhost:3001/dashboard?id=...`).
4.  Fill in the **AI Personalization Setup** form and click "Save". (System validates the input before saving).
5.  Click "✨ Generate New Post".
6.  Once the draft appears, click "Publish to LinkedIn 🚀".
7.  Check the **Post History** table at the bottom for the status.

---

## Author
**Pubudu Bandara**
