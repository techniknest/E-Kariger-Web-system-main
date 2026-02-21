import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import api from "../../services/api";

// Validation Schema
const schema = yup.object({
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    password: yup.string().required("Password is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post("/auth/login", data);

            // Assuming response.data contains { access_token: string, user: { role: string } }
            // Adjust based on actual API response structure
            const { access_token, user } = response.data;

            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(user));

            // Trigger dynamic UI update
            window.dispatchEvent(new Event("auth-change"));

            // Redirect based on role
            if (user?.role === "ADMIN") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }

        } catch (err: any) {
            console.error("Login failed:", err);
            // Handle axios error response
            const errorMessage = err.response?.data?.message || "Invalid email or password";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-3">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">Welcome back</h2>
                    <p className="mt-1 text-xs text-slate-500">Please enter your details to sign in.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-2 rounded-lg text-xs flex items-center gap-2">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    {/* Email Field */}
                    <div className="space-y-0.5">
                        <label className="text-xs font-medium text-slate-700">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="email"
                                {...register("email")}
                                className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} outline-none focus:ring-2 transition-all`}
                                placeholder="Enter your email"
                            />
                        </div>
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-0.5">
                        <label className="text-xs font-medium text-slate-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                className={`w-full pl-9 pr-9 py-2 text-sm rounded-lg border ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} outline-none focus:ring-2 transition-all`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    {/* Extras */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-xs text-slate-600">Remember for 30 days</span>
                        </label>
                        <Link to="/forgot-password" className="text-xs font-medium text-blue-700 hover:text-blue-800 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white h-10 rounded-lg text-sm font-medium tracking-wide transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Sign In
                    </button>
                </form>

                <p className="text-center text-xs text-slate-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
