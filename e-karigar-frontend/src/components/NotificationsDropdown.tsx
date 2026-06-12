import { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, CheckCircle2 } from "lucide-react";
import { notificationsApi } from "../services/api";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    link?: string;
}

export default function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const data = await notificationsApi.getAll();
            setNotifications(data);
            setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await notificationsApi.markAsRead(id);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsApi.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const toggleDropdown = () => {
        const nextIsOpen = !isOpen;
        setIsOpen(nextIsOpen);
        
        if (nextIsOpen && unreadCount > 0) {
            handleMarkAllAsRead();
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden flex flex-col max-h-[85vh]">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-bold text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
                            >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Mark all read
                            </button>
                        )}
                    </div>
                    
                    <div className="overflow-y-auto w-full max-h-[400px]">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                                <Bell className="h-8 w-8 text-slate-300 mb-3" />
                                <p className="text-sm font-medium">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 transition-colors hover:bg-slate-50 ${!notification.is_read ? 'bg-indigo-50/30' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <p className={`text-sm font-semibold truncate ${!notification.is_read ? 'text-slate-900' : 'text-slate-700'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <span className="text-[10px] font-medium text-slate-400 shrink-0 mt-0.5">
                                                        {new Date(notification.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed break-words whitespace-pre-wrap">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            {!notification.is_read && (
                                                <button
                                                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                    className="shrink-0 p-1.5 h-fit rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
