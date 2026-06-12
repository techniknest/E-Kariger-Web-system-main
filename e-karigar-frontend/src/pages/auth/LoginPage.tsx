import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import api from "../../services/api";

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
            const { access_token, user } = response.data;
            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(user));
            window.dispatchEvent(new Event("auth-change"));
            if (user?.role === "ADMIN") navigate("/dashboard");
            else navigate("/");
        } catch (err: any) {
            console.error("Login failed:", err);
            const errorMessage = err.response?.data?.message || "Invalid email or password";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
                    <p className="mt-1.5 text-sm text-slate-500 font-medium">Please enter your details to sign in.</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-200/60 text-rose-600 p-3 rounded-xl text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                                type="email"
                                {...register("email")}
                                className="input-field pl-10"
                                placeholder="name@example.com"
                            />
                        </div>
                        {errors.email && <p className="text-xs font-semibold text-rose-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                className="input-field pl-10 pr-10"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs font-semibold text-rose-500">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-600 focus:ring-indigo-500 cursor-pointer" />
                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full mt-2"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in to account"}
                    </button>
                </form>

                <div className="pt-2 text-center text-sm font-medium text-slate-500">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                        Sign up
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
