# 📄 E-Karigar Web System — Project Documentation

> **Version:** 1.0  
> **Date:** February 16, 2026  
> **Status:** Active Development  
> **License:** MIT  

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technical Stack](#2-technical-stack)
3. [Project Structure](#3-project-structure)
4. [Database Schema (Prisma)](#4-database-schema-prisma)
5. [Backend Architecture (NestJS)](#5-backend-architecture-nestjs)
6. [Frontend Architecture (React + Vite)](#6-frontend-architecture-react--vite)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [API Endpoints Reference](#8-api-endpoints-reference)
9. [System Flow Diagrams](#9-system-flow-diagrams)
10. [Feature List & Functionality Breakdown](#10-feature-list--functionality-breakdown)
11. [Deployment & Configuration](#11-deployment--configuration)
12. [Future Roadmap](#12-future-roadmap)

---

## 1. Project Overview

**E-Karigar** is a full-stack **service marketplace platform** that connects skilled workers (Karigars/Vendors) with clients who need home services such as plumbing, electrical work, carpentry, painting, and more.

### Key Objectives
- Enable **clients** to discover, browse, and book verified service providers.
- Allow **vendors** (skilled workers) to register, get verified, and list their services.
- Provide **admins** with a comprehensive panel to manage the platform, verify vendors, and monitor statistics.

### User Roles
| Role | Description |
|:---|:---|
| **CLIENT** | End-user who browses services, books vendors, and manages bookings. |
| **VENDOR** | Skilled professional who lists services and manages job requests. |
| **ADMIN** | Platform administrator who verifies vendors, manages users, and views platform stats. |

---

## 2. Technical Stack

### 2.1 Backend

| Technology | Version | Purpose |
|:---|:---|:---|
| **NestJS** | v11 | Progressive Node.js framework for scalable server-side applications |
| **Prisma ORM** | v6.1 | Type-safe database access and schema management |
| **PostgreSQL** | — | Primary relational database |
| **JWT (`@nestjs/jwt`)** | v11 | Secure authentication & token-based sessions |
| **Passport.js** | v0.7 | Authentication middleware strategy |
| **bcrypt** | v6 | Password hashing (10 salt rounds) |
| **Cloudinary** | v2.9 | Cloud-based image upload & management |
| **Multer** | — | File upload middleware (memory storage for Cloudinary) |
| **class-validator / class-transformer** | — | DTO validation and transformation |
| **@nestjs/serve-static** | v5 | Serving uploaded static files |
| **TypeScript** | v5.7 | Type-safe development language |

### 2.2 Frontend

| Technology | Version | Purpose |
|:---|:---|:---|
| **React** | v19 | UI library with functional components and hooks |
| **Vite** | v7 | Lightning-fast build tool and dev server |
| **TypeScript** | v5.7 | Type-safe frontend development |
| **Tailwind CSS** | v4 | Utility-first CSS framework for responsive, modern design |
| **React Router DOM** | v7 | Client-side routing with protected routes |
| **Axios** | v1.13 | Promise-based HTTP client for API communication |
| **Lucide React** | v0.562 | Modern, consistent icon library |
| **Framer Motion** | v12 | Smooth animations and transitions |
| **React Hook Form + Yup** | v7 / v1.7 | Form handling with schema-based validation |
| **React Hot Toast** | v2.6 | Toast notifications |
| **@tanstack/react-query** | v5.90 | Server state management and caching |

---

## 3. Project Structure

```
E-Kariger-Web-system-main/
├── e-karigar-backend/               # NestJS Backend Server
│   ├── prisma/
│   │   └── schema.prisma            # Database schema definition
│   ├── src/
│   │   ├── main.ts                  # App bootstrap & CORS config
│   │   ├── app.module.ts            # Root module (imports all feature modules)
│   │   ├── app.controller.ts        # Root health-check controller
│   │   ├── app.service.ts           # Root app service
│   │   ├── prisma.service.ts        # Prisma client wrapper service
│   │   ├── auth/                    # Authentication module
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts   # Login, Register, Get Me endpoints
│   │   │   ├── auth.service.ts      # Business logic for auth
│   │   │   ├── auth.guard.ts        # JWT-based AuthGuard
│   │   │   └── dto/                 # Data transfer objects
│   │   ├── admin/                   # Admin module
│   │   │   ├── admin.module.ts
│   │   │   ├── admin.controller.ts  # Vendor management, stats endpoints
│   │   │   └── admin.service.ts     # Admin business logic
│   │   ├── services/                # Services module (marketplace listings)
│   │   │   ├── services.module.ts
│   │   │   ├── services.controller.ts  # CRUD for services + image upload
│   │   │   └── services.service.ts     # Service business logic
│   │   ├── vendors/                 # Vendors module
│   │   │   ├── vendors.module.ts
│   │   │   ├── vendors.controller.ts   # Vendor application & profile
│   │   │   └── vendors.service.ts      # Vendor business logic
│   │   ├── bookings/                # Bookings module
│   │   │   ├── bookings.module.ts
│   │   │   ├── bookings.controller.ts  # Create booking, manage status
│   │   │   ├── bookings.service.ts     # Booking business logic
│   │   │   └── dto/                    # Create & update DTOs
│   │   └── cloudinary/              # Image upload module
│   │       ├── cloudinary.module.ts
│   │       ├── cloudinary.provider.ts  # Cloudinary SDK configuration
│   │       └── cloudinary.service.ts   # Image upload service
│   └── package.json
│
├── e-karigar-frontend/              # React + Vite Frontend
│   ├── src/
│   │   ├── main.tsx                 # React app entry point
│   │   ├── App.tsx                  # Root component with routing
│   │   ├── App.css                  # Global styles
│   │   ├── index.css                # Tailwind base imports
│   │   ├── pages/                   # Page-level components
│   │   │   ├── HomePage.tsx         # Landing page with search
│   │   │   ├── AboutPage.tsx        # About the platform
│   │   │   ├── ServicesPage.tsx     # Service listing & filtering
│   │   │   ├── ServiceDetailsPage.tsx  # Individual service details
│   │   │   ├── DashboardPage.tsx    # Role-based dashboard
│   │   │   ├── BecomeVendorPage.tsx # Vendor application form
│   │   │   ├── LoginPage.tsx        # (Legacy, redirects to auth/)
│   │   │   ├── RegisterPage.tsx     # (Legacy, redirects to auth/)
│   │   │   └── auth/
│   │   │       ├── LoginPage.tsx    # Login form
│   │   │       └── SignupPage.tsx   # Registration form
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.tsx           # Navigation bar (role-aware)
│   │   │   ├── AdminDashboard.tsx   # Admin panel component
│   │   │   ├── VendorDashboard.tsx  # Vendor management component
│   │   │   ├── BookingModal.tsx     # Service booking modal
│   │   │   ├── FeaturedServices.tsx # Homepage featured services carousel
│   │   │   ├── AnnouncementBar.tsx  # Top announcement banner
│   │   │   ├── admin/
│   │   │   │   └── VendorVerificationList.tsx  # Vendor approval UI
│   │   │   ├── client/
│   │   │   │   └── ClientBookings.tsx  # Client booking history
│   │   │   └── vendor/
│   │   │       └── JobRequestManager.tsx  # Vendor incoming job requests
│   │   ├── layouts/                 # Layout wrappers
│   │   │   ├── AuthLayout.tsx       # Auth pages layout
│   │   │   ├── DashboardLayout.tsx  # Dashboard sidebar layout
│   │   │   └── DashboardLayoutWrapper.tsx  # Protected dashboard wrapper
│   │   ├── services/                # API service layer
│   │   │   └── api.ts               # Axios instance, interceptors, API functions
│   │   └── data/                    # Static data
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 4. Database Schema (Prisma)

### 4.1 Entity Relationship Overview

The database consists of **11 models** and **3 enums** managed through Prisma ORM with PostgreSQL.

### 4.2 Models

#### `User` (users)
| Column | Type | Constraints | Description |
|:---|:---|:---|:---|
| `id` | String (UUID) | PK, auto-generated | Unique user identifier |
| `name` | String | Required | User's display name |
| `email` | String | Unique, Required | User's email address |
| `phone` | String | Unique, Optional | Phone number |
| `password_hash` | String | Required | bcrypt-hashed password |
| `role` | UserRole (Enum) | Required | ADMIN, VENDOR, or CLIENT |
| `is_active` | Boolean | Default: true | Account active status |
| `created_at` | DateTime | Auto-set | Account creation timestamp |
| `updated_at` | DateTime | Auto-updated | Last update timestamp |

**Relations:** Has one `VendorProfile`, many `Booking` (as client), many `ChatMessage`, many `Review`, many `AdminAuditLog`.

---

#### `VendorProfile` (vendor_profiles)
| Column | Type | Constraints | Description |
|:---|:---|:---|:---|
| `id` | String (UUID) | PK | Vendor profile identifier |
| `user_id` | String | Unique, FK → User | Linked user account |
| `vendor_type` | String | Default: "INDIVIDUAL" | Business type |
| `approval_status` | VendorVerificationStatus | Default: PENDING | Verification status |
| `description` | String | Optional | Business description |
| `city` | String | Optional | Business city/location |
| `is_verified` | Boolean | Default: false | Verification badge status |
| `verification_badge` | Boolean | Default: false | Display badge flag |
| `business_phone` | String | Optional | Business contact number |
| `cnic` | String | Unique, Optional | National ID (CNIC) number |
| `experience_years` | Int | Optional | Years of experience |

**Relations:** Belongs to `User`, has many `Service`, many `Booking` (as vendor), many `Review`, many `VerificationRecord`.

---

#### `Category` (categories)
| Column | Type | Description |
|:---|:---|:---|
| `id` | String (UUID) | Category identifier |
| `name` | String | Category name (e.g., "Plumbing") |
| `is_active` | Boolean | Active status |

**Relations:** Has many `Service`.

---

#### `Service` (services)
| Column | Type | Description |
|:---|:---|:---|
| `id` | String (UUID) | Service listing identifier |
| `vendor_id` | String (FK) | Vendor who created the service |
| `category_id` | String (FK) | Service category |
| `title` | String | Service title |
| `description` | String | Detailed description |
| `price` | Decimal(10,2) | Service price |
| `images` | String[] | Cloudinary image URLs |
| `is_active` | Boolean | Active listing status |

**Relations:** Belongs to `VendorProfile` and `Category`, has many `Booking`.

---

#### `Booking` (bookings)
| Column | Type | Description |
|:---|:---|:---|
| `id` | String (UUID) | Booking identifier |
| `client_id` | String (FK) | Client who booked |
| `vendor_id` | String (FK) | Vendor being booked |
| `service_id` | String (FK) | Service being booked |
| `status` | BookingStatus (Enum) | Current booking status |
| `address` | String | Service location address |
| `problem_description` | String | Client's problem description |
| `scheduled_date` | DateTime | Scheduled service date |
| `total_price` | Decimal(10,2) | Total booking price |

**Relations:** Belongs to `User` (client), `VendorProfile` (vendor), `Service`. Has one `ChatRoom`, one `Review`, many `BookingStatusLog`.

---

#### `BookingStatusLog` (booking_status_logs)
Tracks status transitions for audit trail.

#### `ChatRoom` (chat_rooms) & `ChatMessage` (chat_messages)
Schema defined for future chat functionality per booking.

#### `Review` (reviews)
Schema defined for future rating/review system per booking.

#### `VerificationRecord` (verification_records)
Tracks vendor document verification records.

#### `AdminAuditLog` (admin_audit_logs)
Logs admin actions for accountability.

---

### 4.3 Enums

```
UserRole:        ADMIN | VENDOR | CLIENT
BookingStatus:   PENDING | ACCEPTED | REJECTED | COMPLETED | CANCELLED
VendorVerificationStatus:  PENDING | APPROVED | REJECTED
```

---

## 5. Backend Architecture (NestJS)

### 5.1 Module Structure

The backend follows NestJS's **modular architecture** with 6 feature modules:

```
AppModule (Root)
├── AuthModule         — Registration, login, JWT token management
├── AdminModule        — Vendor verification, platform stats, content moderation
├── ServicesModule     — Service CRUD with image upload
├── VendorsModule      — Vendor application, status, profile management
├── BookingsModule     — Booking creation, status management
├── CloudinaryModule   — Image upload to Cloudinary cloud
└── ServeStaticModule  — Serves uploaded files from /uploads
```

### 5.2 Core Services

#### PrismaService (`prisma.service.ts`)
- Extends `PrismaClient` and implements `OnModuleInit`
- Auto-connects to PostgreSQL on module initialization
- Logging enabled for `info`, `warn`, `error` levels
- Injected into all feature services as the database layer

#### Main Bootstrap (`main.ts`)
- Creates NestJS application instance
- Enables **CORS** with `origin: true` (allows all origins for development/production flexibility)
- Listens on `process.env.PORT` (for Render deployment) or fallback to port `3000`

---

## 6. Frontend Architecture (React + Vite)

### 6.1 Routing Architecture

The frontend uses **React Router v7** with three route categories:

#### Public Routes (No auth required)
| Route | Component | Description |
|:---|:---|:---|
| `/` | `HomePage` | Landing page with hero, search, featured services |
| `/about` | `AboutPage` | Platform information page |
| `/services` | `ServicesPage` | Browse all services with filtering |
| `/services/:id` | `ServiceDetailsPage` | Individual service details + booking |

#### Auth Routes (Redirect if logged in)
| Route | Component | Description |
|:---|:---|:---|
| `/login` | `LoginPage` | User login form |
| `/register` | `SignupPage` | User registration form |
| `/join` | Redirect → `/register` | Alias for registration |

#### Protected Routes (Auth required)
| Route | Component | Description |
|:---|:---|:---|
| `/dashboard` | `DashboardPage` | Main role-based dashboard |
| `/dashboard/verification` | `VendorVerificationList` | Admin vendor review |
| `/dashboard/jobs` | `JobRequestManager` | Vendor incoming job requests |
| `/client/dashboard` | `DashboardPage` | Client-specific dashboard view |
| `/vendor/dashboard` | `DashboardPage` | Vendor-specific dashboard view |
| `/vendor/jobs` | `JobRequestManager` | Vendor job management |
| `/admin` | `DashboardPage` | Admin dashboard |
| `/admin/verification` | `VendorVerificationList` | Admin vendor verification |
| `/become-vendor` | `BecomeVendorPage` | Vendor application form |

### 6.2 Route Guards

- **`ProtectedRoute`**: Checks for JWT token in `localStorage`. Redirects to `/login` if absent.
- **`PublicOnlyRoute`**: Redirects authenticated users away from login/register pages to `/dashboard`.

### 6.3 API Service Layer (`services/api.ts`)

- **Axios Instance**: Configured with dynamic `baseURL` from `VITE_API_URL` env variable (defaults to `http://localhost:3000`).
- **Request Interceptor**: Automatically attaches `Bearer` JWT token from `localStorage` to every outgoing request.
- **API Modules**:
  - `bookingsApi`: `create()`, `getClientBookings()`, `getVendorBookings()`, `updateStatus()`
  - `servicesApi`: `getAll()`, `getById()`

### 6.4 State Management
- **Local State**: React `useState` and `useEffect` hooks for component-level state.
- **Server State**: `@tanstack/react-query` available for server-state caching (configured in dependencies).
- **Auth State**: JWT token and user data stored in `localStorage`.

---

## 7. Authentication & Authorization

### 7.1 Authentication Flow

```
┌──────────┐     POST /auth/register     ┌──────────────┐
│  Client   │ ───────────────────────────→│  AuthService  │
│ (Browser) │     { email, password,      │               │
│           │       name }                │  1. Check     │
│           │                             │     duplicate │
│           │     POST /auth/login        │  2. Hash pwd  │
│           │ ───────────────────────────→│  3. Create    │
│           │     { email, password }     │     User      │
│           │                             │  4. Sign JWT  │
│           │ ←───────────────────────────│  5. Return    │
│           │     { access_token,         │     token +   │
│           │       user }                │     user info │
└──────────┘                              └──────────────┘
```

### 7.2 Key Design Decisions

1. **Unified Registration**: All new users register as `CLIENT` role. No vendor/admin self-registration.
2. **JWT Payload**: Contains `sub` (userId), `email`, and `role`.
3. **Password Hashing**: Uses bcrypt with 10 salt rounds.
4. **Vendor Status on Login**: Returns `vendorStatus` (NONE/PENDING/APPROVED/REJECTED) for frontend UI decisions.
5. **Auto-Login on Register**: JWT token is generated immediately after successful registration.

### 7.3 AuthGuard (`auth.guard.ts`)

- Implements NestJS `CanActivate` interface.
- Extracts Bearer token from `Authorization` header.
- Verifies token using `JWT_SECRET` from environment variables.
- Attaches decoded user payload to `request.user` for downstream controllers.

---

## 8. API Endpoints Reference

### 8.1 Auth Endpoints (`/auth`)

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/auth/register` | ❌ Public | Register new CLIENT user |
| `POST` | `/auth/login` | ❌ Public | Login and get JWT token |
| `GET` | `/auth/me` | ✅ JWT | Get current user profile |

### 8.2 Services Endpoints (`/services`)

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `GET` | `/services/public` | ❌ Public | Get all active services (homepage) |
| `GET` | `/services/:id` | ❌ Public | Get single service details |
| `GET` | `/services/my` | ✅ JWT | Get vendor's own services |
| `POST` | `/services` | ✅ JWT (Vendor) | Create new service (with image upload) |
| `PATCH` | `/services/:id` | ✅ JWT (Owner) | Update service details |
| `DELETE` | `/services/:id` | ✅ JWT (Owner) | Delete a service |

### 8.3 Vendors Endpoints (`/vendors`)

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/vendors/apply` | ✅ JWT | Submit vendor application |
| `GET` | `/vendors/status` | ✅ JWT | Get vendor application status |
| `GET` | `/vendors/profile` | ✅ JWT | Get full vendor profile with services |

### 8.4 Admin Endpoints (`/admin`)

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `GET` | `/admin/vendors/pending` | ✅ JWT | List all pending vendor applications |
| `GET` | `/admin/vendors/approved` | ✅ JWT | List all approved vendors |
| `PATCH` | `/admin/vendors/:id/approve` | ✅ JWT | Approve a vendor application |
| `PATCH` | `/admin/vendors/:id/reject` | ✅ JWT | Reject a vendor application |
| `GET` | `/admin/stats` | ✅ JWT | Get platform dashboard statistics |
| `DELETE` | `/admin/vendors/:id` | ✅ JWT | Delete vendor and all their services |
| `DELETE` | `/admin/services/:id` | ✅ JWT | Delete any service |

### 8.5 Bookings Endpoints (`/bookings`)

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/bookings` | ✅ JWT | Create a new booking |
| `GET` | `/bookings/client` | ✅ JWT | Get client's booking history |
| `GET` | `/bookings/vendor` | ✅ JWT | Get vendor's incoming bookings |
| `PATCH` | `/bookings/:id/status` | ✅ JWT | Update booking status (Accept/Reject/Complete) |

---

## 9. System Flow Diagrams

### 9.1 User Registration & Vendor Application Flow

```
User visits site
    │
    ▼
Registers as CLIENT ───→ Gets JWT token ───→ Can browse & book services
    │
    ▼
Clicks "Become a Vendor"
    │
    ▼
Fills application form:
  • City, CNIC, Business Phone
  • Experience, Description, Vendor Type
    │
    ▼
Application submitted (status = PENDING)
    │
    ▼
Admin reviews in Admin Dashboard
    │
    ├── Approve ──→ Vendor status = APPROVED
    │                 • is_verified = true
    │                 • Can create/manage services
    │
    └── Reject ───→ Vendor status = REJECTED
                      • Cannot list services
```

### 9.2 Service Booking Flow

```
Client browses /services
    │
    ▼
Clicks on a service → ServiceDetailsPage
    │
    ▼
Clicks "Book Now" → BookingModal opens
    │
    ▼
Fills form:
  • Scheduled Date (must be future)
  • Problem Description
  • Address
  • Total Price
    │
    ▼
POST /bookings (validation: cannot book own service)
    │
    ▼
Booking created with status = PENDING
    │
    ▼
Vendor sees in JobRequestManager
    │
    ├── ACCEPT → status = ACCEPTED
    ├── REJECT → status = REJECTED
    └── COMPLETE → status = COMPLETED
    │
    ▼
Client sees updated status in ClientBookings
```

### 9.3 Service Image Upload Flow

```
Vendor creates/updates service
    │
    ▼
Frontend sends FormData with 'image' file
    │
    ▼
ServicesController receives via FileInterceptor (memoryStorage)
    │
    ▼
Validation:
  • Allowed types: JPEG, PNG, GIF, WebP
  • Max size: 5 MB
    │
    ▼
CloudinaryService.uploadImage()
  • Streams buffer to Cloudinary
  • Folder: 'e-karigar-services'
    │
    ▼
Returns secure_url → stored in service.images[]
```

---

## 10. Feature List & Functionality Breakdown

### 10.1 Client Features

| # | Feature | Implementation Details |
|:---|:---|:---|
| 1 | **User Registration** | `POST /auth/register` → Creates CLIENT user, hashes password with bcrypt, auto-generates JWT. Component: `SignupPage.tsx` |
| 2 | **User Login** | `POST /auth/login` → Validates credentials, returns JWT + vendor status. Component: `LoginPage.tsx` |
| 3 | **Browse Services** | `GET /services/public` → Fetches all active services with vendor/category info. Component: `ServicesPage.tsx` with search & filter |
| 4 | **View Service Details** | `GET /services/:id` → Fetches single service with vendor profile and contact. Component: `ServiceDetailsPage.tsx` |
| 5 | **Book a Service** | `POST /bookings` → Creates booking with scheduled date, address, price. Validates future date, prevents self-booking. Component: `BookingModal.tsx` |
| 6 | **View Booking History** | `GET /bookings/client` → Returns client's bookings with service/vendor details, ordered by date. Component: `ClientBookings.tsx` |
| 7 | **Featured Services** | Homepage carousel showing highlighted active services. Component: `FeaturedServices.tsx` |
| 8 | **Homepage Search** | Search bar for finding services by keyword and location. Component: `HomePage.tsx` |
| 9 | **Apply to Become Vendor** | `POST /vendors/apply` → Submit vendor application with CNIC, city, experience, etc. Status starts as PENDING. Component: `BecomeVendorPage.tsx` |

### 10.2 Vendor Features

| # | Feature | Implementation Details |
|:---|:---|:---|
| 1 | **Vendor Dashboard** | Displays active services count, earnings overview, service management. Component: `VendorDashboard.tsx` |
| 2 | **Create Service** | `POST /services` → Create listing with title, description, price, image upload via Cloudinary. FormData with `multipart/form-data` |
| 3 | **Edit Service** | `PATCH /services/:id` → Update service details/image. Ownership validated server-side |
| 4 | **Delete Service** | `DELETE /services/:id` → Remove listing. Owner-only access enforced |
| 5 | **View My Services** | `GET /services/my` → Fetch vendor's own service listings |
| 6 | **Manage Job Requests** | `GET /bookings/vendor` → View incoming bookings from clients. Component: `JobRequestManager.tsx` |
| 7 | **Update Booking Status** | `PATCH /bookings/:id/status` → Accept, reject, or complete a booking. Ownership or Admin check |
| 8 | **Check Vendor Status** | `GET /vendors/status` → Check application status (NONE/PENDING/APPROVED/REJECTED) |
| 9 | **View Vendor Profile** | `GET /vendors/profile` → Full profile with user info and service listings |

### 10.3 Admin Features

| # | Feature | Implementation Details |
|:---|:---|:---|
| 1 | **Admin Dashboard** | Overview with platform stats (total users, vendors, services, pending). Component: `AdminDashboard.tsx` |
| 2 | **View Pending Vendors** | `GET /admin/vendors/pending` → Lists vendors awaiting approval with user details |
| 3 | **Approve Vendor** | `PATCH /admin/vendors/:id/approve` → Sets status to APPROVED, enables `is_verified` badge |
| 4 | **Reject Vendor** | `PATCH /admin/vendors/:id/reject` → Sets status to REJECTED |
| 5 | **View Approved Vendors** | `GET /admin/vendors/approved` → Lists verified vendors with their services |
| 6 | **Delete Vendor** | `DELETE /admin/vendors/:id` → Removes vendor profile AND all associated services (cascade) |
| 7 | **Delete Any Service** | `DELETE /admin/services/:id` → Remove any marketplace listing |
| 8 | **Platform Statistics** | `GET /admin/stats` → Returns counts: pendingVendors, approvedVendors, totalUsers, totalServices |
| 9 | **Vendor Verification Panel** | Detailed vendor review with modal showing CNIC, city, experience, phone. Component: `VendorVerificationList.tsx` |

### 10.4 Cross-Cutting Features

| # | Feature | Details |
|:---|:---|:---|
| 1 | **JWT Authentication** | Token stored in localStorage, auto-attached via Axios interceptor |
| 2 | **Protected Routes** | `ProtectedRoute` component wraps dashboard pages |
| 3 | **Public-Only Routes** | `PublicOnlyRoute` redirects logged-in users from auth pages |
| 4 | **Role-Based Dashboards** | `DashboardPage` renders different components based on user role |
| 5 | **Toast Notifications** | `react-hot-toast` for success/error feedback |
| 6 | **Responsive Design** | Tailwind CSS with mobile-first approach, glassmorphism effects |
| 7 | **Image Upload** | Cloudinary cloud storage for service images |
| 8 | **CORS Enabled** | Backend allows cross-origin requests for frontend-backend separation |
| 9 | **Announcement Bar** | Top-of-page notification banner. Component: `AnnouncementBar.tsx` |

---

## 11. Deployment & Configuration

### 11.1 Environment Variables

#### Backend (`.env`)
```
DATABASE_URL="postgresql://user:password@host:5432/ekarigar_db?schema=public"
JWT_SECRET="your_jwt_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
ADMIN_EMAIL="admin@ekarigar.com"
ADMIN_PASSWORD="admin_password"
PORT=3000
```

#### Frontend (`.env`)
```
VITE_API_URL="http://localhost:3000"   # Or production backend URL
```

### 11.2 Development Setup

```bash
# Backend
cd e-karigar-backend
npm install
npx prisma migrate dev
npm run start:dev          # Runs on localhost:3000

# Frontend
cd e-karigar-frontend
npm install
npm run dev                # Runs on localhost:5173
```

### 11.3 Production Deployment
- **Backend**: Designed for **Render** deployment (reads `PORT` from environment)
- **Frontend**: Designed for **Vercel** deployment (reads `VITE_API_URL` from environment)
- **Database**: PostgreSQL (cloud-hosted, e.g., Supabase, Neon, Railway)

---

## 12. Future Roadmap

| Feature | Status | Description |
|:---|:---|:---|
| Service Booking & Scheduling | ✅ Implemented | Clients can book services with scheduling |
| Reviews & Ratings System | 📋 Schema Ready | Database schema exists, UI pending |
| Chat System | 📋 Schema Ready | ChatRoom & ChatMessage models defined |
| Payment Integration | ❌ Planned | Payment gateway for service transactions |
| Email Notifications | ❌ Planned | Booking confirmations, vendor approvals |
| Advanced Search & Filters | 🔄 Partial | Basic search implemented, advanced filtering planned |
| Mobile App | ❌ Planned | React Native mobile application |

---

> **Document Generated:** February 16, 2026  
> **Project Repository:** E-Kariger-Web-system-main
