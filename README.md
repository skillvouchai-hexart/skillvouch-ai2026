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

## �� Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 Environment Variables

### Required API Keys

1. **Mistral AI API Key:**
   - Get your key from: https://console.mistral.ai/
   - Used for quiz generation

### Database Configuration

Make sure your MySQL server is running and the database credentials in `backend/.env` are correct.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
- Check the existing issues
- Create a new issue with detailed information
- Include your environment details and error messages

---

**Note:** This project uses AI services that may require API keys with associated costs. Please check the pricing details for each service before usage.
