import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Hammer, Star, DollarSign } from "lucide-react";
import api from "../services/api";

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

  // Fetch Services from Public API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // This endpoint must match your Backend Controller
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Navbar --- */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Hammer className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">E-Karigar</span>
        </div>
        
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-gray-600 font-medium hover:text-blue-600 transition">
            Log In
          </Link>
          <Link to="/register" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm">
            Join Now
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <div className="bg-blue-700 py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Find the perfect <span className="text-blue-200">Karigar</span> for your job.
        </h1>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Connect with verified local skilled workers for plumbing, electrical, carpentry, and more.
        </p>
        
        {/* Search Bar Visual Only */}
        <div className="max-w-2xl mx-auto bg-white rounded-full p-2 flex shadow-lg">
          <div className="flex-1 flex items-center px-4 border-r border-gray-200">
            <Search className="h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="What service are you looking for?" 
              className="w-full p-2 outline-none text-gray-700"
            />
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold transition">
            Search
          </button>
        </div>
      </div>

      {/* --- Services Grid --- */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
          Popular Services Near You
        </h2>
        
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading marketplace...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <Hammer className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg font-medium">No services listed yet.</p>
            <p className="text-gray-400">Be the first vendor to add a service!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-xl transition duration-300 overflow-hidden group flex flex-col h-full">
                {/* Image Placeholder */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                   <img 
                     src={`https://source.unsplash.com/random/400x300/?repair,tool,worker&sig=${service.id}`} 
                     alt="Service" 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                   />
                   <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                      {service.vendor.city || "Lahore"}
                   </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  {/* Vendor Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 uppercase">
                      {service.vendor.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{service.vendor.user.name}</p>
                      <div className="flex items-center text-yellow-500 text-xs">
                         <Star className="h-3 w-3 fill-current" /> 
                         <span className="ml-1 text-gray-500">New Vendor</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Title */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                    <div className="text-gray-900 font-bold flex items-center text-lg">
                      <span className="text-xs text-gray-500 font-normal mr-1">STARTING AT</span> 
                      Rs. {service.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;