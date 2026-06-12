import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import api from "../../services/api";

const schema = yup.object({
    name: yup.string().required("Full Name is required").min(3, "Must be at least 3 characters"),
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
}).required();

type FormData = yup.InferType<typeof schema>;

const SignupPage = () => {
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
            const response = await api.post("/auth/register", data);
            const { access_token, user } = response.data;
            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/");
        } catch (err: any) {
            console.error("Signup failed:", err);
            const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h2>
                    <p className="mt-1.5 text-sm text-slate-500 font-medium">Start your journey with E-Karigar today.</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-200/60 text-rose-600 p-3 rounded-xl text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                {...register("name")}
                                className="input-field pl-10"
                                placeholder="Adnan Ali"
                            />
                        </div>
                        {errors.name && <p className="text-xs font-semibold text-rose-500">{errors.name.message}</p>}
                    </div>

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
                                placeholder="Min 8 characters"
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full mt-4"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create account"}
                    </button>
                </form>

                <div className="pt-2 text-center text-sm font-medium text-slate-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                        Log in
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};

export default SignupPage;
