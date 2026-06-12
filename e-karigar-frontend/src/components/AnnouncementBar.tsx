import { X, Sparkles } from "lucide-react";
import { useState } from "react";

const AnnouncementBar = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-indigo-600 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] h-10 flex items-center justify-center px-4 relative z-50">
            <div className="flex items-center gap-2 text-indigo-50">
                <Sparkles className="h-4 w-4 text-indigo-200" />
                <p className="text-xs sm:text-sm font-semibold text-center truncate tracking-wide">
                    Welcome to E-Karigar: The ultimate platform for finding skilled professionals.
                </p>
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-4 text-indigo-200 hover:text-white transition-colors"
                aria-label="Close announcement"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default AnnouncementBar;
