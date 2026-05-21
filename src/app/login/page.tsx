"use client";

import Navbar from "@/components/section/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  useEffect(() => {
    localStorage.removeItem("user_session");
  }, []);

  // Fungsi Login Cepat sebagai Admin (Sesuai Desain Figma)
  const handleAdminQuickLogin = () => {
    setEmail("admin@kosongin.com");
    setPassword("password123");
    // Opsional: Langsung trigger login setelah set state
    // Namun lebih baik user klik tombol 'Log in' secara manual agar flow terlihat natural
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;
    const newErrors = { email: "", password: "" };

    const registeredEmail = localStorage.getItem("user_email");
    const registeredPassword = localStorage.getItem("user_password");
    
    // Akun Admin Dummy
    const adminEmail = "admin@kosongin.com";
    const adminPassword = "password123";

    // Validasi Email
    if (!email) {
      newErrors.email = "Email wajib diisi.";
      hasError = true;
    } else if (email !== registeredEmail && email !== adminEmail) {
      newErrors.email = "Akun tidak ditemukan.";
      hasError = true;
    }

    // Validasi Password
    if (!password) {
      newErrors.password = "Password wajib diisi.";
      hasError = true;
    } else {
      const targetPass = email === adminEmail ? adminPassword : registeredPassword;
      if (password !== targetPass) {
        newErrors.password = "Password salah.";
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
    } else {
      if (email === adminEmail) localStorage.setItem("user_name", "Admin Kosongin");
      localStorage.setItem("user_session", "true");
      router.push("/dashboard"); 
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
            <div className="space-y-2 text-left">
              <label className="text-sm font-bold ml-1 text-[#1A3C34]">Email/Username</label>
              <Input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com" 
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
                  className={`rounded-xl py-6 pr-12 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
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

            <Button type="submit" className="w-full bg-[#9bbab1] hover:bg-[#8aa79e] text-white font-bold py-7 rounded-xl text-lg border-none shadow-sm">
              Log in
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