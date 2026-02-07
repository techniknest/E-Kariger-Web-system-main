import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  X,
  Check,
  Loader2,
  Briefcase,
  User
} from "lucide-react";
import { bookingsApi } from "../../services/api";

const JobRequestManager = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Mock Profile Strength (In a real app, calculate based on profile completeness)
  const profileStrength = 85;

  const fetchBookings = async () => {
    try {
      const data = await bookingsApi.getVendorBookings();
      // Filter for active/pending jobs or show all sorted by date
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await bookingsApi.updateStatus(id, status);
      // Optimistic update or refresh
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">PENDING APPROVAL</span>;
      case "ACCEPTED":
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">IN PROGRESS</span>;
      case "COMPLETED":
        return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">COMPLETED</span>;
      case "REJECTED":
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">REJECTED</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Top Section: Header & Profile Strength */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Header */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">Job Requests</h1>
          <p className="text-slate-500 mt-1">Manage incoming jobs and track your ongoing work.</p>
        </div>

        {/* Profile Strength Widget */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 min-w-[300px]">
          <div className="relative h-12 w-12 flex items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90 text-slate-100" viewBox="0 0 36 36">
              <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="text-emerald-500 transition-all duration-1000 ease-out" strokeDasharray={`${profileStrength}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
            <span className="text-xs font-bold text-slate-900">{profileStrength}%</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-800">Profile Strength</h4>
            <p className="text-xs text-slate-500">Complete your profile to get more jobs</p>
          </div>
          <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800">Improve</button>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full group">

            {/* Card Header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <Briefcase className="h-5 w-5 text-indigo-600" />
                </div>
                {getStatusBadge(booking.status)}
              </div>
              <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {booking.service.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <User className="h-3.5 w-3.5" />
                {booking.client.name}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 space-y-4">

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Scheduled Date</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(booking.scheduled_date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(booking.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Problem</p>
                  <p className="text-sm text-slate-700 line-clamp-2">
                    {booking.problem_description}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Location</p>
                  <p className="text-sm text-slate-700 line-clamp-1">
                    {booking.address}
                  </p>
                </div>
              </div>

            </div>

            {/* Card Footer (Actions) */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              {booking.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                    disabled={actionLoading === booking.id}
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-red-600 font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'ACCEPTED')}
                    disabled={actionLoading === booking.id}
                    className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {actionLoading === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Accept
                  </button>
                </>
              )}

              {booking.status === 'ACCEPTED' && (
                <button
                  onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                  disabled={actionLoading === booking.id}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {actionLoading === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  Mark as Completed
                </button>
              )}

              {(booking.status === 'COMPLETED' || booking.status === 'REJECTED') && (
                <button disabled className="w-full py-2 px-3 rounded-lg bg-slate-100 text-slate-400 font-medium text-sm cursor-not-allowed">
                  {booking.status === 'COMPLETED' ? 'Job Completed' : 'Job Rejected'}
                </button>
              )}
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Briefcase className="h-10 w-10 mx-auto text-slate-300 mb-2" />
            <p className="text-slate-500">No job requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRequestManager;
