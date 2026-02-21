import { Outlet, Navigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const DashboardLayoutWrapper = () => {
    // Get user from local storage
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
        localStorage.removeItem("token"); // Prevent infinite loop
        return <Navigate to="/login" replace />;
    }

    return (
        <DashboardLayout user={user}>
            <Outlet />
        </DashboardLayout>
    );
};

export default DashboardLayoutWrapper;
