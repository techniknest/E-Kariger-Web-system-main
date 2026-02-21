import { useState } from "react";
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertTriangle, Play, ShieldCheck } from "lucide-react";
import { bookingsApi } from "../../services/api";

interface Booking {
    id: string;
    service: {
        id: string;
        title: string;
        description: string;
        price: number;
    };
    vendor: {
        user: {
            name: string;
        }
    };
    status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'WAITING_APPROVAL' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
    scheduled_date: string;
    total_price: number;
    address: string;
    start_otp?: string;
    final_price?: number;
    is_price_revised?: boolean;
    revision_reason?: string;
}

interface ClientBookingsProps {
    bookings: Booking[];
    onRefresh?: () => void;
}

const ClientBookings = ({ bookings, onRefresh }: ClientBookingsProps) => {
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const handleApproveRevision = async (bookingId: string, approved: boolean) => {
        setActionLoading(bookingId);
        try {
            await bookingsApi.approveRevision(bookingId, approved);
            onRefresh?.();
        } catch (error) {
            alert("Failed to update revision status");
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 flex items-center gap-1"><Clock className="h-3 w-3" /> PENDING</span>;
            case "ACCEPTED":
                return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> ACCEPTED</span>;
            case "IN_PROGRESS":
                return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold border border-blue-200 flex items-center gap-1"><Play className="h-3 w-3" /> IN PROGRESS</span>;
            case "WAITING_APPROVAL":
                return <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> PRICE REVISED</span>;
            case "COMPLETED":
                return <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> COMPLETED</span>;
            case "REJECTED":
                return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-red-200 flex items-center gap-1"><XCircle className="h-3 w-3" /> REJECTED</span>;
            case "CANCELLED":
                return <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 flex items-center gap-1"><XCircle className="h-3 w-3" /> CANCELLED</span>;
            default:
                return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">{status}</span>;
        }
    };

    if (bookings.length === 0) {
        return (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No bookings yet</h3>
                <p className="text-slate-500">Book a service to see it here.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group">

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left: Thumbnail & Main Info */}
                        <div className="flex items-start gap-4 flex-1">
                            <div className="h-24 w-24 rounded-xl bg-slate-100 shrink-0 overflow-hidden relative">
                                <img
                                    src={`https://source.unsplash.com/random/200x200/?repair,worker&sig=${booking.service.id}`}
                                    alt={booking.service.title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    {getStatusBadge(booking.status)}
                                    <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-slate-50 rounded-md">
                                        ID: {booking.id.slice(0, 8)}...
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {booking.service.title}
                                </h3>

                                <div className="text-sm text-slate-500 font-medium">
                                    By {booking.vendor?.user?.name || "Unknown Vendor"}
                                </div>
                            </div>
                        </div>

                        {/* Middle: Details */}
                        <div className="flex-1 space-y-3 py-1 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
                                <span className="text-slate-700 font-medium">
                                    {new Date(booking.scheduled_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
                                <span className="text-slate-700 font-medium">
                                    {new Date(booking.scheduled_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                                <span className="text-slate-700 line-clamp-1">{booking.address}</span>
                            </div>
                        </div>

                        {/* Right: Price & Action */}
                        <div className="flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                            <div className="text-right">
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Total</p>
                                <p className="text-xl font-extrabold text-indigo-600">
                                    Rs. {booking.is_price_revised ? booking.final_price : booking.total_price}
                                </p>
                                {booking.is_price_revised && (
                                    <p className="text-xs text-slate-400 line-through">
                                        Rs. {booking.total_price}
                                    </p>
                                )}
                            </div>

                            {booking.status === 'COMPLETED' && (
                                <button className="text-sm text-indigo-600 font-bold hover:underline">Rate Service</button>
                            )}
                        </div>
                    </div>

                    {/* OTP Badge — visible only when ACCEPTED */}
                    {booking.status === 'ACCEPTED' && booking.start_otp && (
                        <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                            <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-indigo-900">Share this Start Code with the vendor when they arrive</p>
                                <p className="text-xs text-indigo-600 mt-0.5">The vendor needs this code to begin work.</p>
                            </div>
                            <div className="flex gap-1">
                                {booking.start_otp.split('').map((digit, i) => (
                                    <span key={i} className="inline-flex items-center justify-center h-10 w-10 bg-white border-2 border-indigo-300 rounded-lg text-xl font-extrabold text-indigo-700 shadow-sm">
                                        {digit}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Approval UI — visible only when WAITING_APPROVAL */}
                    {booking.status === 'WAITING_APPROVAL' && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl space-y-3">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-orange-900">Vendor updated the price</p>
                                    <p className="text-sm text-orange-800 mt-1">
                                        New Price: <span className="font-bold">Rs. {booking.final_price}</span>
                                        {booking.revision_reason && (
                                            <> — Reason: <span className="italic">{booking.revision_reason}</span></>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 ml-8">
                                <button
                                    onClick={() => handleApproveRevision(booking.id, true)}
                                    disabled={actionLoading === booking.id}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {actionLoading === booking.id ? 'Processing...' : 'Approve Price'}
                                </button>
                                <button
                                    onClick={() => handleApproveRevision(booking.id, false)}
                                    disabled={actionLoading === booking.id}
                                    className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    Reject & Cancel Job
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            ))}
        </div>
    );
};

export default ClientBookings;
