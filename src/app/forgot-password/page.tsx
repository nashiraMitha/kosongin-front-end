"use client";

import Navbar from "@/components/section/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  // Fungsi untuk menangani navigasi tombol kembali
  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f3] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          
          {/* Tombol Kembali dengan SVG Manual */}
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 mb-6 text-black font-bold hover:opacity-70 transition-all active:scale-95"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Kembali
          </button>

          <Card className="p-10 bg-white rounded-[32px] shadow-sm border-none text-center">
            
            {/* TAHAP 1: INPUT EMAIL (Image_4ca41b - Bagian 1) */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-heading text-3xl font-bold mb-3 text-black leading-tight">Forgot Password</h1>
                  <p className="text-gray-600 text-sm leading-relaxed px-2">
                    Masukkan email atau username yang terdaftar, kami akan mengirimkan tautan untuk mengatur ulang password-mu.
                  </p>
                </div>
                <div className="text-left space-y-2">
                  <label className="text-sm font-bold ml-1">Email atau Username</label>
                  <Input 
                    type="text"
                    placeholder="example@gmail.com" 
                    className="rounded-xl py-6 border-gray-300 text-black focus:border-[#568F87]" 
                  />
                </div>
                <Button 
                  onClick={() => setStep(2)}
                  className="w-full bg-[#568F87] hover:bg-[#4a7a73] text-white font-bold py-7 rounded-xl text-lg mt-4 shadow-sm"
                >
                  Kirim link reset
                </Button>
              </div>
            )}

            {/* TAHAP 2: CEK EMAIL (Image_4ca41b - Bagian 2) */}
            {step === 2 && (
              <div className="space-y-8 py-4">
                <div>
                  <h1 className="font-heading text-3xl font-bold mb-4 text-black">Cek email kamu</h1>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Tautan untuk reset password ke <br />
                    <span className="font-bold text-black italic">jonat_pengguna@gmail.com</span> telah dikirim.
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Belum terima email?{" "}
                  <button 
                    onClick={() => setStep(3)} 
                    className="font-bold underline text-[#568F87] hover:text-[#4a7a73] transition-colors"
                  >
                    Kirim ulang
                  </button>
                </p>
              </div>
            )}

            {/* TAHAP 3: BUAT PASSWORD BARU (Image_4ca41b - Bagian 3) */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-heading text-3xl font-bold mb-3 text-black leading-tight">Buat Password Baru</h1>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Kata sandi minimal terdiri dari 8 karakter dan harus mengandung huruf kapital, angka, serta simbol.
                  </p>
                </div>
                <div className="text-left space-y-2">
                  <label className="text-sm font-bold ml-1">Password baru</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="rounded-xl py-6 border-gray-300 text-black focus:border-[#568F87]" 
                  />
                </div>
                <Button 
                  onClick={() => router.push('/login')}
                  className="w-full bg-[#568F87] hover:bg-[#4a7a73] text-white font-bold py-7 rounded-xl text-lg mt-4 shadow-sm"
                >
                  Simpan password
                </Button>
              </div>
            )}

          </Card>
        </div>
      </main>
    </div>
  );
}