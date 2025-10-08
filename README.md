# 🔐 NextPassGen

A simple **Password Generator + Secure Vault** built using **Next.js**, **Node.js**, and **MongoDB**.  
It lets users generate strong passwords, save them securely, and manage their vault easily.


## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router)
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Encryption:** Web Crypto API

## 🚀 Local Setup Instructions

### 1️⃣ Clone the Repository

git clone https://github.com/PrajwalGitCode/nextpassgen.git
cd nextpassgen

Backend Setup

cd backend
npm install
Create a .env file inside /backend:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Start the backend:

node index.js
Your backend runs on:
http://localhost:5000

Frontend Setup

cd ../frontend
npm run dev
Your frontend runs on:
http://localhost:3000

How to Use
Open the app in your browser → http://localhost:3000

Sign up or log in

Generate strong passwords

Save them securely in your vault

View, edit, or delete saved entries

Encrypted storage using Web Crypto API

Clean and responsive UI
