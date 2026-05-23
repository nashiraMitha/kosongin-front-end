"use client";

import Navbar from "@/components/section/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { postAuthLogin } from "@/api";
import { client } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem("user_session");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  // Fungsi Login Cepat sebagai Admin (Sesuai Desain Figma)
  const handleAdminQuickLogin = () => {
    setEmail("admin@kosongin.com");
    setPassword("password123");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });
    
    if (!email) {
      setErrors(prev => ({ ...prev, email: "Email wajib diisi." }));
      return;
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: "Password wajib diisi." }));
      return;
    }

    setIsLoading(true);

    try {
      // Deteksi apakah input adalah email atau nickname
      const isEmail = email.includes("@");
      const loginBody = isEmail 
        ? { email: email, password: password }
        : { nickname: email, password: password };

      const { data, error } = await postAuthLogin({
        client,
        body: loginBody,
      });

      if (error) {
        // Handle error dari validation middleware (400)
        const errorData = error as any;
        let errorMsg = errorData.message || "Login gagal.";
        
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMsg = errorData.errors.map((e: any) => e.message).join(", ");
        }
        
        setErrors(prev => ({ ...prev, general: errorMsg }));
        setIsLoading(false);
        return;
      }

      if (data?.success) {
        localStorage.setItem("user_session", "true");
        if (data.data?.accessToken) {
          localStorage.setItem("accessToken", data.data.accessToken);
        }
        if (data.data?.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }
        
        // Cek jika admin (berdasarkan email dummy atau role dari token jika tersedia)
        if (email === "admin@kosongin.com") {
          localStorage.setItem("user_name", "Admin Kosongin");
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, general: "Terjadi kesalahan pada server." }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f3] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 bg-white rounded-[32px] shadow-sm border-none">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-black">Log in</h1>
            <p className="text-gray-600 text-sm px-4 leading-relaxed">
              Please enter your email and password to log in to your account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm italic">
                {errors.general}
              </div>
            )}

            <div className="space-y-2 text-left">
              <label className="text-sm font-bold ml-1 text-[#1A3C34]">Email/Username</label>
              <Input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com" 
                disabled={isLoading}
                className={`rounded-xl py-6 ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && <p className="text-red-500 text-[10px] italic">{errors.email}</p>}
            </div>
            
            <div className="space-y-2 text-left">
              <label className="text-sm font-bold ml-1 text-[#1A3C34]">Password</label>
              <div className="relative">
                <Input 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  disabled={isLoading}
                  className={`rounded-xl py-6 pr-12 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] italic">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 accent-[#568F87]" />
                Remember me
              </label>
              <Link href="/forgot-password" title="Lupa password?" className="font-bold underline text-black hover:text-[#568F87]">
                Lupa password?
              </Link>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#9bbab1] hover:bg-[#8aa79e] text-white font-bold py-7 rounded-xl text-lg border-none shadow-sm flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Log in"}
            </Button>
          </form>

          {/* FOOTER LOGIN (SESUAI FIGMA) */}
          <div className="flex items-center justify-between mt-8 px-1">
            <p className="text-[11px] text-gray-600">
              Belum punya akun?{" "}
              <Link href="/register" className="font-bold underline text-black">
                Daftar
              </Link>
            </p>
            
            <Link href="/admin/login" title="Log in sebagai Admin">
              <button 
                onClick={handleAdminQuickLogin}
                className="text-[11px] font-bold underline text-black hover:text-[#568F87] transition-colors"
              >
                Log in sebagai Admin
              </button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}