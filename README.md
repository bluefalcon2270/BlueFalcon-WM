# BlueFalcon WM

A blazing-fast, full-stack Next.js 15 E-Commerce template designed for rapid deployment and maximum performance. Built for the modern web, this Premium Clothing Store features a responsive custom design system, smart authentication, and an interactive admin dashboard.

## 🚀 Features

### v1.1 Updates
- **Unified Smart Authentication**: Seamless login/signup flow with auto-detection for usernames or emails.
- **Admin Settings Panel**: Easily change your admin username and password directly from the live dashboard.
- **User Profiles**: Customers can view their account details, email verification status, and complete order history.
- **Advanced Shop Filtering**: Includes a search bar and category filters to instantly find products.
- **Direct Image Uploads**: Admins can upload product images directly from their local computer.
- **Revenue Analytics**: Interactive Recharts bar graph displaying store revenue over time.
- **Simulated Stripe Checkout**: A professional credit card checkout simulation ready to be swapped with real Stripe API keys.

### Core Architecture
- **Framework**: Next.js 15 (App Router, Server Actions)
- **Database**: Prisma ORM with local SQLite (`dev.db`)
- **Authentication**: NextAuth.js (Credentials Provider)
- **Styling**: Custom Vanilla CSS Design System (Dark/Light mode support, micro-animations, glassmorphism)

---

## ⚡ Deployment (One-Click Install)

You can deploy this entire website onto a fresh Ubuntu/Debian VPS in seconds using our magic initializer script. 

Simply log into your VPS via SSH and paste this single command:

```bash
curl -sL https://raw.githubusercontent.com/bluefalcon2270/BlueFalcon-WM/main/init.sh | bash
```

### What does the initializer do?
1. Automatically updates the system and installs `git`.
2. Downloads the latest version of the repository.
3. Launches the **Interactive Bash Menu** (`install.sh`).

### The Interactive Menu
Once the menu opens, you can easily manage your server:
1. **Install System Dependencies**: Installs Node.js, PM2, and Nginx. (Run this first on a fresh VPS!)
2. **Deploy Website**: Builds the Next.js app, syncs the database, auto-detects your server IP, and starts the web server.
3. **Update Website**: Pulls the latest commits from GitHub and cleanly rebuilds the live application.
4. **View Live Logs**: Tails the PM2 logs so you can monitor live traffic and errors.

---

## 💻 Local Development

If you want to run the project locally on your PC:

1. **Install Dependencies**
   ```bash
   cd store
   npm install
   ```
2. **Initialize Database**
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```
3. **Start Development Server**
   ```bash
   npm run dev
   ```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin`
