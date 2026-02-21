import { X } from "lucide-react";
import { useState } from "react";

const AnnouncementBar = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-slate-900 h-10 flex items-center justify-center px-4 relative z-50">
            <p className="text-white text-xs sm:text-sm font-medium text-center truncate">
                Welcome to E-Karigar: The ultimate platform for finding skilled professionals.
            </p>
            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-4 text-slate-400 hover:text-white transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default AnnouncementBar;
