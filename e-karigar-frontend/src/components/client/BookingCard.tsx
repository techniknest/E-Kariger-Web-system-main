import React from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ShieldCheck,
  Star,
  X
} from "lucide-react";

export interface Booking {
  id: string;
  service: { id: string; title: string; description: string; price: number };
  vendor: { user: { name: string } };
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'WAITING_APPROVAL' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  scheduled_date: string;
  total_price: number;
  address: string;
  start_otp?: string;
  final_price?: number;
  is_price_revised?: boolean;
  revision_reason?: string;
  review?: { id: string; rating: number; comment?: string } | null;
}

interface BookingCardProps {
  booking: Booking;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  onRate?: (booking: Booking) => void;
  actionLoading?: boolean;
}

const BookingCard = ({ booking, onApprove, onReject, onCancel, onRate, actionLoading = false }: BookingCardProps) => {
  const displayPrice = booking.is_price_revised ? booking.final_price : booking.total_price;

  // Render Status Badge based on blueprint
  const renderBadge = () => {
    switch (booking.status) {
      case "PENDING":
        return <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wider"><Clock className="h-3 w-3" /> Pending</span>;
      case "ACCEPTED":
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wider"><CheckCircle className="h-3 w-3" /> Accepted</span>;
      case "IN_PROGRESS":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wider animate-pulse"><Play className="h-3 w-3" /> In Progress</span>;
      case "WAITING_APPROVAL":
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wider"><AlertTriangle className="h-3 w-3" /> Price Revised</span>;
      case "COMPLETED":
        return <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wider"><CheckCircle className="h-3 w-3" /> Completed</span>;
      case "REJECTED":
      case "CANCELLED":
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wider"><XCircle className="h-3 w-3" /> {booking.status}</span>;
      default:
        return null;
    }
  };

  const getBorderColor = () => {
    if (booking.status === "IN_PROGRESS") return "border-emerald-300 ring-1 ring-emerald-100";
    if (booking.status === "WAITING_APPROVAL") return "border-amber-300 ring-1 ring-amber-100";
    return "border-slate-200";
  };

  return (
    <div className={`bg-white p-5 rounded-2xl border ${getBorderColor()} shadow-sm hover:shadow-md transition-all flex flex-col gap-5`}>
      {/* Top Row: Status + Booking ID */}
      <div className="flex items-center justify-between">
        {renderBadge()}
        <span className="text-[11px] text-slate-400 font-mono font-medium uppercase tracking-widest">Job #{booking.id.slice(0, 8)}</span>
      </div>

      {/* Middle Row: Details */}
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight leading-snug">{booking.service.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Provided by <span className="text-indigo-700">{booking.vendor?.user?.name || "Professional"}</span></p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Date & Time</p>
                <p className="font-semibold">{new Date(booking.scheduled_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(booking.scheduled_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Location</p>
                <p className="font-semibold truncate">{booking.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Box */}
        <div className="sm:w-32 bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Total Amount</p>
          <p className="text-lg font-black text-slate-900 leading-none">Rs. {Number(displayPrice).toLocaleString()}</p>
          {booking.is_price_revised && (
            <p className="text-[10px] text-slate-400 line-through font-medium mt-1">Rs. {Number(booking.total_price).toLocaleString()}</p>
          )}
        </div>
      </div>

      {/* Dynamic Action Zones */}
      <div className="pt-2">
        {/* PENDING State */}
        {booking.status === 'PENDING' && (
          <div className="flex justify-end">
             <button
                onClick={() => onCancel && onCancel(booking.id)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-all"
             >
                <X className="h-3.5 w-3.5" /> Cancel Request
             </button>
          </div>
        )}

        {/* ACCEPTED State (OTP) */}
        {booking.status === 'ACCEPTED' && booking.start_otp && (
          <div className="flex items-center gap-4 bg-[#0F172A] border border-slate-800 p-4 rounded-xl shadow-xl">
            <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
                <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-white font-bold uppercase tracking-wide">Secure Start Code</p>
              <p className="text-[10px] text-slate-400 font-medium">Show this code to the vendor upon arrival to begin work.</p>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
               <span className="font-mono text-xl font-black tracking-[0.2em] text-white">
                 {booking.start_otp}
               </span>
            </div>
          </div>
        )}

        {/* IN PROGRESS State */}
        {booking.status === 'IN_PROGRESS' && (
           <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 font-bold text-sm">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               Vendor is currently working
           </div>
        )}

        {/* WAITING APPROVAL State (Price Revision) */}
        {booking.status === 'WAITING_APPROVAL' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-4">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-amber-100">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                    <h5 className="text-sm font-bold text-amber-900">Price Revision Request</h5>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                        The vendor has updated the price to <span className="font-bold">Rs. {booking.final_price}</span>. 
                        {booking.revision_reason && <> Reason: <span className="font-medium italic">"{booking.revision_reason}"</span></>}
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onApprove?.(booking.id)}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
              >
                Approve New Price
              </button>
              <button
                onClick={() => onReject?.(booking.id)}
                disabled={actionLoading}
                className="py-2.5 px-6 bg-white text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-50 transition-all disabled:opacity-50"
              >
                Reject & Cancel Job
              </button>
            </div>
          </div>
        )}

        {/* COMPLETED State (Rating) */}
        {booking.status === 'COMPLETED' && (
          <div className="flex items-center justify-end py-1">
            {booking.review ? (
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wide">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < booking.review!.rating ? 'fill-amber-500' : 'fill-slate-200 text-slate-200'}`} />
                ))}
                <span className="ml-1 text-slate-600">{booking.review.rating}/5 Rated</span>
              </div>
            ) : (
                <button
                   onClick={() => onRate?.(booking)}
                   className="bg-indigo-700 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-indigo-800 transition-all flex items-center gap-2 shadow-sm"
               >
                   <Star className="h-3.5 w-3.5 fill-white" /> Rate Now
               </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
