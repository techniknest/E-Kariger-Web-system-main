import { MessageSquare } from "lucide-react";

const ClientMessagesPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
            <div className="h-24 w-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 border border-indigo-100">
                <MessageSquare className="h-10 w-10 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Messages Coming Soon</h1>
            <p className="text-sm text-slate-500 font-medium text-center max-w-md">
                We're currently building a secure chat system so you can communicate directly with professionals without leaving the platform.
            </p>
        </div>
    );
};

export default ClientMessagesPage;
