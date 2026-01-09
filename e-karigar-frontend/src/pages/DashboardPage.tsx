import { useNavigate } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard";

const DashboardPage = () => {
  const navigate = useNavigate();
  // Get user from local storage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-blue-600">E-Karigar</h1>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
            {user.role} PANEL
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hello, <b>{user.name}</b></span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Conditional Rendering based on Role */}
        {user.role === "ADMIN" && <AdminDashboard />}
        
        {user.role === "VENDOR" && (
          <div className="p-8 bg-white rounded-lg shadow text-center">
            <h2 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h2>
            <p className="mt-2 text-gray-600">Manage your services and bookings here.</p>
            {/* We will build this in Phase 5 */}
          </div>
        )}

        {user.role === "CLIENT" && (
          <div className="p-8 bg-white rounded-lg shadow text-center">
            <h2 className="text-2xl font-bold text-gray-800">Client Dashboard</h2>
            <p className="mt-2 text-gray-600">Find services and manage your bookings here.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;