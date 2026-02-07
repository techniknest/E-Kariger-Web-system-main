import { Calendar, MapPin, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface Booking {
    id: string;
    service: {
        id: string;
        title: string;
        description: string;
        price: number;
        vendor: {
            user: {
                name: string;
            }
        }
    };
    status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'REJECTED';
    scheduled_date: string;
    total_price: number;
    address: string;
}

interface ClientBookingsProps {
    bookings: Booking[];
}

const ClientBookings = ({ bookings }: ClientBookingsProps) => {

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 flex items-center gap-1"><Clock className="h-3 w-3" /> PENDING</span>;
            case "ACCEPTED":
                return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> ACCEPTED</span>;
            case "COMPLETED":
                return <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> COMPLETED</span>;
            case "REJECTED":
                return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-red-200 flex items-center gap-1"><XCircle className="h-3 w-3" /> REJECTED</span>;
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
                <div key={booking.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 group">

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
                                By {booking.service.vendor.user.name}
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
                            <p className="text-xl font-extrabold text-indigo-600">Rs. {booking.total_price}</p>
                        </div>

                        {booking.status === 'COMPLETED' && (
                            <button className="text-sm text-indigo-600 font-bold hover:underline">Rate Service</button>
                        )}
                    </div>

                </div>
            ))}
        </div>
    );
};

export default ClientBookings;
