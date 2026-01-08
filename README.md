# 🛠️ E-Karigar Web System

A professional, full-stack service marketplace platform designed for reliability and scalability. **E-Karigar** connects skilled workers (karigars) with clients, providing a seamless booking and management experience.

---

## 🚀 Technical Stack

### **Backend (NestJS)**
- **Framework**: [NestJS v11](https://nestjs.com/) (Node.js) - Progressive, scalable, and modular architecture.
- **ORM**: [Prisma v6.1.0](https://www.prisma.io/) - Next-generation Node.js and TypeScript ORM.
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Powerful, open-source object-relational database.
- **Auth**: JWT (JSON Web Tokens) with Passport strategy.
- **Validation**: Custom uniqueness checks for emails and phone numbers.

### **Frontend (React)**
- **Framework**: [React 19](https://react.dev/) with **TypeScript** for type safety.
- **Build Tool**: [Vite](https://vitejs.dev/) - Lightning-fast frontend tooling.
- **State Management**: [TanStack React Query v5](https://tanstack.com/query/latest) for powerful server-state handling.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Modern utility-first CSS framework (Zero-config setup).
- **Icons**: Lucide React.

---

## 📂 Project Structure

The project is organized into two primary independent modules:

```text
E-Kariger-Web-system-main/
├── e-karigar-backend/      # NestJS Application
│   ├── prisma/             # Database schema and migrations
│   └── src/                # Backend source code (Auth, Modules, Services)
├── e-karigar-frontend/     # React + Vite Application
│   ├── src/                # Frontend source code (Pages, Components, API)
│   └── public/             # Static assets
└── README.md               # Root documentation (this file)
```

---

## ⚙️ Setup & Installation

### **Prerequisites**
- **Node.js**: v18.x or higher
- **PostgreSQL**: Local instance running
- **npm**: v10.x or higher

### **1. Backend Setup**
Navigate to the backend directory and install dependencies:
```bash
cd e-karigar-backend
npm install
```

Config your `.env` file (create it if missing):
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ekarigar_db?schema=public"
JWT_SECRET="your_secret_key"
```

Generate Prisma Client and Start:
```bash
npx prisma generate
npm run start:dev
```

### **2. Frontend Setup**
Navigate to the frontend directory and install dependencies:
```bash
cd e-karigar-frontend
npm install
```

Start the Development Server:
```bash
npm run dev
```

---

## 🛠️ Recent Improvements & Stability
- **Windows Compatibility**: Downgraded to Prisma v6.1.0 to resolve the `PrismaClientConstructorValidationError` common in newer v7 releases on Windows systems.
- **Data Integrity**: Implemented proactive phone number uniqueness checks in the `AuthService` to prevent unhandled database exceptions during user registration.
- **Modern Styling**: Fully integrated **Tailwind CSS v4** using the modern Vite plugin architecture, eliminating legacy configuration files.
- **CORS Configuration**: Backend is pre-configured to allow requests from the standard Vite development port (`http://localhost:5173`).

---

## 📝 Roadmap
- [x] Backend Core & Database Schema
- [x] User Authentication (JWT)
- [x] Frontend Initialization
- [x] Tailwind CSS v4 Integration
- [/] Login & Registration Pages
- [ ] Vendor Dashboard & Profile Management
- [ ] Service Booking System
- [ ] Real-time Chat (WebSockets)

---

## 📄 License
This project is [UNLICENSED](LICENSE).
