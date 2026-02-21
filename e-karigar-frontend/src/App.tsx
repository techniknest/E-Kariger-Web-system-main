import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import BecomeVendorPage from "./pages/BecomeVendorPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import DashboardLayoutWrapper from "./layouts/DashboardLayoutWrapper";
import VendorVerificationList from "./components/admin/VendorVerificationList";
import JobRequestManager from "./components/vendor/JobRequestManager";

// Security Wrapper: Checks if token exists before showing protected pages
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Redirect logged-in users away from auth pages
const PublicOnlyRoute = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailsPage />} />

        {/* AUTH ROUTES - Redirect if logged in */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <SignupPage />
            </PublicOnlyRoute>
          }
        />
        {/* Alias for /join */}
        <Route path="/join" element={<Navigate to="/register" replace />} />

        {/* PROTECTED ROUTES */}
        {/* General Dashboard */}
        <Route path="/dashboard" element={<DashboardLayoutWrapper />}>
          <Route index element={<DashboardPage />} />
          <Route path="verification" element={<VendorVerificationList />} />
          <Route path="jobs" element={<JobRequestManager />} />
        </Route>

        {/* Client Dashboard */}
        <Route path="/client" element={<DashboardLayoutWrapper />}>
          <Route index element={<Navigate to="/client/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>

        {/* Vendor Dashboard */}
        <Route path="/vendor" element={<DashboardLayoutWrapper />}>
          <Route index element={<Navigate to="/vendor/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="jobs" element={<JobRequestManager />} />
          <Route path="verification" element={<VendorVerificationList />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<DashboardLayoutWrapper />}>
          <Route index element={<DashboardPage />} />
          <Route path="verification" element={<VendorVerificationList />} />
        </Route>

        <Route
          path="/become-vendor"
          element={
            <ProtectedRoute>
              <BecomeVendorPage />
            </ProtectedRoute>
          }
        />

        {/* 404 - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;