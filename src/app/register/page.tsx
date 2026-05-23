"use client";

import Navbar from "@/components/section/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Import icons
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { postAuthRegister } from "@/api";
import { client } from "@/lib/api-client";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  // State untuk toggle lihat password
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ name: "", nickname: "", email: "", password: "", confirmPassword: "", general: "" });
    
    let hasError = false;
    const newErrors = { ...errors };

    if (formData.name.length < 2) {
      newErrors.name = "Nama lengkap harus diisi.";
      hasError = true;
    }

    if (formData.nickname.length < 3) {
      newErrors.nickname = "Nickname minimal 3 karakter.";
      hasError = true;
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Format email tidak valid.";
      hasError = true;
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter.";
      hasError = true;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak cocok.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await postAuthRegister({
        client,
        body: {
          fullname: formData.name,
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password,
          passwordConfirmation: formData.confirmPassword,
        },
      });

      if (error) {
        // Handle error dari validation middleware (400) atau 409 (Conflict)
        const errorData = error as any;
        let errorMsg = errorData.message || "Registrasi gagal.";
        
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMsg = errorData.errors.map((e: any) => e.message).join(", ");
        }
        
        setErrors(prev => ({ ...prev, general: errorMsg }));
        setIsLoading(false);
        return;
      }

      if (data?.success) {
        // Berhasil registrasi, arahkan ke login
        router.push("/login");
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
            <h1 className="text-4xl font-bold mb-2 text-black">Sign Up</h1>
            <p className="text-gray-600 text-sm leading-relaxed px-4">
              Please enter your details to create an account.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm italic">
                {errors.general}
              </div>
            )}

            {/* Nama Lengkap */}
            <div className="space-y-2 text-left">
              <label className="text-sm font-bold ml-1 text-[#1A3C34]">Nama Lengkap</label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Your Name" 
                disabled={isLoading}
                className={`rounded-xl py-6 ${errors.name ? "border-red-500 bg-red-50/30" : "border-gray-300 focus:border-[#568F87]"}`}
              />
              {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-1 italic font-medium">{errors.name}</p>}
            </div>

            {/* Nickname */}
            <div className="space-y-2 text-left">
              <label className="text-sm font-bold ml-1 text-[#1A3C34]">Nickname</label>
              <Input 
                value={formData.nickname}
                onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                placeholder="Your Nickname" 
                disabled={isLoading}
                className={`rounded-xl py-6 ${errors.nickname ? "border-red-500 bg-red-50/30" : "border-gray-300 focus:border-[#568F87]"}`}
              />
              {errors.nickname && <p className="text-red-500 text-[10px] mt-1 ml-1 italic font-medium">{errors.nickname}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2 text-left">
              <label className="text-sm font-bold ml-1 text-[#1A3C34]">Email</label>
              <Input 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                type="email" 
                placeholder="example@gmail.com" 
                disabled={isLoading}
                className={`rounded-xl py-6 ${errors.email ? "border-red-500 bg-red-50/30" : "border-gray-300 focus:border-[#568F87]"}`}
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1 italic font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2 text-left">
              <label className="text-sm font-bold ml-1 text-[#1A3C34]">Password</label>
              <div className="relative">
                <Input 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  type={showPass ? "text" : "password"} 
                  placeholder="••••••••" 
                  disabled={isLoading}
                  className={`rounded-xl py-6 pr-12 ${errors.password ? "border-red-500 bg-red-50/30" : "border-gray-300 focus:border-[#568F87]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#568F87]"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-1 italic font-medium">{errors.password}</p>}
            </div>

            {/* Konfirmasi Password */}
            <div className="space-y-2 text-left">
              <label className="text-sm font-bold ml-1 text-[#1A3C34]">Konfirmasi Password</label>
              <div className="relative">
                <Input 
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  type={showConfirmPass ? "text" : "password"} 
                  placeholder="••••••••" 
                  disabled={isLoading}
                  className={`rounded-xl py-6 pr-12 ${errors.confirmPassword ? "border-red-500 bg-red-50/30" : "border-gray-300 focus:border-[#568F87]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#568F87]"
                >
                  {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 ml-1 italic font-medium">{errors.confirmPassword}</p>}
            </div>

            {/* Checkbox Section */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 accent-[#568F87]" />
                <span>Remember me</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-gray-600 leading-tight">
                <input type="checkbox" className="mt-0.5 rounded border-gray-300 accent-[#568F87]" />
                <span>Saya bersedia menerima email pengingat harian untuk mencatat konsumsi.</span>
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#568F87] hover:bg-[#4a7a73] text-white font-bold py-7 rounded-xl text-lg transition-all active:scale-95 shadow-md border-none flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Register"}
            </Button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-bold underline text-[#568F87] hover:opacity-80">
              Log in
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}