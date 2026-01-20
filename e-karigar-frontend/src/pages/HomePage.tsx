import { useEffect, useState } from "react";
import { Search, MapPin, ArrowRight, Loader2 } from "lucide-react";
import api from "../services/api";
import Navbar from "../components/Navbar";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  vendor: {
    city: string;
    user: {
      name: string;
    };
  };
}

const HomePage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services/public");
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on search query
  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.vendor.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* --- Hero Section --- */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-blue-600">
          {/* Abstract Background */}
          <div className="absolute inset-0 bg-slate-900 opacity-10 pattern-grid-lg"></div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500 opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500 opacity-50 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Master craftmanship, <br className="hidden md:block" />
            <span className="text-blue-200">on demand.</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with verified local experts for plumbing, electrical, carpentry, and more. Quality work, guaranteed.
          </p>

          <div className="max-w-2xl mx-auto glass p-2 rounded-2xl flex items-center shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex-1 flex items-center px-4">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="What service do you need today?"
                className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 h-12 ml-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2">
              Search
            </button>
          </div>

          {/* Quick Categories */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["Plumber", "Electrician", "Carpenter", "Painter", "AC Repair"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSearchQuery(cat)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition backdrop-blur-sm border border-white/10"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Services Grid --- */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {searchQuery ? `Results for "${searchQuery}"` : "Popular Services"}
            </h2>
            <p className="text-slate-500 mt-2">Discover the best rated professionals in your area</p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              Clear Search
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-slate-50 p-4 rounded-full inline-block mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-600 text-lg font-medium">
              {searchQuery ? `No services found for "${searchQuery}"` : "No services listed yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden flex flex-col h-full"
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-slate-200 relative overflow-hidden">
                  <img
                    src={`https://source.unsplash.com/random/400x300/?repair,tool,worker&sig=${service.id}`}
                    alt="Service"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 text-slate-700">
                    <MapPin className="h-3 w-3 text-indigo-500" />
                    {service.vendor.city || "Lahore"}
                  </div>
                </div >

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                      {service.vendor.user.name.charAt(0)}
                    </div>
                    <span className="text-sm text-slate-500 font-medium">{service.vendor.user.name}</span>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-grow leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Starting at</span>
                      <div className="text-lg font-bold text-slate-900">Rs. {service.price}</div>
                    </div>
                    <button className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div >
            ))}
          </div >
        )}
      </div >

      {/* Footer */}
      < footer className="bg-slate-900 text-slate-400 py-12 px-6" >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-xl mb-1">E-Karigar</p>
            <p className="text-sm">Connecting pakistan with quality craftsmanship.</p>
          </div>
          <div className="text-sm">
            © 2026 E-Karigar Inc. All rights reserved.
          </div>
        </div>
      </footer >
    </div >
  );
};

export default HomePage;