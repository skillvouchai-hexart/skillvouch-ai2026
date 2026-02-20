# SkillVouch AI - Quiz Generation Platform

<div align="center">
  <img src="public/skillvouch-logo.png" alt="SkillVouch AI Logo" width="200" height="200">
</div>

A cross-platform AI-powered quiz generation platform that creates personalized assessments based on user skills and requirements. Works seamlessly on **Windows, macOS, and Linux**.

## 🚀 Features

- AI-driven quiz generation using Mistral AI
- Skill assessment and matching
- Real-time quiz creation and evaluation
- Modern React + TypeScript frontend
- Express.js backend with MySQL database
- **Cross-platform compatibility** (Windows, macOS, Linux)

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **AI Services:** Mistral AI, OpenRouter (Llama 3.3 70B)
- **Database:** MySQL (cross-platform support)
- **Icons:** Lucide React
- **Charts:** Recharts

## 📋 Prerequisites

- **Node.js** (v18 or higher) - Works on all platforms
- **npm or yarn** - Package manager
- **MySQL database** - Cross-platform database solution
- **Mistral AI API key**
- **OpenRouter API key** (optional, for Llama 3.3 70B)

## 🌐 Platform Support

This project is designed to work on:
- **Windows 10/11** - Full support with native MySQL
- **macOS** - Full support with Homebrew MySQL
- **Linux** - Full support with package manager MySQL

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd skillvouch-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp backend/.env.example backend/.env
   
   # Edit backend/.env and add your API keys:
   MISTRAL_API_KEY=your-mistral-api-key-here
   VITE_OPENROUTER_API_KEY=your-openrouter-api-key-here
   LLAMA_API_KEY=your-openrouter-api-key-here
   
   # Configure database
   
   ```

4. **Set up your database:**

   **For macOS:**
   ```bash
   # Install MySQL
   brew install mysql
   
   # Start MySQL service
   brew services start mysql
   
   # Login to MySQL
   mysql -u root -p
   
   # Create database
   CREATE DATABASE skillvouch;
   
   # Import the schema
   USE skillvouch;
   SOURCE backend/sql/schema.sql;
   ```
   
   **For Windows:**
   ```bash
   # Download and install MySQL from: https://dev.mysql.com/downloads/mysql/
   # During installation, set root password and note it down
   
   # Open MySQL Command Line Client (from Start Menu)
   # Enter your root password when prompted
   
   # Create database
   CREATE DATABASE skillvouch;
   
   # Import the schema
   USE skillvouch;
   SOURCE C:/path/to/your/project/backend/sql/schema.sql;
   ```

   **For Linux (Ubuntu/Debian):**
   ```bash
   # Install MySQL
   sudo apt update
   sudo apt install mysql-server
   
   # Start MySQL service
   sudo systemctl start mysql
   sudo systemctl enable mysql
   
   # Secure MySQL (optional but recommended)
   sudo mysql_secure_installation
   
   # Login to MySQL
   sudo mysql -u root -p
   
   # Create database
   CREATE DATABASE skillvouch;
   
   # Import the schema
   USE skillvouch;
   SOURCE /path/to/your/project/backend/sql/schema.sql;
   ```

   **For Linux (Fedora/CentOS):**
   ```bash
   # Install MySQL
   sudo dnf install mysql-server
   
   # Start MySQL service
   sudo systemctl start mysqld
   sudo systemctl enable mysqld
   
   # Login to MySQL
   sudo mysql -u root -p
   
   # Create database
   CREATE DATABASE skillvouch;
   
   # Import the schema
   USE skillvouch;
   SOURCE /path/to/your/project/backend/sql/schema.sql;
   ```

5. **Configure database environment variables:**
   ```bash
   # Edit backend/.env and add your database credentials:
   
   ```

6. **Run the application:**
   
   **Start the backend server:**
   ```bash
   cd backend
   node server.js
   ```
   
   **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`
   The backend API will be available at `http://localhost:3000`

## 🚀 Deployment
### 🌟 **EASIEST OPTION: Vercel + GitHub (Recommended)**

## 📋 **Step-by-Step Process**

### **Step 1: Prepare Your Repository**
```bash
# Make sure your code is pushed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### **Step 2: Sign up for Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### **Step 3: Import Your Repository**
1. Click "New Project" on Vercel dashboard
2. Find your repository: `nitinmeruva2005/SkillVouch-Hexart`
3. Click "Import"
4. Vercel will automatically detect:
   - Framework: React + Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### **Step 4: Configure Environment Variables**
1. In Vercel project, click "Settings" tab
2. Click "Environment Variables" in left menu
3. Add these variables one by one:

```bash
# Frontend Variables
VITE_MISTRAL_API_KEY=your-mistral-api-key-here

# Backend Variables

MISTRAL_API_KEY=your-mistral-api-key-here
```

### **Step 5: Deploy**
1. Click "Deploy" button
2. Wait for build to complete (2-3 minutes)
3. Your app is now live! 🎉

### **Step 6: Verify Deployment**
1. Visit your live URL: `https://skillvouch-hexart.vercel.app`
2. Test all features:
   - Homepage loads
   - Quiz generation works
   - API endpoints respond

### **Step 7: Future Updates**
```bash
# Any changes you push will auto-deploy
git add .
git commit -m "Update feature"
git push origin main

# Or manual redeploy
vercel --prod
```

## 🔧 **Database Setup for Production**
