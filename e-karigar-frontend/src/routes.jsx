import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Skeleton from './components/Skeleton';
import { RequireRole } from './utils/rbac';

// Public
const Landing       = lazy(() => import('./pages/public/Landing'));
const VendorProfile = lazy(() => import('./pages/public/VendorProfile'));
const Categories    = lazy(() => import('./pages/public/Categories'));  // NEW
const Category      = lazy(() => import('./pages/public/Category'));    // NEW

// Auth
const Login         = lazy(() => import('./pages/auth/Login'));
const Register      = lazy(() => import('./pages/auth/Register'));

// Client
const C_Dashboard     = lazy(() => import('./pages/client/Dashboard'));
const C_Search        = lazy(() => import('./pages/client/Search'));
const C_BookingWizard = lazy(() => import('./pages/client/BookingWizard'));
const C_BookingStatus = lazy(() => import('./pages/client/BookingStatus'));
const C_Review        = lazy(() => import('./pages/client/Review'));

// Vendor
const V_Dashboard     = lazy(() => import('./pages/vendor/Dashboard'));
const V_Services      = lazy(() => import('./pages/vendor/Services'));
const V_Bookings      = lazy(() => import('./pages/vendor/Bookings'));
const V_Earnings      = lazy(() => import('./pages/vendor/Earnings'));
const V_Chat          = lazy(() => import('./pages/vendor/Chat'));

// Admin
const A_Dashboard     = lazy(() => import('./pages/admin/Dashboard'));
const A_Approvals     = lazy(() => import('./pages/admin/Approvals'));
const A_BookingCtrl   = lazy(() => import('./pages/admin/BookingControl'));
const A_Analytics     = lazy(() => import('./pages/admin/Analytics'));
const A_Settings      = lazy(() => import('./pages/admin/Settings'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Skeleton lines={8} />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/vendors/:vendorId" element={<VendorProfile />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:name" element={<Category />} />

        {/* Auth */}
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        {/* Client */}
        <Route path="/client" element={<RequireRole role="client"><C_Dashboard/></RequireRole>} />
        <Route path="/client/search" element={<RequireRole role="client"><C_Search/></RequireRole>} />
        <Route path="/client/booking" element={<RequireRole role="client"><C_BookingWizard/></RequireRole>} />
        <Route path="/client/bookings/:bookingId" element={<RequireRole role="client"><C_BookingStatus/></RequireRole>} />
        <Route path="/client/review/:bookingId" element={<RequireRole role="client"><C_Review/></RequireRole>} />

        {/* Vendor */}
        <Route path="/vendor" element={<RequireRole role="vendor"><V_Dashboard/></RequireRole>} />
        <Route path="/vendor/services" element={<RequireRole role="vendor"><V_Services/></RequireRole>} />
        <Route path="/vendor/bookings" element={<RequireRole role="vendor"><V_Bookings/></RequireRole>} />
        <Route path="/vendor/earnings" element={<RequireRole role="vendor"><V_Earnings/></RequireRole>} />
        <Route path="/vendor/chat" element={<RequireRole role="vendor"><V_Chat/></RequireRole>} />

        {/* Admin */}
        <Route path="/admin" element={<RequireRole role="admin"><A_Dashboard/></RequireRole>} />
        <Route path="/admin/approvals" element={<RequireRole role="admin"><A_Approvals/></RequireRole>} />
        <Route path="/admin/bookings" element={<RequireRole role="admin"><A_BookingCtrl/></RequireRole>} />
        <Route path="/admin/analytics" element={<RequireRole role="admin"><A_Analytics/></RequireRole>} />
        <Route path="/admin/settings" element={<RequireRole role="admin"><A_Settings/></RequireRole>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
``