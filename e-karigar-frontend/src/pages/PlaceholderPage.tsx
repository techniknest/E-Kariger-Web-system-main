import { Construction } from "lucide-react";
import { useLocation } from "react-router-dom";

const PlaceholderPage = () => {
    const location = useLocation();
    const pathName = location.pathname.split("/").pop() || "Page";
    const title = pathName.charAt(0).toUpperCase() + pathName.slice(1);

    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
                <Construction className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
            <p className="text-slate-500 max-w-md mx-auto">
                This page is currently under construction. Check back later for updates!
            </p>
        </div>
    );
};

export default PlaceholderPage;
