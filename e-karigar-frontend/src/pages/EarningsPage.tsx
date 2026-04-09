import { useQuery } from "@tanstack/react-query";
import { TrendingUp, CheckCircle, Loader2, Calendar, DollarSign } from "lucide-react";
import { bookingsApi } from "../services/api";

const EarningsPage = () => {
  const { data: bookings = [], isLoading } = useQuery<any[]>({
    queryKey: ["vendorBookings"],
    queryFn: () => bookingsApi.getVendorBookings(),
  });

  const completedBookings = bookings
    .filter((b) => b.status === "COMPLETED")
    .sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime());

  const totalEarnings = completedBookings.reduce((sum, b) => sum + Number(b.final_price || b.total_price), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 text-blue-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Header ──────────────────────────────────────────────── */}
      <div>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">Earnings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Overview of your completed jobs and revenue.</p>
      </div>

      {/* ─── Summary Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Earnings</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">Rs. {totalEarnings.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Completed Jobs</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{completedBookings.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Earnings Table ──────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Earnings History</h3>
          <p className="text-xs text-slate-500 mt-0.5">All completed jobs sorted by most recent.</p>
        </div>

        {completedBookings.length === 0 ? (
          <div className="p-12 text-center">
            <DollarSign className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-500 font-medium">No earnings yet.</p>
            <p className="text-xs text-slate-400 mt-0.5">Complete your first job to see earnings here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs text-slate-700">
                          {new Date(booking.scheduled_date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-medium text-slate-900">{booking.service.title}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-slate-600">{booking.client?.name || "Unknown"}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-xs font-bold text-emerald-700">
                        Rs. {Number(booking.final_price || booking.total_price).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsPage;
