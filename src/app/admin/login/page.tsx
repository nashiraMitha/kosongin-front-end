"use client";

import { client } from "@/lib/api-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/section/Navbar";
import Cookies from "js-cookie";
import heyApi from "@/services/heyApi";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react"; // Import icon mata

/* HEY API */
import { postAuthLogin } from "@/api/sdk.gen";

type DecodedToken = {
  id: string;
  role: string;
  exp: number;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State buat show/hide
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const response = await heyApi.adminLogin({
        ...(identifier.includes("@")
          ? { email: identifier }
          : { nickname: identifier }),
        password,
      });

      const accessToken = response.data.data.accessToken;
      const decoded = jwtDecode<DecodedToken>(accessToken);

      if (decoded.role !== "admin") {
        setError("Akun ini bukan admin.");
        return;
      }

      Cookies.set("admin_token", accessToken, { expires: 1 });
      localStorage.setItem("admin_data", JSON.stringify({
        id: decoded.id,
        role: decoded.role,
        identifier,
      }));

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login admin gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4 font-sans">
      <div className="w-full max-w-[420px] bg-[#FFFAF9] p-8 rounded-[32px] shadow-lg border border-gray-100">
        
        <h1 className="text-3xl font-bold text-center mb-2 text-[#06322b]">
          Log in Admin
        </h1>

        <p className="text-gray-500 text-[14px] text-center mb-8">
          Silakan masukkan kredensial admin anda.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* EMAIL / USERNAME */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1A3C34] ml-1">
              Email / Username
            </label>
            <input
              type="text"
              placeholder="Username admin"
              className="w-full border-2 border-gray-200 p-4 rounded-2xl outline-none focus:border-[#90BAB7]"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD DENGAN FITUR SHOW/HIDE */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1A3C34] ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Ganti type dinamis
                placeholder="••••••••"
                className="w-full border-2 border-gray-200 p-4 rounded-2xl outline-none focus:border-[#90BAB7] pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Button Mata */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A3C34] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-4 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#90BAB7] hover:bg-[#7DA7A4] text-white p-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-md"
          >
            {loading ? "Sedang Masuk..." : "Log in"}
          </button>
        </form>
        <div className="flex items-center justify-between mt-8 px-1">
          <div className="text-[11px] text-gray-600"></div>
          <Link href="/login" title="Log in sebagai User">
            <button className="text-[11px] font-bold underline text-black hover:text-[#568F87] transition-colors">
              Login sebagai User
            </button>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}