# 🛠️ E-Karigar Web System

![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-MERN_%2B_NestJS-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)

A professional, full-stack service marketplace platform designed to connect skilled workers (**Karigars**) with clients. E-Karigar provides a seamless, secure, and modern experience for finding and booking local experts for plumbing, electrical work, carpentry, and more.

---

## 🌟 Key Features

### 👤 For Clients
- **Find Experts**: Search and filter skilled professionals by service type (Plumber, Electrician, etc.).
- **Verified Vendors**: View profiles with verified badges, descriptions, and service listings.
- **Easy Booking**: Seamlessly book services (coming soon).
- **Secure Auth**: JWT-based secure login and registration.

### 🛠️ For Vendors (Karigars)
- **Vendor Dashboard**: Dedicated dashboard to manage services, view earnings, and track orders.
- **Service Management**: Create, edit, and delete service listings with pricing and descriptions.
- **Application Flow**: "Become a Seller" application process with Admin approval.
- **Stats**: Real-time overview of active services and profile status.

### 🛡️ For Admins
- **Admin Panel**: Comprehensive oversight of the platform.
- **Vendor Verification**: Review, approve, or reject vendor applications ensuring quality control.
- **User Management**: View and manage all users and vendors.
- **Platform Stats**: Track total users, vendors, and services.

---

## 🚀 Technical Stack

### **Backend**
| Tech | Description |
| :--- | :--- |
| **NestJS** | Progressive Node.js framework for scalable server-side apps. |
| **Prisma ORM** | Type-safe database access for PostgreSQL. |
| **PostgreSQL** | Robust relational database system. |
| **JWT** | Secure authentication and session management. |

### **Frontend**
| Tech | Description |
| :--- | :--- |
| **React 19** | Modern UI library with TypeScript. |
| **Vite** | Lightning-fast build tool and dev server. |
| **Tailwind CSS** | Utility-first framework for custom, responsive design. |
| **Lucide React** | Beautiful, consistent icon set. |
| **Axios** | Promise-based HTTP client for API integration. |

---

## 📸 Screenshots

*(Screenshots of the Landing Page, Dashboard, and Admin Panel will be added here)*

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Cloud)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/E-Kariger-Web-system.git
cd E-Kariger-Web-system-main
```

### 2. Backend Setup
```bash
cd e-karigar-backend

# Install dependencies
npm install

# Configure Environment Variables
# Create a .env file and add:
# DATABASE_URL="postgresql://user:password@localhost:5432/ekarigar_db?schema=public"
# JWT_SECRET="your_secret_key"

# Run Migrations
npx prisma migrate dev

# Start Server
npm run start:dev
```

### 3. Frontend Setup
```bash
cd e-karigar-frontend

# Install dependencies
npm install

# Start Dev Server
npm run dev
```
Visit `http://localhost:5173` to view the app.

---

## 🗺️ Roadmap & Progress

- [x] **Core System**
    - [x] Backend Setup (NestJS + Prisma)
    - [x] Database Schema Design
    - [x] Authentication (Login/Register/JWT)

- [x] **Frontend Foundation**
    - [x] React + Vite Setup
    - [x] Modern UI Design System (Glassmorphism, Tailwind)
    - [x] Navbar & Layouts

- [x] **Vendor Features**
    - [x] Vendor Application Flow
    - [x] Vendor Dashboard
    - [x] Service Management (CRUD)

- [x] **Admin Features**
    - [x] Admin Dashboard
    - [x] Vendor Verification (Approve/Reject)
    - [x] Platform Statistics

- [ ] **Future Updates**
    - [ ] Service Booking & Scheduling
    - [ ] Reviews & Ratings System
    - [ ] Chat System
    - [ ] Payment Integration

---

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License
This project is licensed under the MIT License.
