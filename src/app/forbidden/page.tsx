"use client";

import LoginNavbar from "@/components/section/LoginNavbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fefefe] flex flex-col font-sans overflow-hidden">
      <LoginNavbar />

      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Glow background pink lembut */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-50/50 blur-[100px] rounded-full -z-10"></div>

        <Card className="w-full max-w-xl p-10 md:p-16 bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center text-center">
          
          {/* Angka 403 dengan Font Fraunces */}
          <h1 className="font-heading text-[120px] leading-none mb-8 text-[#06322b] tracking-tighter italic">
            403
          </h1>

          {/* Judul Pesan */}
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#06322b] leading-tight max-w-[400px]">
            Maaf, area ini hanya untuk yang sudah login
          </h2>
          
          {/* Deskripsi */}
          <p className="text-gray-500 text-sm md:text-base mb-10 max-w-[400px] leading-relaxed">
            Kamu perlu login dulu sebelum bisa akses halaman ini. Yuk masuk dulu!
          </p>

          {/* Grup Tombol Action */}
          <div className="flex items-center gap-8">
            <Button 
              asChild
              className="bg-[#5E8B7E] hover:bg-[#4d7268] text-white font-bold px-10 py-7 rounded-[18px] transition-all active:scale-95 border-none shadow-none text-md"
            >
              <Link href="/login">Login Sekarang</Link>
            </Button>

            <button 
              onClick={() => router.back()}
              className="text-[#032119] font-bold hover:underline underline-offset-4 transition-all text-md"
            >
              Kembali
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
}