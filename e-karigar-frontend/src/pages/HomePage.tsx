import { useEffect, useState } from "react";
import { Search, Star, MapPin, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* --- Hero Section --- */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-20 px-6 text-center text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-white transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute left-0 bottom-0 w-64 h-64 rounded-full bg-white transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
            Find the perfect <span className="text-blue-200">Karigar</span> for your job.
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Connect with verified local skilled workers for plumbing, electrical, carpentry, and more.
          </p>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-2 flex shadow-2xl">
            <div className="flex-1 flex items-center px-4">
              <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="What service are you looking for?"
                className="w-full p-3 outline-none text-gray-700 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2">
              Search
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Categories */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["Plumber", "Electrician", "Carpenter", "Painter", "AC Repair"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSearchQuery(cat)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition backdrop-blur-sm"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Services Grid --- */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {searchQuery ? `Results for "${searchQuery}"` : "Popular Services Near You"}
          </h2>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Clear Search
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {searchQuery ? `No services found for "${searchQuery}"` : "No services listed yet."}
            </p>
            <p className="text-gray-400 mt-1">
              {searchQuery ? "Try a different search term" : "Be the first vendor to add a service!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden group flex flex-col h-full cursor-pointer"
                onClick={() => {/* TODO: Navigate to service detail */ }}
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                  <img
                    src={`https://source.unsplash.com/random/400x300/?repair,tool,worker&sig=${service.id}`}
                    alt="Service"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-blue-600" />
                    {service.vendor.city || "Lahore"}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  {/* Vendor Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white uppercase shadow-md">
                      {service.vendor.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{service.vendor.user.name}</p>
                      <div className="flex items-center text-yellow-500 text-xs">
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current text-gray-300" />
                        <span className="ml-1 text-gray-500">New</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Title */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                    <div>
                      <span className="text-xs text-gray-500 block">STARTING AT</span>
                      <span className="text-xl font-bold text-gray-900">Rs. {service.price}</span>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg font-semibold text-white mb-2">E-Karigar</p>
          <p className="text-sm">Connecting skilled workers with clients across Pakistan</p>
          <p className="text-xs mt-4">© 2026 E-Karigar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;